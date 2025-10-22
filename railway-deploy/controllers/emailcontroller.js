const nodemailer = require('nodemailer');

class EmailController {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'admin@jdreporting.org',
                pass: process.env.EMAIL_PASS || 'your-app-password'
            }
        });
    }

    // Send new order notification to admin
    async sendNewOrderNotification(orderData) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL || 'admin@jdreporting.org',
                subject: `🔔 New Order Received - ${orderData.orderId}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 20px; text-align: center;">
                            <h1 style="margin: 0;">New Order Notification</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9;">JD Legal Transcripts</p>
                        </div>
                        
                        <div style="padding: 30px; background: #f8fafc;">
                            <h2 style="color: #1e293b; margin-top: 0;">Order Details</h2>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Order ID:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.orderId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Client Name:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.clientName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.clientEmail}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.clientPhone || 'Not provided'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Service Type:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.serviceType}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Turnaround:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.turnaround}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Estimated Cost:</td>
                                        <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${orderData.estimatedCost}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Order Date:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${new Date().toLocaleDateString()}</td>
                                    </tr>
                                </table>
                            </div>

                            ${orderData.instructions ? `
                                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                    <h3 style="color: #1e293b; margin-top: 0;">Special Instructions</h3>
                                    <p style="color: #374151; line-height: 1.6;">${orderData.instructions}</p>
                                </div>
                            ` : ''}

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="${process.env.FRONTEND_URL}/admin-login.html" 
                                   style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                    View in Admin Dashboard
                                </a>
                            </div>
                        </div>
                        
                        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px;">
                            <p style="margin: 0;">This is an automated notification from JD Legal Transcripts</p>
                            <p style="margin: 5px 0 0 0; opacity: 0.7;">Please do not reply to this email</p>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log('New order notification sent to admin');
            return { success: true };
        } catch (error) {
            console.error('Error sending new order notification:', error);
            return { success: false, error: error.message };
        }
    }

    // Send order assignment notification to transcriber
    async sendAssignmentNotification(orderData, transcriberData) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: transcriberData.email,
                subject: `📋 New Order Assignment - ${orderData.orderId}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; text-align: center;">
                            <h1 style="margin: 0;">New Order Assignment</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9;">JD Legal Transcripts</p>
                        </div>
                        
                        <div style="padding: 30px; background: #f8fafc;">
                            <h2 style="color: #1e293b; margin-top: 0;">Hello ${transcriberData.name},</h2>
                            <p style="color: #374151; line-height: 1.6;">You have been assigned a new transcription order. Please review the details below:</p>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Order ID:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.orderId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Client:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.clientName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Service Type:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.serviceType}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Priority:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">
                                            <span style="background: ${orderData.priority === 'urgent' ? '#fee2e2' : orderData.priority === 'high' ? '#fef3c7' : '#e0f2fe'}; 
                                                         color: ${orderData.priority === 'urgent' ? '#991b1b' : orderData.priority === 'high' ? '#92400e' : '#0c4a6e'}; 
                                                         padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                                                ${orderData.priority}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Due Date:</td>
                                        <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${orderData.dueDate}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Estimated Duration:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.estimatedDuration || 'TBD'}</td>
                                    </tr>
                                </table>
                            </div>

                            ${orderData.instructions ? `
                                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                                    <h4 style="color: #92400e; margin-top: 0;">Special Instructions</h4>
                                    <p style="color: #92400e; line-height: 1.6; margin-bottom: 0;">${orderData.instructions}</p>
                                </div>
                            ` : ''}

                            <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0284c7;">
                                <h4 style="color: #0c4a6e; margin-top: 0;">Next Steps</h4>
                                <ol style="color: #0c4a6e; line-height: 1.6; margin-bottom: 0;">
                                    <li>Log into your transcriber portal</li>
                                    <li>Download the audio files</li>
                                    <li>Begin transcription work</li>
                                    <li>Upload completed transcript before due date</li>
                                </ol>
                            </div>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="${process.env.FRONTEND_URL}/transcriber-portal.html" 
                                   style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">
                                    Access Portal
                                </a>
                                <a href="mailto:admin@jdreporting.org" 
                                   style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                    Contact Admin
                                </a>
                            </div>
                        </div>
                        
                        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px;">
                            <p style="margin: 0;">Thank you for your continued excellent work!</p>
                            <p style="margin: 5px 0 0 0; opacity: 0.7;">JD Legal Transcripts Team</p>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Assignment notification sent to ${transcriberData.email}`);
            return { success: true };
        } catch (error) {
            console.error('Error sending assignment notification:', error);
            return { success: false, error: error.message };
        }
    }

    // Send order completion notification to client
    async sendCompletionNotification(orderData, clientData) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: clientData.email,
                subject: `✅ Your Transcription is Complete - ${orderData.orderId}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; text-align: center;">
                            <h1 style="margin: 0;">Transcription Complete!</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9;">JD Legal Transcripts</p>
                        </div>
                        
                        <div style="padding: 30px; background: #f8fafc;">
                            <h2 style="color: #1e293b; margin-top: 0;">Dear ${clientData.name},</h2>
                            <p style="color: #374151; line-height: 1.6;">Great news! Your transcription order has been completed and is ready for download.</p>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Order ID:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.orderId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Service Type:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.serviceType}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Completed Date:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${new Date().toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Transcriber:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.transcriberName}</td>
                                    </tr>
                                </table>
                            </div>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.FRONTEND_URL}/download/${orderData.orderId}" 
                                   style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                                    Download Your Transcript
                                </a>
                            </div>

                            <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0284c7;">
                                <h4 style="color: #0c4a6e; margin-top: 0;">What's Included</h4>
                                <ul style="color: #0c4a6e; line-height: 1.6; margin-bottom: 0;">
                                    <li>Complete transcript in Word format</li>
                                    <li>PDF version for easy sharing</li>
                                    <li>Timestamp markers (if requested)</li>
                                    <li>Speaker identification</li>
                                </ul>
                            </div>

                            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                                <h4 style="color: #92400e; margin-top: 0;">Please Review</h4>
                                <p style="color: #92400e; line-height: 1.6; margin-bottom: 0;">
                                    Please review your transcript and let us know if any revisions are needed within 48 hours. 
                                    We're committed to your satisfaction!
                                </p>
                            </div>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="mailto:support@jdreporting.org" 
                                   style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">
                                    Request Revision
                                </a>
                                <a href="${process.env.FRONTEND_URL}/feedback/${orderData.orderId}" 
                                   style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                    Leave Feedback
                                </a>
                            </div>
                        </div>
                        
                        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px;">
                            <p style="margin: 0;">Thank you for choosing JD Legal Transcripts!</p>
                            <p style="margin: 5px 0 0 0; opacity: 0.7;">We appreciate your business</p>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Completion notification sent to ${clientData.email}`);
            return { success: true };
        } catch (error) {
            console.error('Error sending completion notification:', error);
            return { success: false, error: error.message };
        }
    }

    // Send order status update notification with tracking link
    async sendOrderStatusUpdate(orderData) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: orderData.clientEmail || orderData.customerEmail,
                subject: `🔄 Order Status Update - ${orderData.orderId}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 20px; text-align: center;">
                            <h1 style="margin: 0;">Order Status Update</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9;">JD Reporting Company</p>
                        </div>
                        
                        <div style="padding: 30px; background: #f8fafc;">
                            <h2 style="color: #1e293b; margin-top: 0;">Dear Customer,</h2>
                            <p style="color: #374151; line-height: 1.6;">We're writing to inform you that the status of your order has been updated.</p>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Order ID:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.orderId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Service Type:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${orderData.serviceType}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Current Status:</td>
                                        <td style="padding: 8px 0;">
                                            <span style="background: ${
                                                orderData.status === 'Completed' ? '#d1fae5' : 
                                                orderData.status === 'Quality Check' ? '#ddd6fe' : 
                                                orderData.status === 'In Progress' ? '#e0f2fe' : 
                                                orderData.status === 'Processing' ? '#fef3c7' : '#f3f4f6'
                                            }; 
                                            color: ${
                                                orderData.status === 'Completed' ? '#065f46' : 
                                                orderData.status === 'Quality Check' ? '#5b21b6' : 
                                                orderData.status === 'In Progress' ? '#0c4a6e' : 
                                                orderData.status === 'Processing' ? '#92400e' : '#374151'
                                            }; 
                                            padding: 4px 8px; border-radius: 4px; font-size: 14px; font-weight: 600;">
                                                ${orderData.status}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Update Date:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${new Date().toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Estimated Completion:</td>
                                        <td style="padding: 8px 0; color: #1e293b;">${
                                            orderData.dueDate ? new Date(orderData.dueDate).toLocaleDateString() : 'To be determined'
                                        }</td>
                                    </tr>
                                </table>
                            </div>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.FRONTEND_URL || 'https://jd-reporting-company.netlify.app'}/track-order.html" 
                                   style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                                    Track Your Order
                                </a>
                            </div>

                            <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0284c7;">
                                <h4 style="color: #0c4a6e; margin-top: 0;">What's Next?</h4>
                                ${
                                    orderData.status === 'Received' ? `
                                        <p style="color: #0c4a6e; line-height: 1.6; margin-bottom: 0;">
                                            Your order has been received and is being prepared for processing. Our team will begin work on it shortly.
                                        </p>
                                    ` : orderData.status === 'Processing' ? `
                                        <p style="color: #0c4a6e; line-height: 1.6; margin-bottom: 0;">
                                            Your order is now being processed. Our team is preparing the necessary resources to begin transcription.
                                        </p>
                                    ` : orderData.status === 'In Progress' ? `
                                        <p style="color: #0c4a6e; line-height: 1.6; margin-bottom: 0;">
                                            Your transcription is actively being worked on by our specialists. We're making good progress!
                                        </p>
                                    ` : orderData.status === 'Quality Check' ? `
                                        <p style="color: #0c4a6e; line-height: 1.6; margin-bottom: 0;">
                                            Your transcription is complete and is now undergoing our rigorous quality check process to ensure accuracy.
                                        </p>
                                    ` : orderData.status === 'Completed' ? `
                                        <p style="color: #0c4a6e; line-height: 1.6; margin-bottom: 0;">
                                            Your transcription is complete! You can now download your files from your account.
                                        </p>
                                    ` : `
                                        <p style="color: #0c4a6e; line-height: 1.6; margin-bottom: 0;">
                                            We'll keep you updated as your order progresses through our system.
                                        </p>
                                    `
                                }
                            </div>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="mailto:support@jdreporting.org" 
                                   style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                    Questions? Contact Us
                                </a>
                            </div>
                        </div>
                        
                        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px;">
                            <p style="margin: 0;">Thank you for choosing JD Reporting Company!</p>
                            <p style="margin: 5px 0 0 0; opacity: 0.7;">We appreciate your business</p>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Status update notification sent to ${orderData.clientEmail || orderData.customerEmail}`);
            return { success: true };
        } catch (error) {
            console.error('Error sending status update notification:', error);
            return { success: false, error: error.message };
        }
    }

    // Send daily summary to admin
    async sendDailySummary(summaryData) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL || 'admin@jdreporting.org',
                subject: `📊 Daily Summary - ${new Date().toLocaleDateString()}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 20px; text-align: center;">
                            <h1 style="margin: 0;">Daily Summary Report</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9;">${new Date().toLocaleDateString()}</p>
                        </div>
                        
                        <div style="padding: 30px; background: #f8fafc;">
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px;">
                                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #3b82f6;">
                                    <h3 style="margin: 0; color: #3b82f6; font-size: 2rem;">${summaryData.newOrders}</h3>
                                    <p style="margin: 5px 0 0 0; color: #64748b;">New Orders</p>
                                </div>
                                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #10b981;">
                                    <h3 style="margin: 0; color: #10b981; font-size: 2rem;">${summaryData.completedOrders}</h3>
                                    <p style="margin: 5px 0 0 0; color: #64748b;">Completed</p>
                                </div>
                                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #f59e0b;">
                                    <h3 style="margin: 0; color: #f59e0b; font-size: 2rem;">${summaryData.pendingOrders}</h3>
                                    <p style="margin: 5px 0 0 0; color: #64748b;">Pending</p>
                                </div>
                                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #8b5cf6;">
                                    <h3 style="margin: 0; color: #8b5cf6; font-size: 2rem;">$${summaryData.revenue}</h3>
                                    <p style="margin: 5px 0 0 0; color: #64748b;">Revenue</p>
                                </div>
                            </div>

                            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <h3 style="color: #1e293b; margin-top: 0;">Top Performers Today</h3>
                                ${summaryData.topPerformers.map((performer, index) => `
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: ${index < summaryData.topPerformers.length - 1 ? '1px solid #e2e8f0' : 'none'};">
                                        <span style="font-weight: 500;">${performer.name}</span>
                                        <span style="color: #64748b;">${performer.completedToday} orders</span>
                                    </div>
                                `).join('')}
                            </div>

                            <div style="text-align: center;">
                                <a href="${process.env.FRONTEND_URL}/admin-dashboard.html" 
                                   style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                    View Full Dashboard
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Daily summary sent to admin');
            return { success: true };
        } catch (error) {
            console.error('Error sending daily summary:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailController();