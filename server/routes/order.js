const express = require('express');
const { createOrder, getUserOrders } = require('../controllers/ordercontroller');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createOrder);
router.get('/my', auth, getUserOrders);

module.exports = router;