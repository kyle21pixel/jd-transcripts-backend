const nodemailer = require('nodemailer');

// Email service for sending notifications
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendOrderNotification(orderData) {
    try {
      const {
        name,
        email,
        service,
        duration,
        turnaround,
        totalPrice,
        paymentMethod,
        mpesaPhone,
        fileName,
        fileSize,
        notes,
        timestamp,
        paymentStatus,
        mpesaReceiptNumber,
        mpesaReference,
        transactionDate,
        amountPaid
      } = orderData;

      const serviceNames = {
        legal: 'Legal Transcription',
        medical: 'Medical Transcription',
        zoom: 'Zoom Meeting Transcription',
        academic: 'Academic & Interview'
      };

      const turnaroundNames = {
        'same-day': 'Same Day (+50%)',
        '24h': '24 Hours (+25%)',
        '48h': '48 Hours (+10%)',
        '3-5': '3-5 Days (Standard)'
      };

      let paymentInfo = '';
      if (paymentMethod === 'mpesa') {
        paymentInfo = `📱 M-Pesa (${mpesaPhone})`;
        if (paymentStatus === 'completed' && mpesaReceiptNumber) {
          paymentInfo += `\nReceipt: ${mpesaReceiptNumber}`;
          paymentInfo += `\nTransaction Date: ${transactionDate}`;
          paymentInfo += `\nAmount Paid: KES ${amountPaid}`;
        } else if (paymentStatus === 'pending') {
          paymentInfo += ' - Payment Pending';
        }
      } else {
        paymentInfo = '📧 Invoice Requested';
      }

      const subject = paymentStatus === 'completed' 
        ? `✅ PAYMENT CONFIRMED: ${service} - ${name} - $${totalPrice}`
        : `🔔 NEW ORDER: ${service} - ${name} - $${totalPrice}`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #bfa046; text-align: center; margin-bottom: 30px;">
              ${paymentStatus === 'completed' ? '✅ Payment Confirmed' : '🔔 New Order Received'}
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Customer Name</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Email</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${email}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Service Type</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${serviceNames[service] || service}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Duration</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${duration} minutes</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Turnaround Time</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${turnaroundNames[turnaround] || turnaround}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Total Price</td>
                <td style="padding: 12px; border: 1px solid #dee2e6; font-size: 18px; font-weight: bold; color: #bfa046;">$${totalPrice}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Payment Method</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${paymentInfo}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">File Name</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${fileName}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">File Size</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${fileSize}</td>
              </tr>
              ${notes ? `
              <tr>
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Additional Notes</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${notes}</td>
              </tr>
              ` : ''}
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Order Date</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${timestamp}</td>
              </tr>
              ${mpesaReference ? `
              <tr>
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">M-Pesa Reference</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${mpesaReference}</td>
              </tr>
              ` : ''}
            </table>

            ${paymentStatus === 'completed' ? `
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h3 style="margin: 0 0 10px 0;">✅ Payment Confirmed</h3>
              <p style="margin: 0;">The customer has successfully paid via M-Pesa. You can now start processing this transcription order.</p>
            </div>
            ` : paymentMethod === 'mpesa' ? `
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h3 style="margin: 0 0 10px 0;">⏳ M-Pesa Payment Pending</h3>
              <p style="margin: 0;">The customer has initiated M-Pesa payment. Wait for payment confirmation before starting work.</p>
            </div>
            ` : `
            <div style="background-color: #cce5ff; border: 1px solid #99d6ff; color: #004085; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h3 style="margin: 0 0 10px 0;">📧 Invoice Requested</h3>
              <p style="margin: 0;">Please send an invoice to the customer before starting work.</p>
            </div>
            `}

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 14px; margin: 0;">
                JD Legal Transcripts - Professional Transcription Services<br>
                📧 info@jdtranscripts.com | 📞 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: subject,
        html: htmlContent,
        replyTo: email // Allow replying directly to customer
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }
}

const emailService = new EmailService();

module.exports = {
  sendOrderNotification: (orderData) => emailService.sendOrderNotification(orderData)
};