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
import { __dirname } from "./App.js";
import fs from "fs";
import path from "path";

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

io.use(async (socket, next) => {
  const authorization = socket.handshake.headers["authorization"];
  if (!authorization) {
    return next(new Error("Authentication error"));
  }
  const token = authorization.split(" ")[1];
  try {
    await Database.getInstance();
    let user = jwt.verify(token, JWT_SECRET);
    if (!user) {
      return next(new Error("Authentication error"));
    }
    user = await UsersModel.findOneAndUpdate(
      { _id: user._id },
      { last_seen: new Date() },
      { new: true }
    );
    if (!user) {
      return next(new Error("Authentication error"));
    }
    OnlineUsers.addUser({ userId: String(user._id), socketId: socket.id });
    socket.broadcast.emit("new-user-connected", { userId: String(user._id) });
    Logger.info(`A user connected ${socket.id} ${user.username}`);
    socket.user = user;
    next();
  } catch (error) {
    return next(new Error("Authentication error"));
  }
});


function generateFileName(originalname) {
  let arrName = originalname.split(".");
  let salt = Math.random().toString(36).substring(7);
  let extension = arrName[arrName.length - 1];
  let nameWithoutExtension = arrName.slice(0, arrName.length - 1).join(".");
  let saveAs = `${nameWithoutExtension}-${salt}.${extension}`;
  return saveAs;
}

function saveFile(file, name, location) {
  let saveAs = generateFileName(name);
  let filePath = path.join(__dirname, location, saveAs);
  fs.writeFileSync(filePath, file);
  return saveAs;
}

io.on("connection", (socket) => {
  socket.on("new-message", async (obj) => {
    try {
      const { data } = obj;
      let user = socket.user;
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

  socket.on("new-message-image", async (obj) => {
    try {
      let { file, name, receiver } = obj;
      let sender = socket.user;
      await Database.getInstance();
      let imageName = saveFile(file, name, "./Assets/Messages-files");
      let message = await Messages.create({
        sender: sender._id,
        receiver: receiver,
        type: "IMAGE",
        image: imageName,
      });
      let new_message = await Messages.findOne({ _id: message._id });
      receiver = OnlineUsers.getUserById(receiver);
      sender = OnlineUsers.getUserById(String(sender._id));
      if (sender) {
        io.to(sender.socketId).emit("new-message", new_message);
      }
      if (receiver) {
        io.to(receiver.socketId).emit("new-message", new_message);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("new-message-file", async (obj) => {
    console.log(obj);
    try {
      let { receiver, files } = obj;
      let sender = socket.user;
      await Database.getInstance();
      let fileNames = [];
      for (let file of files) {
        let fileName = saveFile(file.file, file.name, "./Assets/Messages-files");
        fileNames.push(fileName);
      }
      let message = await Messages.create({
        sender: sender._id,
        receiver: receiver,
        type: "FILE",
        files: fileNames,
      });
      let new_message = await Messages.findOne({ _id: message._id });
      receiver = OnlineUsers.getUserById(receiver);
      sender = OnlineUsers.getUserById(String(sender._id));
      if (sender) {
        io.to(sender.socketId).emit("new-message", new_message);
      }
      if (receiver) {
        io.to(receiver.socketId).emit("new-message", new_message);
      }
    } catch (error) {
      console.log(error);
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
