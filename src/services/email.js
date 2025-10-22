require('dotenv').config();
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendEmail(to, subject, html) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                html
            });

            logger.info('Email sent:', info.messageId);
            return true;
        } catch (error) {
            logger.error('Error sending email:', error);
            return false;
        }
    }

    async sendOrderConfirmation(order, customerEmail) {
        const subject = `Order Confirmation - #${order.id}`;
        const html = `
            <h1>Thank you for your order!</h1>
            <p>Your order #${order.id} has been received and is being processed.</p>
            <h2>Order Details:</h2>
            <ul>
                <li>Service Type: ${order.service_type}</li>
                <li>Duration: ${order.duration_minutes} minutes</li>
                <li>Status: ${order.status}</li>
            </ul>
            <p>We will keep you updated on the progress of your order.</p>
        `;

        return this.sendEmail(customerEmail, subject, html);
    }

    async sendStatusUpdate(order, customerEmail) {
        const subject = `Order #${order.id} Status Update`;
        const html = `
            <h1>Order Status Update</h1>
            <p>Your order #${order.id} has been updated.</p>
            <h2>Current Status: ${order.status}</h2>
            <p>If you have any questions, please don't hesitate to contact us.</p>
        `;

        return this.sendEmail(customerEmail, subject, html);
    }

    async sendStaffAssignment(order, staffEmail) {
        const subject = `New Order Assignment - #${order.id}`;
        const html = `
            <h1>New Order Assignment</h1>
            <p>You have been assigned to order #${order.id}.</p>
            <h2>Order Details:</h2>
            <ul>
                <li>Service Type: ${order.service_type}</li>
                <li>Duration: ${order.duration_minutes} minutes</li>
                <li>Urgent: ${order.urgent ? 'Yes' : 'No'}</li>
                <li>Special Instructions: ${order.special_instructions || 'None'}</li>
            </ul>
            <p>Please begin work on this order as soon as possible.</p>
        `;

        return this.sendEmail(staffEmail, subject, html);
    }
}

module.exports = new EmailService();