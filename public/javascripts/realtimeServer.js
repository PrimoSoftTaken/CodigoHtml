module.exports = httpServer=>{
  const {Server} = require("socket.io");
  const io = new Server(httpServer);
  io.on("connection", socket=>{
    socket.id;
  });
}