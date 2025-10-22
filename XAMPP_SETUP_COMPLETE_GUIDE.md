# 🚀 JD Reporting Company - Complete XAMPP Setup Guide

## 📋 Prerequisites

✅ XAMPP already downloaded  
✅ Website deployed to Netlify: https://tubular-valkyrie-a11968.netlify.app  

## 🎯 What You'll Get

After this setup, you'll have:
- 🌐 **Live Website**: Your Netlify site (already working)
- 🗄️ **Local Database**: MySQL with full data management
- 📊 **Admin Dashboard**: Complete order management system
- 🔄 **Dual Operation**: Works online (Netlify) AND offline (XAMPP)

---

## 🛠️ Step 1: XAMPP Installation & Setup

### 1.1 Install XAMPP
1. Run the XAMPP installer you downloaded
2. Install to default location: `C:\xampp\`
3. Select components: **Apache**, **MySQL**, **PHP**, **phpMyAdmin**

### 1.2 Start Services
1. Open **XAMPP Control Panel** as Administrator
2. Click **Start** for both **Apache** and **MySQL**
3. Verify green "Running" status for both services

### 1.3 Test Installation
- Open browser and go to: `http://localhost/`
- You should see the XAMPP dashboard

---

## 🗄️ Step 2: Database Setup

### 2.1 Create Database
1. Go to: `http://localhost/phpmyadmin/`
2. Click **"New"** on the left sidebar
3. Database name: `jd_reporting_company`
4. Click **"Create"**

### 2.2 Import Database Schema
1. Select your new database `jd_reporting_company`
2. Click **"Import"** tab
3. Click **"Choose File"**
4. Select: `database/jd_reporting_schema.sql`
5. Click **"Go"**

**Expected Result**: You should see:
- 8 tables created (users, orders, customers, etc.)
- Sample data inserted
- Success messages

---

## 📁 Step 3: PHP Backend Setup

### 3.1 Copy Files to XAMPP
1. Copy the entire `php_backend` folder
2. Paste it to: `C:\xampp\htdocs\jd-reporting\`

Your folder structure should be:
```
C:\xampp\htdocs\jd-reporting\
├── php_backend\
│   ├── config\
│   │   └── database.php
│   ├── api\
│   │   └── index.php
│   └── admin\
│       ├── index.php
│       ├── login.php
│       └── logout.php
```

### 3.2 Test PHP Backend
1. Go to: `http://localhost/jd-reporting/php_backend/api/health`
2. You should see:
```json
{
  "status": "OK",
  "service": "JD Reporting Company API",
  "database": {
    "connected": true,
    "mysql_version": "8.0.x"
  }
}
```

---

## 👨‍💼 Step 4: Admin Dashboard Access

### 4.1 Login to Admin Panel
1. Go to: `http://localhost/jd-reporting/php_backend/admin/login.php`
2. **Username**: `admin`
3. **Password**: `admin123`
4. Click **"Sign In"**

### 4.2 Dashboard Features
After login, you'll see:
- 📊 **Statistics Dashboard**: Order counts, message stats
- 📋 **Recent Orders**: View all transcription orders
- 💬 **Contact Messages**: Customer inquiries
- 👥 **Job Applications**: Career applications
- ⚙️ **User Management**: Admin and transcriber accounts

---

## 🌐 Step 5: Connect Frontend to Database

### 5.1 Update Frontend (Already Done)
The frontend now automatically detects:
- **Local Mode**: Uses XAMPP/MySQL when running on localhost
- **Live Mode**: Uses Netlify Functions when deployed online

### 5.2 Test Database Connection
1. Go to: `http://localhost/jd-reporting/public/test.html`
2. The page will show: ✓ Database Connected (green)
3. Test all forms - they now save to MySQL!

---

## 🧪 Step 6: Complete System Testing

### Test Checklist:

#### 6.1 Contact Form (MySQL Integration)
1. Go to: `http://localhost/jd-reporting/public/contact.html`
2. Fill out and submit the contact form
3. Go to admin dashboard: `http://localhost/jd-reporting/php_backend/admin/`
4. ✅ **Verify**: Message appears in "New Contact Messages"

#### 6.2 Order Tracking (Database Powered)
1. Go to: `http://localhost/jd-reporting/public/track-order.html`
2. Use Order ID: `JD001` and Email: `john.smith@lawfirm.com`
3. ✅ **Verify**: Real order data from database displays

#### 6.3 Career Applications (Database Integration)
1. Go to: `http://localhost/jd-reporting/public/careers.html`
2. Submit a job application
3. Check admin dashboard
4. ✅ **Verify**: Application appears in "Pending Applications"

#### 6.4 Admin Dashboard Functions
1. Login to admin panel
2. ✅ **Verify**: All statistics show real database numbers
3. ✅ **Verify**: Can view order details, messages, applications

---

## 🎉 Step 7: You're Done!

### What You Now Have:

#### 🌐 **Live Website** (Netlify)
- **URL**: https://tubular-valkyrie-a11968.netlify.app
- **Features**: Contact forms, order tracking, careers
- **Backend**: Netlify Functions (serverless)

#### 🏠 **Local System** (XAMPP)
- **URL**: http://localhost/jd-reporting/
- **Database**: Full MySQL integration
- **Admin Panel**: Complete management system
- **API**: PHP backend with all functionality

#### 🔄 **Smart Integration**
- Forms automatically use the appropriate backend
- Database connection status indicator
- Seamless switching between local and live modes

---

## 🚨 Troubleshooting

### Problem: "Database connection failed"
**Solution**:
1. Check XAMPP MySQL is running (green status)
2. Verify database `jd_reporting_company` exists in phpMyAdmin
3. Check file permissions in `C:\xampp\htdocs\jd-reporting\`

### Problem: "404 Not Found" on API calls
**Solution**:
1. Ensure files are in correct location: `C:\xampp\htdocs\jd-reporting\php_backend\`
2. Check Apache is running in XAMPP
3. Test: `http://localhost/jd-reporting/php_backend/api/health`

### Problem: Admin login fails
**Solution**:
1. Go to phpMyAdmin
2. Check `users` table has admin user
3. Username: `admin`, Password: `admin123`
4. If needed, run the database schema SQL again

---

## 🔒 Security Notes

### Change Default Credentials!
After testing, update the admin password:
1. Go to phpMyAdmin
2. Open `jd_reporting_company` → `users` table
3. Edit admin user
4. Generate new password hash: [Use PHP password_hash()]

### Production Recommendations:
- Change all default passwords
- Set up proper user permissions
- Enable HTTPS
- Configure firewall rules

---

## 📞 System URLs Reference

| Component | Local URL | Live URL |
|-----------|-----------|----------|
| **Website** | http://localhost/jd-reporting/public/ | https://tubular-valkyrie-a11968.netlify.app |
| **Admin Dashboard** | http://localhost/jd-reporting/php_backend/admin/ | N/A (Local only) |
| **API Health** | http://localhost/jd-reporting/php_backend/api/health | https://tubular-valkyrie-a11968.netlify.app/api/health |
| **Database Admin** | http://localhost/phpmyadmin/ | N/A (Local only) |

---

## ✅ Final Verification

Your system is complete when:
- ✅ Netlify website is live and working
- ✅ XAMPP Apache and MySQL are running
- ✅ Database contains sample data
- ✅ Admin dashboard loads and shows statistics
- ✅ Contact forms save to MySQL database
- ✅ Order tracking returns real database data

**🎉 Congratulations! Your professional legal transcription website with full database integration is now ready for business!**