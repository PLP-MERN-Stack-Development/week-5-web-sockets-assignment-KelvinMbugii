const { Server } = require("socket.io");
const { chatHandlers } = require("../controllers/chatController");

function initSocket(server, clientUrl) {
  const io = new Server(server, {
    cors: {
      origin: clientUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    chatHandlers(io, socket);
  });

  return io;
}

module.exports = initSocket;
