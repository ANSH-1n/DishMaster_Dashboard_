I this Project first  we used 'MERN-stack' for full stack.

make a folder 'INTERN_ASSIGNMENT_FINAL'  and inside it   make two folders 'frontend' and 'backend'.\

-----"intern"----is my mongodb databasse name 

1.BACKEND------------
  -install (  nodemon , express, mongoose, socket.io, http )

  step:1----- inside the backend folder first of all make another folder 'models' and inside it make a  file 'dishSchema.js'.-----------------------------------------

  code =  'dishSchema.js'.
  import mongoose from 'mongoose';
  const dishSchema = new mongoose.Schema({
  dishId: { type: String, required: true, unique: true },
  dishName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isPublished: { type: Boolean, required: true }
  });
 const Dish = mongoose.model('Dish', dishSchema);
 export default Dish;
 

 step:2----- inside the backend folder  make e a  file 'populatDB.js'.--------------------------------------------------------
 code =  'populatDB.js'.

 const mongoose = require('mongoose');
const Dish = require('./models/dishSchema');
const dishes = [
    {
    "dishName": "Jeera Rice",
    "dishId": "1",
    "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/jeera-rice.jpg",
    "isPublished": true
    },
    {
    "dishName": "Paneer Tikka",
    "dishId": "2",
    "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/paneer-tikka.jpg",
    "isPublished": true
    },
    {
    "dishName": "Rabdi",
    "dishId": "3",
    "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/rabdi.jpg",
    "isPublished": true
    },
    {
    "dishName": "Chicken Biryani",
    "dishId": "4",
    "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/chicken-biryani.jpg",
    "isPublished": true
    },
    {
    "dishName": "Alfredo Pasta",
    "dishId": "5",
    "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/alfredo-pasta.jpg",
    "isPublished": true
    }
];
mongoose.connect('mongodb://127.0.0.1/intern')//, { useNewUrlParser: true, useUnifiedTopology: true }
  .then(() => {
    console.log('Connected to MongoDB');
    return Dish.insertMany(dishes);
  })
  .then(() => {
    console.log('Database populated');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error populating database', err);
    mongoose.disconnect();
  });


step:3-------after doing this got to commandline and write 'node  populateDB.js' and then it will store your data into 'intern' database-------------------------------------------------

step: 4---------------------------------------------make a 'server.js' file and run  it .

code = 'server.js'

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
-----------------------------------------------------------------------------------------------------------------------------------
---------Inside the frontend folder make a react 'vite' project  and then istall  ('socket.io-client', 'axios').

step :1---make a folder inside 'src' folder i.e  'pages' and inside the pages file = ('Dashboard.jsx')

code  = ('Dashboard.jsx')

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5173'); // Ensure this is the correct port where your Socket.io server is running

const Dashboard = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
   // axios.get('http://localhost:3000/api/dishes')// Ensure this is the correct API URL
    axios.get('/api/dishes')
      .then(response => setDishes(response.data))
      .catch(error => console.error('Error fetching dishes:', error));

    socket.on('dishUpdated', (updatedDish) => {
      setDishes(prevDishes =>
        prevDishes.map(dish => (dish.dishId === updatedDish.dishId ? updatedDish : dish))
      );
    });

    return () => {
      socket.off('dishUpdated');
    };
  }, []);

  const togglePublishedStatus = (id) => {
    axios.put(`api/dishes/${id}/toggle`)
      .then(response => setDishes(prevDishes =>
        prevDishes.map(dish => (dish.dishId === response.data.dishId ? response.data : dish))
      ))
      .catch(error => console.error('Error toggling published status:', error));
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Dish Name</th>
            <th>Image</th>
            <th>Published</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map(dish => (
            <tr key={dish.dishId}>
              <td>{dish.dishName}</td>
              <td>
                <img src={dish.imageUrl} alt={dish.dishName} style={{ width: '100px' }} />
              </td>
              <td>{dish.isPublished ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => togglePublishedStatus(dish.dishId)}>
                  {dish.isPublished ? 'Unpublish' : 'Publish'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;


step 2 :-----------------------go to APP.jSX   
code -->


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
export default App;


step:3----------------make a small c hange in '' file.Inorder to rid  the problem of cors.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/': "http://localhost:3000"
    },
  },
  plugins: [react()],
})
git remote add origin https://github.com/ANSH-1n/INTERN_ASSIGNMENT_FINAL.git



----------"THAT'S  ALL ABOUT PROJECT RUN THIS PROJECT "
