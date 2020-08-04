const path = require("path");
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static assets
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

// Create server for socket io
const server = http.createServer(app);

// Initialize socket
const io = socketio(server);

// When a new socket is connected
io.on("connection", (socket) => {
  console.log("New web socket connection");

  // When user joins a room
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage("Admin", "Welcome"));

    // When a new user joins
    // socket.broadcast.emit send the message to other clients except the user
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username} has joined!`));
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  // Send message upon form submit
  socket.on("sendMessage", (message, callback) => {
    // use bad-words package to filter out profane words
    const user = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback("Delivered!"); // "Delivered" argument is passed as "data" to the client
  });

  // Send location
  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://google.com/maps?q=${latitude},${longitude}`
      )
    );
    callback();
  });

  // When a socket disconnects
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left`)
      );

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
