import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Setting up the config
config();

// Setting up the express app
const app = express();

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
app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'This is the api for the realtime chat application' });
});

// Importing the routes
import authRouter from './Routes/Auth.js';
import Users from './Routes/Users.js'

// Setting up the routes
app.use('/api/auth', authRouter);
app.use('/api/users', Users);

app.listen(3000, () => {
    console.log('Server is running on PORT http://localhost:3000');
});