const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { chatHandlers } = require("../controllers/chatController");

function initSocket(server, clientUrl) {
  const io = new Server(server, {
    cors: {
      origin: clientUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if(!token){
      return next (new Error("Authentication token required"));
    }

    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err){
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    chatHandlers(io, socket);
  });

  return io;
}

module.exports = initSocket;
