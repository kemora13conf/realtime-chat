import { config } from "dotenv";
import { Server } from "socket.io";
import http from "http";
import MessagesModel from "./Models/Messages.js";
import UsersModel from "./Models/Users.js";
import { CORS_ORIGIN, PORT } from "./Config/index.js";
import Database from "./Database.js";
import App from "./App.js";

const server = http.createServer(App);
// Setting up the socket.io
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

let users = {};

function getSocketId(userId) {
  const keys = Object.keys(users);
  console.log("users ", users);
  keys.map((key, index) => {
    console.log(key, " ", userId);
    if (key == userId) {
      return users[index];
    }
  });
}

async function updateUserSocket(userId, socketId) {
  try {
    const db = await Database.getInstance();
    const user = await UsersModel.findOneAndUpdate(
      { _id: userId },
      { $set: { socket: socketId } },
      { new: true }
    );
  } catch (error) {
    console.log(error.message);
  }
}

io.on("connection", (socket) => {
  console.log("A user connected ", socket.id);
  socket.on("connection-success", async (userId) => {
    await updateUserSocket(userId, socket.id);
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
  socket.on("new-user", async ({ userId }) => {
    const db = await Database.getInstance();
    console.log("new user emitted");
    await updateUserSocket(userId, socket.id);
    socket.broadcast.emit("new-user", true);
  });

  socket.on("disconnect", async () => {
    const db = await Database.getInstance();
    console.log("A user disconnected ", socket.id);
    await UsersModel.findOneAndUpdate(
      { socket: socket.id },
      { $set: { socket: "" } },
      { new: true }
    );
    socket.broadcast.emit("new-user", true);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT http://localhost:${PORT}`);
});
