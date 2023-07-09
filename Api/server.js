import express from 'express';
import mongoose from 'mongoose';


const app = express();


// Connecting to the database
mongoose.connect('mongodb+srv://abdomouak48:kEbEI3X6nCQH8DIO@realtime-chat.7qm0guu.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World' });
});

app.listen(3000, () => {
    console.log('Server is running on PORT http://localhost:3000');
});