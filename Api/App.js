import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { CORS_ORIGIN } from "./Config/index.js";


// Setting up the express App
const App = express();

App.use((req, res, next) => {
  console.log(`[${req.method}] ==> ${req.url}`)
  next();
})

// Setting the corsOptions
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
App.use(cors(corsOptions));


// Setting the assets folder
const __dirname = dirname(fileURLToPath(import.meta.url));
App.use(express.static(path.join(__dirname, "./Assets")));
App.use("/assets", express.static(path.join(__dirname, "/dist/assets")));

App.use(express.json());

// Importing the routes
import authRouter from "./Routes/Auth.js";
import Users from "./Routes/Users.js";
import Messages from "./Routes/Messages.js";

// Setting up the routes
App.use("/api/auth", authRouter);
App.use("/api/users", Users);
App.use("/api/messages", Messages);

App.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});

export default App;