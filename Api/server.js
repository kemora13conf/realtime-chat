import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import MessagesModel from './Models/Messages.js';
import UsersModel from './Models/Users.js';

// Setting up the config
config();

// fetch https://my-portfolio-qp7l.onrender.com/ every 1 minute
setInterval(() => {
  fetch('https://my-portfolio-qp7l.onrender.com/')
    .then(res => console.log('fetched'))
    .catch(err => console.log(err.message))
}, 60000)


// Setting up the express app
const app = express();
const server = http.createServer(app);

// Setting up the socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

let users = {}

function getSocketId(userId){
  const keys = Object.keys(users)
  console.log('users ', users)
  keys.map((key,index) => {
    console.log(key, ' ', userId)
    if (key == userId) {
      return users[index]
    }
  })
}

async function updateUserSocket(userId, socketId){
  try {
    const user = await UsersModel
                  .findOneAndUpdate(
                    { _id: userId}, 
                    {$set : { socket: socketId}}, 
                    { new: true }
                  );
  } catch (error) {
    console.log(error.message)
  }
}

io.on('connection', (socket) => {
  console.log('A user connected ', socket.id);
  socket.on('connection-success', async (userId) => {
    await updateUserSocket(userId, socket.id)
  })
  
  socket.on('message', async (userId) => {
    try {
      const user = await UsersModel.findOne({ _id: userId });
      io.to(user.socket).emit('message');
    } catch (error) {
      console.log(error.message)
    }
  });
  socket.on('new-user', async ({ userId })=>{
    console.log("new user emitted")
    await updateUserSocket(userId, socket.id)
    socket.broadcast.emit('new-user', true)
  })
  
  socket.on('disconnect', async () => {
    console.log('A user disconnected ', socket.id);
    await UsersModel.findOneAndUpdate({ socket: socket.id },{ $set: { socket: '' } },{ new: true });
    socket.broadcast.emit('new-user', true);
  });
});

// Connecting to the database
console.log(process.env.MONGO_DB);
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Setting the assets folder
const __dirname = dirname(fileURLToPath(import.meta.url));

// Setting the corsOptions
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

// Setting up the middlewares
app.use(express.static(path.join(__dirname, 'Assets')));
app.use('/assets', express.static(path.join(__dirname, '/dist/assets')));
app.use(express.json());
app.use(cors(corsOptions));


// Importing the routes
import authRouter from './Routes/Auth.js';
import Users from './Routes/Users.js'
import Messages from './Routes/Messages.js'

// Setting up the routes
app.use('/api/auth', authRouter);
app.use('/api/users', Users);
app.use('/api/messages', Messages);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/dist/index.html'));
});

server.listen(5000, () => {
    console.log('Server is running on PORT http://localhost:5000');
});