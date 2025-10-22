# Quick Setup Guide - Order Management System

## 🚀 Quick Start

### Step 1: Database Setup
```sql
-- Make sure your MySQL/XAMPP is running
-- Import the database schema from database/setup.sql
-- Or run these key tables:

CREATE DATABASE IF NOT EXISTS jd_reporting;
USE jd_reporting;

-- Users table (already exists)
-- Orders table (already exists)
-- Add these if missing:

CREATE TABLE IF NOT EXISTS order_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(100),
    status ENUM('pending', 'reviewed', 'hired', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 2: Create Test Users
```sql
-- Admin user (password: admin123)
INSERT INTO users (username, email, password, first_name, last_name, role, status)
VALUES ('admin', 'admin@jdreporting.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin', 'active');

-- Transcriber user (password: trans123)
INSERT INTO users (username, email, password, first_name, last_name, role, status)
VALUES ('transcriber1', 'trans1@jdreporting.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Transcriber', 'transcriber', 'active');
```

### Step 3: File Access

#### Admin Dashboard:
- URL: `http://localhost/jd-3/php_backend/admin/index.php`
- Login: `admin` / `admin123`

#### Transcriber Dashboard:
- URL: `http://localhost/jd-3/php_backend/transcriber/index.php`
- Login: `transcriber1` / `trans123`

#### Order Form:
- URL: `http://localhost/jd-3/order-form.html`
- (No login required - public facing)

#### Orders API:
- URL: `http://localhost/jd-3/php_backend/api/orders.php`

### Step 4: Test the Flow

1. **Submit an Order:**
   - Open `order-form.html`
   - Fill in customer details
   - Select "Legal" service
   - Choose "24h" turnaround
   - Upload a file (any audio/video)
   - Submit

2. **View in Admin Dashboard:**
   - Login as admin
   - See new order in statistics
   - Go to Orders page
   - Find your order in the list

3. **Assign to Transcriber:**
   - Click "Assign" button
   - Select a transcriber
   - Order status changes to "assigned"

4. **Work on Order (Transcriber):**
   - Login as transcriber
   - See assigned order on dashboard
   - Click "Start" to begin
   - Status changes to "in_progress"
   - Click "Upload" to complete
   - Upload file and mark complete

5. **Track Progress (Admin):**
   - Return to admin dashboard
   - See updated statistics
   - View completed order

## 🎨 Customization

### Change Colors:
Edit the CSS gradient colors in each file:
- Admin: `#3498db, #2980b9` (blue)
- Transcriber: `#667eea, #764ba2` (purple)
- Order Form: `#667eea, #764ba2` (purple)

### Adjust Prices:
In `php_backend/api/orders.php`, modify:
```php
$basePrices = [
    'legal' => 150,      // Change these
    'medical' => 180,
    'zoom' => 120,
    'academic' => 100
];
```

### Change Auto-refresh Time:
In admin dashboard JavaScript:
```javascript
setInterval(refreshOrders, 60000); // 60000 = 1 minute
```

## 🔧 Troubleshooting

### Database Connection Error:
- Check `php_backend/config/database.php`
- Verify MySQL is running in XAMPP
- Confirm database name is correct

### Login Not Working:
- Check session is started in PHP
- Verify user exists in database
- Check password hash matches

### Orders Not Showing:
- Check database connection
- Verify orders table exists
- Check SQL queries for errors

### Notifications Not Working:
- Grant browser notification permission
- Check JavaScript console for errors
- Verify HTTPS or localhost

## 📱 Browser Compatibility

✅ Chrome (recommended)
✅ Firefox
✅ Edge
✅ Safari
⚠️ IE11 (limited support)

## 🎯 Performance Tips

1. Database indexing on frequently queried columns
2. Enable browser caching
3. Minimize auto-refresh frequency
4. Use pagination for large datasets
5. Compress uploaded files

## 🔒 Security Notes

- Passwords are hashed using bcrypt
- SQL injection prevented with prepared statements
- Session-based authentication
- File upload validation needed
- HTTPS recommended for production

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Check PHP error logs
3. Verify database structure
4. Test API endpoints directly

---

**You're all set! Happy transcribing! 🎉**
