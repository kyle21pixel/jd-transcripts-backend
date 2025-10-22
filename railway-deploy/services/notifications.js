const EventEmitter = require('events');
const sendEmail = require('../utils/sendEmail');

class NotificationService extends EventEmitter {
    constructor() {
        super();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Order events
        this.on('order:created', this.handleOrderCreated.bind(this));
        this.on('order:status_changed', this.handleOrderStatusChanged.bind(this));
        this.on('order:assigned', this.handleOrderAssigned.bind(this));
        this.on('order:completed', this.handleOrderCompleted.bind(this));
        this.on('order:overdue', this.handleOrderOverdue.bind(this));

        // Payment events
        this.on('payment:received', this.handlePaymentReceived.bind(this));
        this.on('payment:failed', this.handlePaymentFailed.bind(this));

        // System events
        this.on('system:error', this.handleSystemError.bind(this));
    }

    // Order created notification
    async handleOrderCreated(orderData) {
        try {
            // Email to client
            await sendEmail(
                orderData.clientEmail,
                'Order Confirmation - JD Legal Transcripts',
                this.generateOrderConfirmationEmail(orderData)
            );

            // Email to admin
            await sendEmail(
                process.env.ADMIN_EMAIL,
                'New Order Received',
                this.generateNewOrderAdminEmail(orderData)
            );

            console.log(`✅ Order created notifications sent for ${orderData.orderId}`);
        } catch (error) {
            console.error('Order created notification error:', error);
        }
    }

    // Order status changed notification
    async handleOrderStatusChanged(orderData) {
        try {
            const statusMessages = {
                'in-progress': 'Your transcription is now being processed',
                'completed': 'Your transcription is ready for download',
                'cancelled': 'Your order has been cancelled',
                'revision-requested': 'Revision requested for your transcription'
            };

            const message = statusMessages[orderData.status] || 'Your order status has been updated';

            await sendEmail(
                orderData.clientEmail,
                `Order Update - ${orderData.orderId}`,
                this.generateStatusUpdateEmail(orderData, message)
            );

            console.log(`✅ Status update notification sent for ${orderData.orderId}`);
        } catch (error) {
            console.error('Status update notification error:', error);
        }
    }

    // Order assigned notification
    async handleOrderAssigned(orderData) {
        try {
            await sendEmail(
                orderData.clientEmail,
                `Transcriber Assigned - ${orderData.orderId}`,
                this.generateAssignmentEmail(orderData)
            );

            console.log(`✅ Assignment notification sent for ${orderData.orderId}`);
        } catch (error) {
            console.error('Assignment notification error:', error);
        }
    }

    // Order completed notification
    async handleOrderCompleted(orderData) {
        try {
            await sendEmail(
                orderData.clientEmail,
                `Transcription Complete - ${orderData.orderId}`,
                this.generateCompletionEmail(orderData)
            );

            console.log(`✅ Completion notification sent for ${orderData.orderId}`);
        } catch (error) {
            console.error('Completion notification error:', error);
        }
    }

    // Order overdue notification
    async handleOrderOverdue(orderData) {
        try {
            // Notify admin about overdue order
            await sendEmail(
                process.env.ADMIN_EMAIL,
                `URGENT: Overdue Order - ${orderData.orderId}`,
                this.generateOverdueAdminEmail(orderData)
            );

            // Notify client about delay
            await sendEmail(
                orderData.clientEmail,
                `Order Delay Notification - ${orderData.orderId}`,
                this.generateDelayClientEmail(orderData)
            );

            console.log(`⚠️ Overdue notifications sent for ${orderData.orderId}`);
        } catch (error) {
            console.error('Overdue notification error:', error);
        }
    }

    // Payment received notification
    async handlePaymentReceived(paymentData) {
        try {
            await sendEmail(
                paymentData.clientEmail,
                'Payment Confirmation - JD Legal Transcripts',
                this.generatePaymentConfirmationEmail(paymentData)
            );

            console.log(`✅ Payment confirmation sent for ${paymentData.orderId}`);
        } catch (error) {
            console.error('Payment confirmation error:', error);
        }
    }

    // Payment failed notification
    async handlePaymentFailed(paymentData) {
        try {
            await sendEmail(
                paymentData.clientEmail,
                'Payment Issue - JD Legal Transcripts',
                this.generatePaymentFailedEmail(paymentData)
            );

            console.log(`❌ Payment failed notification sent for ${paymentData.orderId}`);
        } catch (error) {
            console.error('Payment failed notification error:', error);
        }
    }

    // System error notification
    async handleSystemError(errorData) {
        try {
            await sendEmail(
                process.env.ADMIN_EMAIL,
                'System Error Alert - JD Legal Transcripts',
                this.generateSystemErrorEmail(errorData)
            );

            console.log(`🚨 System error notification sent`);
        } catch (error) {
            console.error('System error notification error:', error);
        }
    }

    // Email template generators
    generateOrderConfirmationEmail(orderData) {
        return `Dear ${orderData.clientName},

Thank you for choosing JD Legal Transcripts! Your order has been received and is being processed.

Order Details:
- Order Number: ${orderData.orderId}
- Service: ${orderData.serviceType}
- Turnaround: ${orderData.turnaround}
- Estimated Cost: ${orderData.estimatedCost}
- Due Date: ${new Date(orderData.dueDate).toLocaleDateString()}

We will keep you updated on the progress of your transcription.

Best regards,
JD Legal Transcripts Team

---
Need help? Reply to this email or visit our website.`;
    }

    generateNewOrderAdminEmail(orderData) {
        return `New order received:

Order Number: ${orderData.orderId}
Client: ${orderData.clientName} (${orderData.clientEmail})
Service: ${orderData.serviceType}
Turnaround: ${orderData.turnaround}
Estimated Cost: ${orderData.estimatedCost}
Due Date: ${new Date(orderData.dueDate).toLocaleDateString()}

Instructions: ${orderData.instructions || 'None'}

Please review and assign to a transcriber.

Admin Dashboard: ${process.env.FRONTEND_URL}/admin-dashboard.html`;
    }

    generateStatusUpdateEmail(orderData, message) {
        return `Dear ${orderData.clientName},

${message}

Order Details:
- Order Number: ${orderData.orderId}
- Current Status: ${orderData.status.toUpperCase()}
- Service: ${orderData.serviceType}
${orderData.assignedTranscriberName ? `- Assigned to: ${orderData.assignedTranscriberName}` : ''}

${orderData.status === 'completed' ? 'Your completed transcription is attached to this email or available for download.' : ''}

Best regards,
JD Legal Transcripts Team`;
    }

    generateAssignmentEmail(orderData) {
        return `Dear ${orderData.clientName},

Great news! Your transcription has been assigned to one of our professional transcribers.

Order Details:
- Order Number: ${orderData.orderId}
- Assigned to: ${orderData.assignedTranscriberName}
- Expected completion: ${new Date(orderData.dueDate).toLocaleDateString()}

Your transcriber will begin working on your project shortly.

Best regards,
JD Legal Transcripts Team`;
    }

    generateCompletionEmail(orderData) {
        return `Dear ${orderData.clientName},

Excellent news! Your transcription is now complete and ready for download.

Order Details:
- Order Number: ${orderData.orderId}
- Service: ${orderData.serviceType}
- Completed by: ${orderData.assignedTranscriberName || 'Our team'}
- Final Cost: $${orderData.actualCost || 'As quoted'}

Your completed transcription files are attached to this email.

Thank you for choosing JD Legal Transcripts!

Best regards,
JD Legal Transcripts Team`;
    }

    generateOverdueAdminEmail(orderData) {
        return `URGENT: Order is overdue!

Order Number: ${orderData.orderId}
Client: ${orderData.clientName} (${orderData.clientEmail})
Service: ${orderData.serviceType}
Due Date: ${new Date(orderData.dueDate).toLocaleDateString()}
Days Overdue: ${Math.ceil((new Date() - new Date(orderData.dueDate)) / (1000 * 60 * 60 * 24))}

Please take immediate action to complete this order.

Admin Dashboard: ${process.env.FRONTEND_URL}/admin-dashboard.html`;
    }

    generateDelayClientEmail(orderData) {
        return `Dear ${orderData.clientName},

We sincerely apologize for the delay with your transcription order.

Order Details:
- Order Number: ${orderData.orderId}
- Original Due Date: ${new Date(orderData.dueDate).toLocaleDateString()}

We are working diligently to complete your transcription as soon as possible and will provide you with an updated timeline shortly.

Thank you for your patience and understanding.

Best regards,
JD Legal Transcripts Team`;
    }

    generatePaymentConfirmationEmail(paymentData) {
        return `Dear ${paymentData.clientName},

Your payment has been successfully processed!

Payment Details:
- Order Number: ${paymentData.orderId}
- Amount: $${paymentData.amount}
- Payment Method: ${paymentData.paymentMethod || 'Card'}
- Transaction ID: ${paymentData.transactionId}

We will begin processing your transcription immediately.

Best regards,
JD Legal Transcripts Team`;
    }

    generatePaymentFailedEmail(paymentData) {
        return `Dear ${paymentData.clientName},

We encountered an issue processing your payment for order ${paymentData.orderId}.

Issue: ${paymentData.errorMessage || 'Payment could not be processed'}

Please try again or contact us for assistance. Your order is on hold until payment is received.

Best regards,
JD Legal Transcripts Team`;
    }

    generateSystemErrorEmail(errorData) {
        return `System Error Alert

Error: ${errorData.error}
Time: ${new Date().toISOString()}
Component: ${errorData.component || 'Unknown'}
User: ${errorData.user || 'System'}

Stack Trace:
${errorData.stack || 'Not available'}

Please investigate immediately.`;
    }

    // Utility methods
    notifyOrderCreated(orderData) {
        this.emit('order:created', orderData);
    }

    notifyOrderStatusChanged(orderData) {
        this.emit('order:status_changed', orderData);
    }

    notifyOrderAssigned(orderData) {
        this.emit('order:assigned', orderData);
    }

    notifyOrderCompleted(orderData) {
        this.emit('order:completed', orderData);
    }

    notifyOrderOverdue(orderData) {
        this.emit('order:overdue', orderData);
    }

    notifyPaymentReceived(paymentData) {
        this.emit('payment:received', paymentData);
    }

    notifyPaymentFailed(paymentData) {
        this.emit('payment:failed', paymentData);
    }

    notifySystemError(errorData) {
        this.emit('system:error', errorData);
    }
}

module.exports = new NotificationService();