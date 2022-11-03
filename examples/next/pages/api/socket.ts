import { Server } from "socket.io";

const SocketHandler = (req: any, res: any) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, { path: "/api/socket" });
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      const interval = setInterval(() => {
        socket.emit("message", "Hello World!");
      }, 1000);
      socket.on("disconnect", () => {
        clearInterval(interval);
      });
    });
  }
  res.end();
};

export default SocketHandler;
