'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET is not defined in your environment variables.');
}

const login = async (req, res) => {
  try {
    const { username, password, organization } = req.body;

    if (!username || !password || !organization) {
      return res.status(400).send({ message: 'Username, password, and organization are required.' });
    }

    // Find the organization
    const org = await Organization.findOne({ name: organization });
    if (!org) {
      return res.status(404).send({ message: 'Organization not found.' });
    }

    // Find the user within that organization
    const user = await User.findOne({ email: username, 'association.organization': org._id });
    if (!user) {
      return res.status(401).send({ message: 'Authentication failed. User not found in this organization.' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Authentication failed. Invalid credentials.' });
    }

    // Create and assign a token
    const payload = {
      id: user.id,
      organization: org.id,
      // Add other user details to the payload as needed
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ message: 'An internal server error occurred.' });
  }
};

router.post('/login', login);

module.exports = router;
