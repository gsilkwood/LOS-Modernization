'use strict';
const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI is not defined in your environment variables.');
    console.error('Please create a .env file and add the MONGODB_URI variable.');
    return false;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('MongoDB connected...');
    return true;
  } catch (err) {
    console.error('MongoDB connection error: Could not connect to MongoDB.');
    console.error('Please ensure a local MongoDB server is running on mongodb://localhost:27017');
    // Do not exit the process. Allow the app to run in a limited state.
    return false;
  }
};

module.exports = connectDB;
