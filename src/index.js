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

  socket.emit("message", generateMessage("Welcome"));

  // When a new user joins
  // socket.broadcast.emit send the message to other clients except the user
  socket.broadcast.emit("message", generateMessage("A new user has joined"));

  // Send message upon form submit
  socket.on("sendMessage", (message, callback) => {
    // use bad-words package to filter out profane words
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    io.emit("message", generateMessage(message));
    callback("Delivered!"); // "Delivered" argument is passed as "data" to the client
  });

  // Send location
  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${latitude},${longitude}`
      )
    );
    callback();
  });

  // When a socket disconnects
  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left"));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
