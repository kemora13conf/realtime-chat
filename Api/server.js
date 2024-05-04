import { config } from "dotenv";
import { Server } from "socket.io";
import http from "http";
import MessagesModel from "./Models/Messages.js";
import UsersModel from "./Models/Users.js";
import { CORS_ORIGIN, PORT } from "./Config/index.js";
import Database from "./Database.js";
import App from "./App.js";
import OnlineUsers from "./Helpers/Online-user.js";

const server = http.createServer(App);
// Setting up the socket.io
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected ", socket.id);
  socket.on("connection-success", async (userId) => {
    try {
      const db = await Database.getInstance();
      const user = await UsersModel.findOneAndUpdate({ _id: userId }, { last_seen: new Date() }, { new: true });
      OnlineUsers.addUser({ userId, socketId: socket.id });
      socket.broadcast.emit("new-user", true);
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("message", async (userId) => {
    try {
      const db = await Database.getInstance();
      const user = await UsersModel.findOne({ _id: userId });
      io.to(user.socket).emit("message");
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("disconnect", async () => {
    console.log("A user disconnected ", socket.id);
    try {
      const db = await Database.getInstance();
      const user = OnlineUsers.getUserBySocketId(socket.id);
      if (user) {
        const cuser = await UsersModel.findOneAndUpdate(
          { _id: user.userId },
          { $set: { last_seen: new Date() } },
          { new: true }
        );
        OnlineUsers.removeUserBySocketId(socket.id);
        socket.broadcast.emit("user-disconnected", user.userId);
      }
      socket.broadcast.emit("new-user", true);
    } catch (error) {
      console.log(error.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT http://localhost:${PORT}`);
});
