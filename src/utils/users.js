const users = [];

const addUser = ({ id, username, room }) => {
  // Clean the data
  //   username = username.trim().toLowerCase();
  //   room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username to ensure user doesn't already exist
  if (existingUser) {
    return {
      error: "Username is in use",
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

// addUser({
//   id: 24,
//   username: "Andrew",
//   room: "art",
// });

// addUser({
//   id: 34,
//   username: "Max",
//   room: "sports",
// });

// addUser({
//   id: 44,
//   username: "Jon",
//   room: "music",
// });

// const user = getUsersInRoom("art");
// console.log(user);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
