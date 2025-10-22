# 🚀 JD Reporting Company - Backend Deployment

## 📦 Backend API Package

This folder contains the complete PHP backend for the JD Reporting Company website.

## 📂 Contents

```
backend-deploy/
├── index.php ...................... API status endpoint
├── .htaccess ...................... Apache configuration
├── .env.example ................... Environment variables template
├── database.sql ................... Full database export with data
├── database-schema.sql ............ Clean database schema
├── php_backend/
│   ├── config.php ................. Configuration file
│   ├── db.php ..................... Database connection helper
│   └── api/
│       ├── orders.php ............. Order management API
│       ├── auth.php ............... Authentication API
│       ├── admin-api.php .......... Admin operations API
│       └── transcriber-api.php .... Transcriber operations API
└── uploads/ ....................... File upload directory (create this)
```

## 🎯 Deployment Options

### Option 1: Railway.app (Recommended - Easy)
### Option 2: Traditional PHP Hosting (Hostinger, SiteGround, etc.)
### Option 3: DigitalOcean/AWS/Heroku

---

## 🚂 Option 1: Deploy to Railway.app

### Why Railway?
- ✅ Easy PHP + MySQL deployment
- ✅ Free $5 credit to start
- ✅ Automatic HTTPS
- ✅ Environment variables support
- ✅ Git integration
- ✅ Simple database management

### Step-by-Step Railway Deployment:

#### 1. Create Railway Account
- Go to https://railway.app/
- Sign up with GitHub (recommended)

#### 2. Create New Project
1. Click "New Project"
2. Select "Deploy MySQL"
3. Wait for MySQL to deploy

#### 3. Get Database Credentials
1. Click on your MySQL service
2. Go to "Variables" tab
3. Copy these values:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

#### 4. Import Database
1. Click "Data" tab in MySQL service
2. Click "Query" button
3. Copy content from `database-schema.sql`
4. Paste and run the query

Or use MySQL client:
```bash
mysql -h [MYSQLHOST] -P [MYSQLPORT] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] < database-schema.sql
```

#### 5. Deploy PHP Backend
1. Click "New" → "Empty Service"
2. Select "Deploy from GitHub repo" (or upload files)
3. Select your repository or upload this folder
4. Railway will detect PHP automatically

#### 6. Configure Environment Variables
In your PHP service, go to "Variables" tab and add:

```
ENVIRONMENT=production
DB_HOST=[your MySQL host from Railway]
DB_PORT=[your MySQL port from Railway]
DB_NAME=[your MySQL database name]
DB_USER=[your MySQL user]
DB_PASS=[your MySQL password]
FRONTEND_URL=https://your-netlify-site.netlify.app
```

#### 7. Get Your Backend URL
- Railway will provide a URL like: `https://your-backend.railway.app`
- Test it: `https://your-backend.railway.app/` (should show API status)

#### 8. Update CORS in API Files
Edit these files in `php_backend/api/`:
- `auth.php`
- `orders.php`
- `admin-api.php`
- `transcriber-api.php`

Change:
```php
header('Access-Control-Allow-Origin: http://127.0.0.1:5508');
```

To:
```php
header('Access-Control-Allow-Origin: ' . getenv('FRONTEND_URL'));
```

---

## 🌐 Option 2: Traditional PHP Hosting

### Recommended Hosts:
- **Hostinger** - $2.99/month
- **SiteGround** - $3.99/month
- **Bluehost** - $2.95/month
- **A2 Hosting** - $2.99/month

### Deployment Steps:

#### 1. Purchase Hosting
- Choose a plan with PHP 7.4+ and MySQL
- Get cPanel access credentials

#### 2. Upload Files via FTP
```
1. Download FileZilla or use cPanel File Manager
2. Connect to your hosting via FTP
3. Upload entire php_backend/ folder to public_html/
4. Upload index.php and .htaccess to public_html/
```

#### 3. Create MySQL Database
```
1. Login to cPanel
2. Go to "MySQL Databases"
3. Create new database: jd_reporting_company
4. Create new user with password
5. Grant all privileges to user
6. Note down: database name, username, password
```

#### 4. Import Database
```
1. Go to phpMyAdmin in cPanel
2. Select your database
3. Click "Import" tab
4. Upload database-schema.sql
5. Click "Go"
```

#### 5. Configure Database Connection
Edit `php_backend/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_database_password');
define('FRONTEND_URL', 'https://your-netlify-site.netlify.app');
```

#### 6. Set File Permissions
```bash
chmod 755 php_backend/
chmod 755 php_backend/api/
chmod 777 uploads/
```

#### 7. Test Your API
- Visit: `https://yourdomain.com/`
- Should see: API status JSON response

---

## ☁️ Option 3: DigitalOcean/AWS

### DigitalOcean Droplet:

#### 1. Create Droplet
- Choose Ubuntu 20.04 LTS
- Select $6/month plan
- Add SSH key

#### 2. Install LAMP Stack
```bash
# Connect via SSH
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Apache, MySQL, PHP
apt install apache2 mysql-server php php-mysql php-curl php-json php-mbstring -y

# Start services
systemctl start apache2
systemctl start mysql
```

#### 3. Configure MySQL
```bash
mysql_secure_installation

# Create database
mysql -u root -p
CREATE DATABASE jd_reporting_company;
CREATE USER 'jduser'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON jd_reporting_company.* TO 'jduser'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import database
mysql -u root -p jd_reporting_company < database-schema.sql
```

#### 4. Deploy Backend
```bash
# Upload files
scp -r backend-deploy/* root@your_droplet_ip:/var/www/html/

# Set permissions
chown -R www-data:www-data /var/www/html/
chmod -R 755 /var/www/html/
chmod -R 777 /var/www/html/uploads/
```

#### 5. Configure Apache
```bash
# Enable mod_rewrite
a2enmod rewrite

# Edit Apache config
nano /etc/apache2/sites-available/000-default.conf

# Add:
<Directory /var/www/html>
    AllowOverride All
</Directory>

# Restart Apache
systemctl restart apache2
```

---

## 🧪 Testing Your Deployment

### Test API Endpoints:

#### 1. Root API Status
```bash
curl https://your-backend-url.com/
```
Should return: `{"success":true,"message":"JD Reporting Company API"...}`

#### 2. Test Authentication
```bash
curl -X POST https://your-backend-url.com/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin.1.pass","role":"admin"}'
```

#### 3. Test Orders API
```bash
curl https://your-backend-url.com/api/orders.php?action=test
```

#### 4. Test Admin API
```bash
curl https://your-backend-url.com/api/admin-api.php?action=dashboard
```

---

## 🔄 Update Frontend to Use Backend

After backend is deployed, update these files in your `netlify-deploy` folder:

### 1. Admin Panel
File: `admin-panel/assets/js/admin-common.js`
```javascript
// Change from:
const API_BASE = 'http://localhost:8080/jd%203/php_backend/api';

// To:
const API_BASE = 'https://your-backend-url.com/api';
```

### 2. Transcriber Panel
File: `transcriber-panel/assets/js/transcriber-common.js`
```javascript
const API_BASE = 'https://your-backend-url.com/api';
```

### 3. Login Pages
Files: `login-admin.html`, `transcriber-login.html`
```javascript
const API_BASE = 'https://your-backend-url.com/api/auth.php';
```

### 4. Order Form
File: `order-form.html`
```javascript
const API_URL = 'https://your-backend-url.com/api/orders.php';
```

### 5. Track Order
File: `track-order.html`
```javascript
const API_URL = 'https://your-backend-url.com/api/orders.php';
```

Then redeploy to Netlify!

---

## 🔒 Security Checklist

Before going live:

- [ ] Change default passwords
- [ ] Implement password hashing
- [ ] Set up SSL/HTTPS
- [ ] Configure proper CORS
- [ ] Set secure file permissions
- [ ] Enable error logging
- [ ] Disable error display
- [ ] Use environment variables
- [ ] Set up database backups
- [ ] Add rate limiting
- [ ] Sanitize all inputs
- [ ] Use prepared statements (already done)

---

## 📊 Database Tables

### users
- Stores admin and transcriber accounts
- Default admin: `admin` / `admin.1.pass`

### orders
- Stores all transcription orders
- Links to users via `assigned_to`

### order_status_history
- Tracks status changes
- Audit trail for orders

---

## 🆘 Troubleshooting

### Database Connection Failed
```
Check: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS in config.php
Test: Can you connect via MySQL client?
```

### CORS Errors
```
Update: Access-Control-Allow-Origin in all API files
Check: FRONTEND_URL matches your Netlify URL exactly
```

### 500 Internal Server Error
```
Check: PHP error logs
Verify: File permissions (755 for dirs, 644 for files)
Test: PHP syntax with: php -l filename.php
```

### Orders Not Saving
```
Check: Database connection
Verify: orders table exists
Test: Run query manually in phpMyAdmin
```

---

## 📞 Support

If you encounter issues:
1. Check error logs on your hosting
2. Test API endpoints with curl
3. Verify database credentials
4. Check CORS settings

---

**Package Version:** 1.0.0
**Created:** October 21, 2025
**Status:** Ready for Deployment
