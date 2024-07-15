import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import Dish from './models/dishSchema.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1/intern')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// API to fetch the list of dishes
app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API to toggle the isPublished status of a dish
app.put('/api/dishes/:id/toggle', async (req, res) => {
  console.log('Dish ID:', req.params.id); // Log the ID for debugging
  try {
    const dish = await Dish.findOne({ dishId: req.params.id });
    if (!dish) {
      console.log('Dish not found for ID:', req.params.id); // Log if dish is not found
      return res.status(404).send('Dish not found');
    }
    
    dish.isPublished = !dish.isPublished;
    await dish.save();
    
    io.emit('dishUpdated', dish); // Emit an event when a dish is updated------------
    
    res.json(dish);
  } catch (err) {
    console.error('Error toggling isPublished status:', err); // Log any error-----------
    res.status(500).send(err.message);
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
