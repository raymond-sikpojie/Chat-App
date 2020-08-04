// Initialize connection
const socket = io();

// Elements
const form = document.querySelector("#form");
const text = document.querySelector("#message");
const sendButton = document.querySelector("#send-btn");
const sendLocation = document.querySelector("#send-location");
const messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;

// Add "message" event listener
socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message,
  });
  messages.insertAdjacentHTML("beforeend", html);
});

// Add event listener
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = text.value;
  // Disable form button when clicked
  sendButton.setAttribute("disabled", "disabled");

  socket.emit("sendMessage", message, (data) => {
    // "data" comes from the callback argument in the server

    // Re-enable button after message has been sent
    sendButton.removeAttribute("disabled");

    text.value = "";

    text.focus();

    console.log(data);

    //   if (error) {
    //   return console.log(error);
    // }
    // console.log("Message delivered");
  });
});

sendLocation.addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  // Disable button temporarily
  e.target.setAttribute("disabled", "disabled");

  // get location
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    const coordinates = {
      latitude,
      longitude,
    };

    socket.emit("sendLocation", { latitude, longitude }, () => {
      // Re-enable button after message has been sent
      e.target.removeAttribute("disabled");

      console.log("Location shared");
    });
  });
});
