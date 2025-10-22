# 🚀 JD Legal Transcripts - Complete Setup Guide

## Prerequisites
- ✅ XAMPP installed and running (Apache + MySQL)
- ✅ Node.js installed (v18+ recommended)
- ✅ phpMyAdmin accessible at http://localhost/phpmyadmin/

## 📋 Step-by-Step Setup

### Step 1: Install Node.js Dependencies
```bash
cd server
npm install
```

### Step 2: Set Up MySQL Database
Run the PHP setup script:
```bash
cd server/database
php setup_db.php
```

Or manually:
1. Open phpMyAdmin: http://localhost/phpmyadmin/
2. Create database: `jd_reporting`
3. Import `setup.sql` file

### Step 3: Configure Environment
The `.env` file is already configured for XAMPP:
- DB_HOST: localhost
- DB_USER: root
- DB_PASS: (empty)
- DB_NAME: jd_reporting

### Step 4: Start the Backend Server
```bash
cd server
npm start
```
Server will run on: http://localhost:5000

### Step 5: Start the Frontend
```bash
cd client
npm install
npm start
```
Frontend will run on: http://localhost:3000

## 🔍 Testing Your Setup

### Health Check
Visit: http://localhost:5000/api/health

Expected response:
```json
{
  "status": "OK",
  "databases": {
    "mysql": "Connected",
    "mongodb": "Disconnected"
  }
}
```

### Database Test
Visit: http://localhost/phpmyadmin/
- Database: `jd_reporting`
- Tables: users, orders, payments, etc.

## 🔐 Default Login Credentials

**Admin Access:**
- Email: admin@jdreporting.org
- Password: password123

**Manager Access:**
- Email: manager@jdreporting.org
- Password: password123

## 🐛 Troubleshooting

### MySQL Connection Issues
1. Ensure XAMPP MySQL service is running
2. Check phpMyAdmin access
3. Verify database `jd_reporting` exists

### Node.js Issues
1. Ensure Node.js v18+ is installed
2. Run `npm install` in server directory
3. Check `.env` file configuration

### Port Conflicts
- Backend: Port 5000 (configurable in .env)
- Frontend: Port 3000
- Apache: Port 80

## 📞 Need Help?
Check the health endpoint: http://localhost:5000/api/health
This will show connection status for all services.