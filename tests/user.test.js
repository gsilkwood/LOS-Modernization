const request = require('supertest');
const express = require('express');
const userRouter = require('../routes/user');
const User = require('../models/User');
const Organization = require('../models/Organization');
const jwt = require('jsonwebtoken');

// Mock the models
jest.mock('../models/User');
jest.mock('../models/Organization');

const app = express();
app.use(express.json());
app.use('/user', userRouter);

// We need a JWT to test protected routes.
const generateToken = (id, organization) => {
  return jwt.sign({ id, organization }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};


describe('User Routes', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /user/:id', () => {
    let token;
    beforeEach(() => {
      token = generateToken('requestingUserId', 'orgId123');
    });

    it('should return a user if found in the same organization', async () => {
      const mockUser = {
        _id: 'foundUserId',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        association: {
          organization: 'orgId123'
        },
      };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      const res = await request(app)
        .get('/user/foundUserId')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('email', 'john@example.com');
    });

    it('should return 404 if user is not found', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const res = await request(app)
        .get('/user/nonexistentUserId')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'User not found.');
    });

    it('should return 403 if user is in a different organization', async () => {
        const mockUser = {
            _id: 'foundUserId',
            email: 'john@anotherorg.com',
            association: {
              organization: 'orgId456' // Different organization
            },
          };
        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUser)
        });

        const res = await request(app)
          .get('/user/foundUserId')
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('message', 'Forbidden: You do not have access to this user.');
    });

    it('should return 400 for an invalid user ID format', async () => {
        User.findById.mockReturnValue({
            select: jest.fn().mockRejectedValue({ kind: 'ObjectId' })
        });

        const res = await request(app)
          .get('/user/invalid-id-format')
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Invalid user ID format.');
    });
  });

  describe('PUT /user/:id', () => {
    let token;

    it('should update a user profile successfully', async () => {
        token = generateToken('testUserId', 'orgId123');
        const mockUser = {
            _id: 'testUserId',
            first_name: 'Old',
            last_name: 'Name',
            email: 'old@example.com',
            save: jest.fn().mockResolvedValue({
                id: 'testUserId',
                first_name: 'New',
                last_name: 'Name',
                email: 'new@example.com',
            }),
        };
        User.findById.mockResolvedValue(mockUser);

        const res = await request(app)
            .put('/user/testUserId')
            .set('Authorization', `Bearer ${token}`)
            .send({ first_name: 'New', email: 'new@example.com' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('first_name', 'New');
        expect(res.body).toHaveProperty('email', 'new@example.com');
        expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return 403 when trying to update another user', async () => {
        token = generateToken('attackerUserId', 'orgId123'); // Token for a different user

        const res = await request(app)
            .put('/user/victimUserId') // Trying to update a different user
            .set('Authorization', `Bearer ${token}`)
            .send({ first_name: 'Malicious' });

        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('message', 'Forbidden: You can only update your own profile.');
    });

    it('should return 404 if the user to update is not found', async () => {
        token = generateToken('testUserId', 'orgId123');
        User.findById.mockResolvedValue(null);

        const res = await request(app)
            .put('/user/testUserId')
            .set('Authorization', `Bearer ${token}`)
            .send({ first_name: 'New' });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'User not found.');
    });
  });

  describe('DELETE /user/:id', () => {
    let token;

    it('should delete a user successfully', async () => {
        token = generateToken('testUserId', 'orgId123');
        const mockUser = {
            _id: 'testUserId',
            association: { organization: 'orgId123' },
            remove: jest.fn().mockResolvedValue(true),
        };
        User.findById.mockResolvedValue(mockUser);
        // We can also mock the Organization update if we want to be thorough
        jest.spyOn(Organization, 'updateOne').mockResolvedValue({ nModified: 1 });

        const res = await request(app)
            .delete('/user/testUserId')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'User deleted successfully.');
        expect(mockUser.remove).toHaveBeenCalled();
        expect(Organization.updateOne).toHaveBeenCalledWith(
            { _id: 'orgId123' },
            { $pull: { 'association.users': 'testUserId' } }
        );
    });

    it('should return 403 when trying to delete another user', async () => {
        token = generateToken('attackerUserId', 'orgId123');

        const res = await request(app)
            .delete('/user/victimUserId')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('message', 'Forbidden: You can only delete your own profile.');
    });

    it('should return 404 if the user to delete is not found', async () => {
        token = generateToken('testUserId', 'orgId123');
        User.findById.mockResolvedValue(null);

        const res = await request(app)
            .delete('/user/testUserId')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'User not found.');
    });
  });
});
