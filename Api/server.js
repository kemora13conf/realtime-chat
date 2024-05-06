import { config } from "dotenv";
import { Server } from "socket.io";
import http from "http";
import UsersModel from "./Models/Users.js";
import { CORS_ORIGIN, JWT_SECRET, NODE_ENV, PORT } from "./Config/index.js";
import Database from "./Database.js";
import App from "./App.js";
import OnlineUsers from "./Helpers/Online-user.js";
import Logger from "./Helpers/Logger.js";
import os from "os";
import { argv } from "process";
import jwt from "jsonwebtoken";
import Messages from "./Models/Messages.js";

// getting args from the command line
const args = argv.slice(2);
const isHost = args.includes("--host");

const server = http.createServer(App);
// Setting up the socket.io
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  socket.on("user-connected", async (userId) => {
    try {
      await Database.getInstance();
      const user = await UsersModel.findOneAndUpdate(
        { _id: userId },
        { last_seen: new Date() },
        { new: true }
      );
      OnlineUsers.addUser({ userId, socketId: socket.id });
      socket.broadcast.emit("new-user-connected", { userId });
      Logger.info(`A user connected ${socket.id} ${user.username}`);
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("new-message", async (obj) => {
    try {
      const { token, data } = obj;
      if (!token) return;
      let user = jwt.verify(token, JWT_SECRET);
      await Database.getInstance();
      user = await UsersModel.findOne({ _id: user._id });
      if (!user) return;
      let newMessage = await Messages.create(data);
      newMessage = await Messages.findOne({ _id: newMessage._id });
      const receiver = OnlineUsers.getUserById(data.receiver);
      const sender = OnlineUsers.getUserById(data.sender);
      if (sender) {
        io.to(sender.socketId).emit("new-message", newMessage);
      }
      if (receiver) {
        io.to(receiver.socketId).emit("new-message", newMessage);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("disconnect", async () => {
    try {
      await Database.getInstance();
      const user = OnlineUsers.getUserBySocketId(socket.id);
      if (user) {
        const cuser = await UsersModel.findOneAndUpdate(
          { _id: user.userId },
          { $set: { last_seen: new Date() } },
          { new: true }
        );
        OnlineUsers.removeUserBySocketId(socket.id);
        socket.broadcast.emit("user-disconnected", { userId: user.userId });
        Logger.info(`A user disconnected ${socket.id} ${cuser.username}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  });
});
function _getLocalIp() {
  const interfaces = Object.keys(os.networkInterfaces());
  const localIp = os.networkInterfaces()[interfaces[0]][1].address;
  return localIp;
}
server.listen(PORT, isHost ? "0.0.0.0" : "127.0.0.1", () => {
  Logger.info(`==========================================`);
  Logger.info(`============ ENV: ${NODE_ENV} ============`);
  Logger.info(`🚀 App listening on the port ${PORT}`);
  Logger.info(
    `🏃 Running on http://${isHost ? _getLocalIp() : "127.0.0.1"}:${PORT}`
  );
  Logger.info(`==========================================`);
});
