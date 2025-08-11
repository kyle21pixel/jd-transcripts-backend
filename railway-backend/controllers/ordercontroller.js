const Order = require('../models/order');
const sendEmail = require('../utils/sendEmail');

exports.createOrder = async (req, res) => {
  try {
    const { serviceType, addOns, price } = req.body;
    const file = req.files.file;
    const filePath = `uploads/${Date.now()}_${file.name}`;
    await file.mv(filePath);

    const order = await Order.create({
      user: req.user.id,
      serviceType,
      addOns,
      fileUrl: filePath,
      price,
    });

    // Send confirmation email
    await sendEmail(req.user.email, 'Order Received', 'Your order has been received.');

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email');
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(order);
};