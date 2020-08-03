const path = require("path");
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");

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

// Add eventListener to io
io.on("connection", (socket) => {
  console.log("New web socket connection");

  socket.emit("message", "Welcome!");

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
