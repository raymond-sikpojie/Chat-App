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
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const autoscroll = () => {
  // New message element
  const newMessage = messages.lastElementChild;

  // Get height of new message
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = messages.offsetHeight;

  // Height of messages container
  const containerHeight = messages.scrollHeight;

  // How far have I scrolled
  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

// Add "message" event listener
socket.on("message", (message) => {
  // console.log(message);

  // Add messages to the div which will contain dynamic content
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

// Add "locationMessage" event listener
socket.on("locationMessage", (message) => {
  // console.log(message);

  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
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

    // console.log(data);

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

// when user joins a room
// Options (using the qs library)
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
