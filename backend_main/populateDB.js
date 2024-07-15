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