// Initialize conncetion
const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

let text = document.querySelector("#message");
document.querySelector("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  let message = text.value;

  socket.emit("sendMessage", message);
  text.value = "";
});
