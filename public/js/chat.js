// Initialize conncetion
const socket = io();

// Listen for an event
socket.on("countUpdated", (count) => {
  console.log("The count has been updated", count);
});

// Get button
document.querySelector("#increment").addEventListener("click", () => {
  console.log("clicked");

  // Create an event which will be listened for on the server
  socket.emit("increment");
});
