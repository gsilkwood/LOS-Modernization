'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Organization = require('../models/Organization');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/authMiddleware');

// Middleware for admin-only routes (placeholder)
const adminOnly = (req, res, next) => {
  // In a real app, this would check the user's role from the JWT or database
  next();
};


const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, organization_name } = req.body;

    if (!email || !password || !organization_name) {
      return res.status(400).json({ message: 'Email, password, and organization name are required.' });
    }

    const organization = await Organization.findOne({ name: organization_name });
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found.' });
    }

    const existingUser = await User.findOne({ email, 'association.organization': organization._id });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists in this organization.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      association: {
        organization: organization._id,
      },
      // Default other fields like status, userroles etc.
      status: {
        active: true, // Or false until email verification
        email_verified: false,
      },
    });

    const savedUser = await newUser.save();

    // Add user to organization's user list
    organization.association.users.push(savedUser._id);
    await organization.save();

    res.status(201).json({
      message: 'User created successfully.',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        first_name: savedUser.first_name,
        last_name: savedUser.last_name,
      },
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password from result

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Basic authorization: Ensure the requesting user is in the same organization
    // Note: In a real app, req.user.organization would be populated from the JWT token.
    // We are simulating this for now. A proper implementation would decode the token in 'protect'.
    if (req.user.organization.toString() !== user.association.organization.toString()) {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this user.' });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error('Get user error:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email } = req.body;

        // Authorization: For now, we'll allow a user to update themselves.
        // A more robust implementation would check roles (e.g., admin can update others).
        if (req.user.id !== id) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update fields
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.email = email || user.email;
        // Add other updatable fields as necessary

        const updatedUser = await user.save();

        res.status(200).json({
            id: updatedUser.id,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            email: updatedUser.email,
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Authorization: For now, we'll allow a user to delete themselves.
        if (req.user.id !== id) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own profile.' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Remove the user
        await user.remove();

        // Also, remove the user from their organization's list of users
        await Organization.updateOne(
            { _id: user.association.organization },
            { $pull: { 'association.users': user._id } }
        );

        res.status(200).json({ message: 'User deleted successfully.' });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};


router.post('/new', protect, adminOnly, createUser);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
