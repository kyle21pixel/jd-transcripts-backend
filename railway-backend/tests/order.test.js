const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Order = require('../models/order');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Mock user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  isAdmin: false
};

const testAdmin = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  isAdmin: true
};

// Mock order data
const testOrder = {
  serviceType: 'Legal Transcription',
  addOns: ['Timestamps', 'Speaker Identification'],
  price: 99.99
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
  await Order.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

// Before each test, clear the collections
beforeEach(async () => {
  await Order.deleteMany({});
  await User.deleteMany({});
});

// Helper function to create a token
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET || 'testsecret',
    { expiresIn: '1h' }
  );
};

describe('Order API', () => {
  describe('POST /api/orders', () => {
    it('should create a new order for authenticated user', async () => {
      // Create a user
      const user = await User.create(testUser);
      const token = createToken(user);

      // Create a mock file
      const mockFile = {
        name: 'test-audio.mp3',
        data: Buffer.from('test audio content'),
        mimetype: 'audio/mpeg',
        size: 1024,
        mv: jest.fn().mockResolvedValue(undefined)
      };

      // Create an order
      const res = await request(app)
        .post('/api/orders')
        .set('Cookie', [`token=${token}`])
        .field('serviceType', testOrder.serviceType)
        .field('addOns', JSON.stringify(testOrder.addOns))
        .field('price', testOrder.price)
        .attach('file', mockFile.data, mockFile.name);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('serviceType', testOrder.serviceType);
      expect(res.body).toHaveProperty('price', testOrder.price);
    });

    it('should not create an order without authentication', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send(testOrder);
      
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/orders', () => {
    it('should get user orders for authenticated user', async () => {
      // Create a user
      const user = await User.create(testUser);
      const token = createToken(user);

      // Create an order for the user
      await Order.create({
        user: user._id,
        ...testOrder
      });

      // Get user orders
      const res = await request(app)
        .get('/api/orders')
        .set('Cookie', [`token=${token}`]);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toEqual(1);
      expect(res.body[0]).toHaveProperty('serviceType', testOrder.serviceType);
    });

    it('should not get orders without authentication', async () => {
      const res = await request(app)
        .get('/api/orders');
      
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/orders/all', () => {
    it('should get all orders for admin user', async () => {
      // Create an admin user
      const admin = await User.create(testAdmin);
      const adminToken = createToken(admin);

      // Create a regular user
      const user = await User.create(testUser);

      // Create an order for the user
      await Order.create({
        user: user._id,
        ...testOrder
      });

      // Get all orders as admin
      const res = await request(app)
        .get('/api/orders/all')
        .set('Cookie', [`token=${adminToken}`]);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toEqual(1);
    });

    it('should not allow non-admin to get all orders', async () => {
      // Create a regular user
      const user = await User.create(testUser);
      const token = createToken(user);

      // Try to get all orders as non-admin
      const res = await request(app)
        .get('/api/orders/all')
        .set('Cookie', [`token=${token}`]);
      
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('PUT /api/orders/:id', () => {
    it('should update order status as admin', async () => {
      // Create an admin user
      const admin = await User.create(testAdmin);
      const adminToken = createToken(admin);

      // Create a regular user
      const user = await User.create(testUser);

      // Create an order for the user
      const order = await Order.create({
        user: user._id,
        ...testOrder
      });

      // Update order status
      const res = await request(app)
        .put(`/api/orders/${order._id}`)
        .set('Cookie', [`token=${adminToken}`])
        .send({ status: 'Completed' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'Completed');
    });

    it('should not allow non-admin to update order status', async () => {
      // Create a regular user
      const user = await User.create(testUser);
      const token = createToken(user);

      // Create an order for the user
      const order = await Order.create({
        user: user._id,
        ...testOrder
      });

      // Try to update order status as non-admin
      const res = await request(app)
        .put(`/api/orders/${order._id}`)
        .set('Cookie', [`token=${token}`])
        .send({ status: 'Completed' });
      
      expect(res.statusCode).toEqual(403);
    });
  });
});