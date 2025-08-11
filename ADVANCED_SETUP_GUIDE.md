# 🚀 Advanced JD Transcripts Setup Guide

## 🎉 What's New in the Advanced Version

✅ **Database Storage** - MongoDB Atlas integration
✅ **Email Notifications** - Automated emails to clients and admin
✅ **File Upload Handling** - Secure file upload system
✅ **Admin Dashboard** - Full order management interface
✅ **Authentication System** - JWT-based admin login
✅ **Order Management** - Complete order lifecycle tracking

## 🔧 Environment Variables Setup

Add these variables to your Railway project:

### Required Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jd-transcripts
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@jdlegaltranscripts.com
```

### Optional Variables:
```
MAX_FILE_SIZE=104857600
ALLOWED_FILE_TYPES=audio,video
```

## 📧 Gmail Setup for Email Notifications

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Security → 2-Step Verification
3. Turn on 2-Step Verification

### Step 2: Generate App Password
1. Go to Google Account → Security
2. 2-Step Verification → App passwords
3. Select app: "Mail"
4. Select device: "Other" → "JD Transcripts"
5. Copy the 16-character password
6. Use this as `EMAIL_PASS` in Railway

## 🗄️ MongoDB Atlas Setup

Follow the detailed guide in `MONGODB_SETUP.md`

## 👨‍💼 Admin Dashboard Access

### URLs:
- **Main Website**: https://jd-reporting-company.netlify.app/
- **Admin Dashboard**: https://jd-reporting-company.netlify.app/admin-dashboard.html

### Default Admin Credentials:
- **Email**: admin@jdlegaltranscripts.com
- **Password**: admin123
- ⚠️ **Change password after first login!**

## 🔄 Deployment Process

### 1. Railway Auto-Deployment
Railway will automatically detect the changes and redeploy your backend.

### 2. Create Admin User
After Railway deployment, run the admin setup:
```bash
node server/setup-admin.js
```

### 3. Test the System
1. Visit your website
2. Submit a test order
3. Check your email for notifications
4. Login to admin dashboard
5. Manage the test order

## 🎯 Features Overview

### For Customers:
- ✅ Submit orders with file uploads
- ✅ Receive email confirmations
- ✅ Get status updates via email
- ✅ Contact form with email notifications

### For Admins:
- ✅ Dashboard with order statistics
- ✅ View all orders with filtering
- ✅ Update order status
- ✅ Assign orders to transcribers
- ✅ Track order timeline
- ✅ Email notifications for new orders

### System Features:
- ✅ Secure JWT authentication
- ✅ File upload validation
- ✅ Automated email notifications
- ✅ Order status tracking
- ✅ Timeline logging
- ✅ Responsive admin interface

## 🔍 Testing Checklist

### Frontend Testing:
- [ ] Order form submission works
- [ ] File upload works
- [ ] Contact form works
- [ ] Email confirmations received

### Admin Dashboard Testing:
- [ ] Admin login works
- [ ] Dashboard stats display
- [ ] Orders list loads
- [ ] Order status updates work
- [ ] Email notifications sent

### API Testing:
- [ ] Health check: `/api/health`
- [ ] Order creation: `POST /api/orders`
- [ ] Admin login: `POST /api/auth/login`
- [ ] Dashboard stats: `GET /api/dashboard/stats`

## 🚨 Troubleshooting

### Common Issues:

**1. MongoDB Connection Failed**
- Check MONGODB_URI is correct
- Ensure IP whitelist includes 0.0.0.0/0
- Verify database user credentials

**2. Email Not Sending**
- Check EMAIL_USER and EMAIL_PASS
- Ensure Gmail app password is used
- Verify 2FA is enabled on Gmail

**3. Admin Login Failed**
- Run setup-admin.js script
- Check JWT_SECRET is set
- Verify admin user exists in database

**4. File Upload Issues**
- Check file size limits
- Verify file type restrictions
- Ensure temp directory permissions

## 🔮 Next Steps (Future Enhancements)

- 💳 Payment integration (Stripe)
- ☁️ Cloud file storage (AWS S3)
- 📱 Mobile app
- 🔔 Real-time notifications
- 📊 Advanced analytics
- 🎨 Custom branding
- 🌍 Multi-language support

## 📞 Support

If you encounter any issues:
1. Check the Railway deployment logs
2. Verify all environment variables are set
3. Test API endpoints individually
4. Check browser console for frontend errors

Your advanced transcription service is now ready for production! 🎉