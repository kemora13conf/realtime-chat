import { Server } from "socket.io";
import http from "http";
import UsersModel from "./Models/Users.js";
import { CORS_ORIGIN, JWT_SECRET, NODE_ENV, PORT } from "./Config/index.js";
import Database from "./Database.js";
import App from "./App.js";
import Logger from "./Helpers/Logger.js";
import os from "os";
import { argv } from "process";
import jwt from "jsonwebtoken";
import { __dirname } from "./App.js";

// getting args from the command line
const args = argv.slice(2);
const isHost = args.includes("--host");

// // fetch https://my-portfolio-qp7l.onrender.com/ every 1 minute
// setInterval(() => {
//   axios.get('https://my-portfolio-qp7l.onrender.com/')
//     .then(res => console.log('fetched'))
//     .catch(err => console.log(err.message))
// }, 60000)

const server = http.createServer(App);
// Setting up the socket.io
export  const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

/**
 * Middleware to authenticate the user
 * @param {Socket} socket
 * @param {NextFunction} next
 * @returns {Promise<void>} next function or error if not authenticated or user not found.
 */
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
    socket.join(String(user._id));
    socket.broadcast.emit("new-user-connected", { userId: String(user._id) });
    Logger.info(`A user connected ${socket.id} ${user.username}`);
    socket.user = user;
    next();
  } catch (error) {
    return next(new Error("Authentication error"));
  }
});

/**
 * Middleware to log the error
 * @param {Error} error
 * @param {Socket} socket
 * @returns {void} logs the error
 */
io.on("connection", (socket) => {

  /**
   * Listen for disconnect event
   * @listens disconnect
   * @description When a user disconnects, the user is removed from the online users list
   * and the user is updated in the database
   */
  socket.on("disconnect", async () => {
    try {
      socket.user.last_seen = new Date();
      await socket.user.save();
      socket.broadcast.emit("user-disconnected", { userId: String(socket.user._id) });
      Logger.info(`A user disconnected ${socket.id} ${socket.user.username}`);

      // leave the room
      socket.leave(String(socket.user._id));
    } catch (error) {
      console.log(error.message);
    }
  });
});

/**
 * @function _getLocalIp
 * @description Get the local IP address of the server
 * @returns {string} local IP address
 */
function _getLocalIp() {
  const interfaces = Object.keys(os.networkInterfaces());
  const localIp = os.networkInterfaces()[interfaces[0]][1].address;
  return localIp;
}

/**
 * @Server listens on the PORT
 * @description Server listens on the PORT and logs the PORT and IP address
 * @listens PORT
 * @returns {void} logs the PORT and IP address
 */
server.listen(PORT, isHost ? "0.0.0.0" : "127.0.0.1", () => {
  Logger.info(`==========================================`);
  Logger.info(`============ ENV: ${NODE_ENV} ============`);
  Logger.info(`🚀 App listening on the port ${PORT}`);
  Logger.info(
    `🏃 Running on http://${isHost ? _getLocalIp() : "127.0.0.1"}:${PORT}`
  );
  Logger.info(`==========================================`);
});

// server.listen(PORT, () => {
//   Logger.info(`==========================================`);
//   Logger.info(`============ ENV: ${NODE_ENV} ============`);
//   Logger.info(`🚀 App listening on the port ${PORT}`);
//   Logger.info(
//     `🏃 Running on http://${isHost ? _getLocalIp() : "127.0.0.1"}:${PORT}`
//   );
//   Logger.info(`==========================================`);
// });