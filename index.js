'use strict';

require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./utils/db');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const organizationRouter = require('./routes/organization');

// Connect to MongoDB
let dbConnected = false;
connectDB().then(connected => {
  dbConnected = connected;
});

// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/organization', organizationRouter);

app.get('/', (req, res) => {
  res.send('ClariFI Server is Running!\\n');
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
