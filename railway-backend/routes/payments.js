const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/order');

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { orderId, amount } = req.body;

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                orderId: order._id.toString(),
                orderNumber: order.orderId,
                clientEmail: order.clientEmail
            },
            receipt_email: order.clientEmail,
            description: `JD Legal Transcripts - ${order.serviceType}`
        });

        // Update order with payment intent
        order.paymentIntentId = paymentIntent.id;
        order.paymentStatus = 'pending';
        order.timeline.push({
            action: 'Payment Intent Created',
            performedBy: 'System',
            notes: `Payment intent created for $${amount}`
        });
        await order.save();

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Payment intent creation error:', error);
        res.status(500).json({ success: false, message: 'Failed to create payment intent' });
    }
});

// Confirm payment
router.post('/confirm-payment', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
            // Find and update order
            const order = await Order.findById(paymentIntent.metadata.orderId);
            if (order) {
                order.paymentStatus = 'paid';
                order.actualCost = paymentIntent.amount / 100; // Convert from cents
                order.timeline.push({
                    action: 'Payment Confirmed',
                    performedBy: 'System',
                    notes: `Payment of $${order.actualCost} confirmed`
                });
                await order.save();

                // Send payment confirmation email
                const sendEmail = require('../utils/sendEmail');
                await sendEmail(
                    order.clientEmail,
                    'Payment Confirmation - JD Legal Transcripts',
                    `Dear ${order.clientName},

Your payment has been successfully processed!

Order Number: ${order.orderId}
Amount Paid: $${order.actualCost}
Service: ${order.serviceType}

We will begin processing your transcription immediately.

Best regards,
JD Legal Transcripts Team`
                );
            }

            res.json({ success: true, message: 'Payment confirmed' });
        } else {
            res.status(400).json({ success: false, message: 'Payment not successful' });
        }
    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({ success: false, message: 'Failed to confirm payment' });
    }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id);
            
            // Update order status
            const order = await Order.findById(paymentIntent.metadata.orderId);
            if (order && order.paymentStatus !== 'paid') {
                order.paymentStatus = 'paid';
                order.actualCost = paymentIntent.amount / 100;
                order.timeline.push({
                    action: 'Payment Webhook Received',
                    performedBy: 'Stripe',
                    notes: `Payment confirmed via webhook`
                });
                await order.save();
            }
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            
            // Update order status
            const failedOrder = await Order.findById(failedPayment.metadata.orderId);
            if (failedOrder) {
                failedOrder.paymentStatus = 'failed';
                failedOrder.timeline.push({
                    action: 'Payment Failed',
                    performedBy: 'Stripe',
                    notes: `Payment failed: ${failedPayment.last_payment_error?.message || 'Unknown error'}`
                });
                await failedOrder.save();
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

module.exports = router;