const request = require('supertest');
const express = require('express');
const organizationRouter = require('../routes/organization');
const Organization = require('../models/Organization');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Mock the models
jest.mock('../models/Organization');
jest.mock('../models/User');


const app = express();
app.use(express.json());
app.use('/organization', organizationRouter);

const generateToken = (id, organization) => {
    return jwt.sign({ id, organization }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe('Organization Routes', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /organization/:id', () => {
        let token;

        it('should return an organization if the user belongs to it', async () => {
            token = generateToken('userId', 'orgId123');
            const mockOrg = {
                _id: 'orgId123',
                name: 'Test Org',
                association: { users: [] }
            };
            Organization.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockOrg)
            });

            const res = await request(app)
                .get('/organization/orgId123')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('name', 'Test Org');
        });

        it('should return 403 if the user does not belong to the organization', async () => {
            token = generateToken('userId', 'anotherOrgId');

            const res = await request(app)
                .get('/organization/orgId123')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(403);
            expect(res.body).toHaveProperty('message', 'Forbidden: You do not have access to this organization.');
        });

        it('should return 404 if the organization is not found', async () => {
            token = generateToken('userId', 'orgId123');
            Organization.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });

            const res = await request(app)
                .get('/organization/orgId123')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Organization not found.');
        });
    });

  describe('PUT /organization/:id', () => {
    let token;

    it('should update an organization successfully', async () => {
        token = generateToken('userId', 'orgId123');
        const mockOrg = {
            _id: 'orgId123',
            name: 'Old Name',
            save: jest.fn().mockResolvedValue({
                id: 'orgId123',
                name: 'New Name',
            }),
        };
        Organization.findById.mockResolvedValue(mockOrg);

        const res = await request(app)
            .put('/organization/orgId123')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'New Name' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'New Name');
        expect(mockOrg.save).toHaveBeenCalled();
    });

    it('should return 403 when trying to update a different organization', async () => {
        token = generateToken('userId', 'anotherOrg');

        const res = await request(app)
            .put('/organization/orgId123')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Malicious Name' });

        expect(res.statusCode).toEqual(403);
    });

    it('should return 404 if the organization to update is not found', async () => {
        token = generateToken('userId', 'orgId123');
        Organization.findById.mockResolvedValue(null);

        const res = await request(app)
            .put('/organization/orgId123')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'New Name' });

        expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /organization/:id', () => {
    let token;

    it('should delete an organization and its users successfully', async () => {
        token = generateToken('userId', 'orgId123');
        const mockOrg = {
            _id: 'orgId123',
            name: 'Test Org',
            remove: jest.fn().mockResolvedValue(true),
        };
        Organization.findById.mockResolvedValue(mockOrg);
        User.deleteMany.mockResolvedValue({ deletedCount: 5 }); // Simulate deleting 5 users

        const res = await request(app)
            .delete('/organization/orgId123')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Organization and all associated users deleted successfully.');
        expect(mockOrg.remove).toHaveBeenCalled();
        expect(User.deleteMany).toHaveBeenCalledWith({ 'association.organization': 'orgId123' });
    });

    it('should return 403 when trying to delete a different organization', async () => {
        token = generateToken('userId', 'anotherOrg');

        const res = await request(app)
            .delete('/organization/orgId123')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(403);
    });

    it('should return 404 if the organization to delete is not found', async () => {
        token = generateToken('userId', 'orgId123');
        Organization.findById.mockResolvedValue(null);

        const res = await request(app)
            .delete('/organization/orgId123')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(404);
    });
  });
});
