const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // For development, we'll use a test account
    // In production, you would configure with real SMTP settings
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal.pass'
      }
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.log('Email service error:', error);
      } else {
        console.log('Email service ready to send messages');
      }
    });
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@jdreporting.com',
        to: to,
        subject: subject,
        html: html,
        text: text || this.stripHtml(html)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  // Email templates
  getOrderConfirmationTemplate(order) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - JD Reporting</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for choosing JD Reporting</p>
          </div>
          <div class="content">
            <p>Dear ${order.client_name},</p>
            <p>Your order has been successfully submitted and is being processed.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order Number:</strong> ${order.order_number}</p>
              <p><strong>Service Type:</strong> ${order.service_type}</p>
              <p><strong>Turnaround Time:</strong> ${order.turnaround_time}</p>
              <p><strong>Estimated Cost:</strong> $${order.estimated_cost}</p>
              <p><strong>Due Date:</strong> ${new Date(order.due_date).toLocaleDateString()}</p>
              ${order.special_instructions ? `<p><strong>Special Instructions:</strong> ${order.special_instructions}</p>` : ''}
            </div>

            <p>You can track your order status by visiting our website and entering your order number.</p>
            <p style="text-align: center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/track-order" class="btn">Track Your Order</a>
            </p>
          </div>
          <div class="footer">
            <p>JD Reporting Company<br>
            Professional Legal Transcription Services</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getOrderStatusUpdateTemplate(order, status) {
    const statusMessages = {
      'assigned': 'Your order has been assigned to a transcriber and work has begun.',
      'in_progress': 'Your order is currently being transcribed.',
      'completed': 'Your order has been completed and is ready for review.',
      'delivered': 'Your order has been delivered and is available for download.'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Status Update - JD Reporting</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .status-badge { display: inline-block; padding: 5px 15px; background: #28a745; color: white; border-radius: 20px; text-transform: uppercase; font-weight: bold; }
          .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Status Update</h1>
            <p>Your order status has been updated</p>
          </div>
          <div class="content">
            <p>Dear ${order.client_name},</p>
            <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order Number:</strong> ${order.order_number}</p>
              <p><strong>Current Status:</strong> <span class="status-badge">${status.replace('_', ' ')}</span></p>
              <p><strong>Service Type:</strong> ${order.service_type}</p>
              <p><strong>Due Date:</strong> ${new Date(order.due_date).toLocaleDateString()}</p>
            </div>

            <p>You can track your order status and view updates by visiting our website.</p>
            <p style="text-align: center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/track-order" class="btn">Track Your Order</a>
            </p>
          </div>
          <div class="footer">
            <p>JD Reporting Company<br>
            Professional Legal Transcription Services</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetTemplate(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset - JD Reporting</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .btn { display: inline-block; padding: 10px 20px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
            <p>Reset your JD Reporting account password</p>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>We received a request to reset your password for your JD Reporting account.</p>
            
            <p style="text-align: center;">
              <a href="${resetUrl}" class="btn">Reset Password</a>
            </p>

            <div class="warning">
              <p><strong>Important:</strong></p>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>For security, never share this link with anyone</li>
              </ul>
            </div>

            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 3px;">${resetUrl}</p>
          </div>
          <div class="footer">
            <p>JD Reporting Company<br>
            Professional Legal Transcription Services</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getWelcomeEmailTemplate(user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to JD Reporting</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .btn { display: inline-block; padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to JD Reporting!</h1>
            <p>Your account has been successfully created</p>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Welcome to JD Reporting! We're excited to have you as part of our community.</p>
            
            <p>Your account details:</p>
            <ul>
              <li><strong>Email:</strong> ${user.email}</li>
              <li><strong>Role:</strong> ${user.role}</li>
              <li><strong>Account Status:</strong> ${user.status}</li>
            </ul>

            <p>You can now:</p>
            <ul>
              <li>Submit new transcription orders</li>
              <li>Track your existing orders</li>
              <li>Manage your account settings</li>
              <li>Access our professional transcription services</li>
            </ul>

            <p style="text-align: center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login" class="btn">Login to Your Account</a>
            </p>
          </div>
          <div class="footer">
            <p>JD Reporting Company<br>
            Professional Legal Transcription Services</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();




