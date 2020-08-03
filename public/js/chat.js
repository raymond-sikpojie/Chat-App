const text = document.querySelector("#message");
const sendLocation = document.querySelector("#send-location");

// Initialize conncetion
const socket = io();

// Add "message" event listener
socket.on("message", (message) => {
  console.log(message);
});

// Add event listener
document.querySelector("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  let message = text.value;

  socket.emit("sendMessage", message, (data) => {
    // "data" comes from the callback argument in the server
    console.log(data);

    //   if (error) {
    //   return console.log(error);
    // }
    // console.log("Message delivered");
  });
  text.value = "";
});

sendLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }

  // get location
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    const coordinates = {
      latitude,
      longitude,
    };
    socket.emit("sendLocation", { latitude, longitude }, () => {
      console.log("Location shared");
    });
  });
});
