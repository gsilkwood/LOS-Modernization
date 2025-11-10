'use strict';

const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id; // From our 'protect' middleware

    if (!name) {
      return res.status(400).json({ message: 'Organization name is required.' });
    }

    const existingOrg = await Organization.findOne({ name });
    if (existingOrg) {
      return res.status(400).json({ message: 'An organization with this name already exists.' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'Creating user not found.' });
    }

    const newOrg = new Organization({
      name,
      'association.users': [userId],
      entitytype: 'organization',
      status: { active: true }, // Activate orgs by default for simplicity
    });

    const savedOrg = await newOrg.save();

    // Update the user to be associated with this new organization
    user.association.organization = savedOrg._id;
    await user.save();

    res.status(201).json({
      message: 'Organization created successfully.',
      organization: {
        id: savedOrg.id,
        name: savedOrg.name,
      },
    });

  } catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

const getOrganizationById = async (req, res) => {
    try {
        const { id } = req.params;

        // Authorization: Ensure the requesting user belongs to this organization.
        if (req.user.organization.toString() !== id) {
            return res.status(403).json({ message: 'Forbidden: You do not have access to this organization.' });
        }

        const org = await Organization.findById(id).populate('association.users', 'first_name last_name email'); // Populate user details

        if (!org) {
            return res.status(404).json({ message: 'Organization not found.' });
        }

        res.status(200).json(org);

    } catch (error) {
        console.error('Get organization error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid organization ID format.' });
        }
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};


const updateOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Authorization: Ensure the user belongs to this organization
        if (req.user.organization.toString() !== id) {
            return res.status(403).json({ message: 'Forbidden: You do not have access to this organization.' });
        }

        const org = await Organization.findById(id);

        if (!org) {
            return res.status(404).json({ message: 'Organization not found.' });
        }

        // Update fields
        org.name = name || org.name;
        // Add other updatable fields as necessary

        const updatedOrg = await org.save();

        res.status(200).json({
            id: updatedOrg.id,
            name: updatedOrg.name,
        });

    } catch (error) {
        console.error('Update organization error:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};


const deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;

        // Authorization: Ensure the user belongs to this organization
        if (req.user.organization.toString() !== id) {
            return res.status(403).json({ message: 'Forbidden: You do not have access to this organization.' });
        }

        const org = await Organization.findById(id);

        if (!org) {
            return res.status(404).json({ message: 'Organization not found.' });
        }

        // Before deleting the organization, delete all users associated with it.
        await User.deleteMany({ 'association.organization': id });

        // Now, delete the organization itself.
        await org.remove();

        res.status(200).json({ message: 'Organization and all associated users deleted successfully.' });

    } catch (error) {
        console.error('Delete organization error:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};


router.post('/new', protect, createOrganization);
router.get('/:id', protect, getOrganizationById);
router.put('/:id', protect, updateOrganization);
router.delete('/:id', protect, deleteOrganization);

module.exports = router;
