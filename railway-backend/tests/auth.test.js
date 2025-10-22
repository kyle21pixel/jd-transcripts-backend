const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Mock user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Before all tests, connect to the test database
beforeAll(async () => {
  const url = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/jd-transcripts-test';
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// After all tests, disconnect from the database
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

// Before each test, clear the users collection
beforeEach(async () => {
  await User.deleteMany({});
});

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User registered');
    });

    it('should not register a user with an existing email', async () => {
      // First create a user
      await User.create(testUser);

      // Try to create another user with the same email
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user with valid credentials', async () => {
      // First create a user
      await User.create(testUser);

      // Login with the user
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Logged in');
      expect(res.body).toHaveProperty('user');
      expect(res.headers).toHaveProperty('set-cookie');
    });

    it('should not login a user with invalid credentials', async () => {
      // First create a user
      await User.create(testUser);

      // Login with wrong password
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout a user', async () => {
      const res = await request(app)
        .post('/api/auth/logout');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Logged out');
    });
  });
});