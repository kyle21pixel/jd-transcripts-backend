const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const emailController = require('../controllers/emailcontroller');

// Simple order creation without authentication for now
router.post('/', async (req, res) => {
    try {
        console.log('Order received:', req.body);
        
        // Generate a unique order ID
        const orderId = 'JD-' + Date.now();
        
        const orderData = {
            orderId: orderId,
            ...req.body,
            status: 'Received',
            createdAt: new Date().toISOString()
        };

        // Create email controller instance
        const emailCtrl = new emailController();
        
        // Send confirmation email to client
        try {
            // Send email to client
            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            
            // Send confirmation to client
            await transporter.sendMail({
                from: process.env.EMAIL_USER || 'jdreporting.org@gmail.com',
                to: req.body.clientEmail,
                subject: `Order Confirmation - ${orderId}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 20px; text-align: center;">
                            <h1 style="margin: 0;">Order Confirmation</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9;">JD Reporting Company</p>
                        </div>
                        
                        <div style="padding: 30px; background: #f8fafc;">
                            <h2 style="color: #1e293b; margin-top: 0;">Thank You for Your Order!</h2>
                            <p style="color: #374151; line-height: 1.6;">We have received your order and will begin processing it right away.</p>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="color: #1e293b; margin-top: 0;">Order Details</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Order ID:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Service Type:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${req.body.serviceType}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Turnaround:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${req.body.turnaround}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Estimated Cost:</td>
                                        <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${req.body.estimatedCost}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <p style="color: #374151; line-height: 1.6;">You can track the status of your order using your Order ID. If you have any questions, please contact us at support@jdreporting.org.</p>
                        </div>
                        
                        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px;">
                            <p style="margin: 0;">JD Reporting Company</p>
                            <p style="margin: 5px 0 0 0; opacity: 0.7;">Professional Transcription Services</p>
                        </div>
                    </div>
                `
            });
            
            // Send notification to admin
            await transporter.sendMail({
                from: process.env.EMAIL_USER || 'jdreporting.org@gmail.com',
                to: process.env.ADMIN_EMAIL || 'jdreporting.org@gmail.com',
                subject: `New Order Received - ${orderId}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 20px; text-align: center;">
                            <h1 style="margin: 0;">New Order Notification</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9;">JD Reporting Company</p>
                        </div>
                        
                        <div style="padding: 30px; background: #f8fafc;">
                            <h2 style="color: #1e293b; margin-top: 0;">Order Details</h2>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Order ID:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Client Name:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${req.body.clientName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${req.body.clientEmail}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${req.body.clientPhone || 'Not provided'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Service Type:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${req.body.serviceType}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Turnaround:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${req.body.turnaround}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Estimated Cost:</td>
                                        <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${req.body.estimatedCost}</td>
                                    </tr>
                                </table>
                            </div>

                            ${req.body.instructions ? `
                                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                    <h3 style="color: #1e293b; margin-top: 0;">Special Instructions</h3>
                                    <p style="color: #374151; line-height: 1.6;">${req.body.instructions}</p>
                                </div>
                            ` : ''}

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="https://jd-reporting-company.netlify.app/admin-login-new.html" 
                                   style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                    View in Admin Dashboard
                                </a>
                            </div>
                        </div>
                        
                        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px;">
                            <p style="margin: 0;">This is an automated notification from JD Reporting Company</p>
                            <p style="margin: 5px 0 0 0; opacity: 0.7;">Please do not reply to this email</p>
                        </div>
                    </div>
                `
            });
            
            console.log('Order confirmation emails sent');
        } catch (emailError) {
            console.error('Error sending order confirmation emails:', emailError);
            // Continue even if email fails
        }

        // In production, this would save to database
        // For now, just return success response
        res.json({
            success: true,
            message: 'Order received successfully',
            data: orderData
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// Get orders (simplified)
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Orders endpoint working',
        data: []
    });
});

module.exports = router;