const request = require('supertest');
const express = require('express');
const authRouter = require('../routes/auth');
const User = require('../models/User');
const Organization = require('../models/Organization');
const bcrypt = require('bcryptjs');

// Mock the models
jest.mock('../models/User');
jest.mock('../models/Organization');
jest.mock('bcryptjs');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
  describe('POST /auth/login', () => {

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 404 if organization is not found', async () => {
      Organization.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'test@example.com',
          password: 'password',
          organization: 'nonexistentorg',
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Organization not found.');
    });

    it('should return 401 if user is not found in the organization', async () => {
      Organization.findOne.mockResolvedValue({ _id: 'orgId', name: 'testorg' });
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'nouser@example.com',
          password: 'password',
          organization: 'testorg',
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Authentication failed. User not found in this organization.');
    });

    it('should return 401 for invalid credentials (wrong password)', async () => {
      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword',
        association: { organization: 'orgId' }
      };
      Organization.findOne.mockResolvedValue({ _id: 'orgId', name: 'testorg' });
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false); // Simulate wrong password

      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'test@example.com',
          password: 'wrongpassword',
          organization: 'testorg',
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Authentication failed. Invalid credentials.');
    });

    it('should return a JWT token for a successful login', async () => {
      const mockUser = {
        id: 'userId',
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword',
        first_name: 'Test',
        last_name: 'User',
        association: { organization: 'orgId' }
      };
      Organization.findOne.mockResolvedValue({ id:'orgId', _id: 'orgId', name: 'testorg' });
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true); // Simulate correct password

      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'test@example.com',
          password: 'correctpassword',
          organization: 'testorg',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toEqual({
        id: 'userId',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      });
    });
  });
});
