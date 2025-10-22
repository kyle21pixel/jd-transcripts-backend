const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const EmailController = require('../controllers/emailcontroller');
const emailController = new EmailController();

// @desc    Create payment intent with Stripe
// @route   POST /api/payment/create-payment-intent
// @access  Public
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    // Validate input
    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and amount are required'
      });
    }

    // Find order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: orderId,
        clientName: order.clientName,
        clientEmail: order.clientEmail
      }
    });

    // Return client secret
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
});

// @desc    Process PayPal payment
// @route   POST /api/payment/process-paypal
// @access  Public
router.post('/process-paypal', async (req, res) => {
  try {
    const { orderId, paymentId, payerEmail, amount } = req.body;

    // Validate input
    if (!orderId || !paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and payment ID are required'
      });
    }

    // Find order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order with payment info
    order.paymentStatus = 'Paid';
    order.paymentMethod = 'PayPal';
    order.paymentId = paymentId;
    order.paymentAmount = amount;

    // Add timeline entry
    order.timeline.push({
      action: 'Payment Processed',
      timestamp: new Date(),
      performedBy: 'System',
      notes: `Payment of $${amount} processed via PayPal (${paymentId})`
    });

    // Save order
    await order.save();

    // Send payment confirmation email
    try {
      await emailController.sendPaymentConfirmation(order);
    } catch (emailError) {
      console.error('Error sending payment confirmation email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'PayPal payment processed successfully',
      data: {
        orderId: order.orderId,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    console.error('Process PayPal payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process PayPal payment',
      error: error.message
    });
  }
});

// @desc    Webhook for Stripe events
// @route   POST /api/payment/webhook
// @access  Public
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.rawBody, // Note: requires special body parsing setup
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      // Find and update order
      const order = await Order.findOne({ orderId });
      if (order) {
        order.paymentStatus = 'Paid';
        order.paymentMethod = 'Stripe';
        order.paymentId = paymentIntent.id;
        order.paymentAmount = paymentIntent.amount / 100; // Convert from cents

        // Add timeline entry
        order.timeline.push({
          action: 'Payment Processed',
          timestamp: new Date(),
          performedBy: 'System',
          notes: `Payment of $${order.paymentAmount} processed via Stripe (${paymentIntent.id})`
        });

        // Save order
        await order.save();

        // Send payment confirmation email
        try {
          await emailController.sendPaymentConfirmation(order);
        } catch (emailError) {
          console.error('Error sending payment confirmation email:', emailError);
        }
      }
    }

    // Return success response
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;