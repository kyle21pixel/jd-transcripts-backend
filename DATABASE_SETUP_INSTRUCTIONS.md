# Quick Database Setup Instructions

## You have 2 options:

### OPTION 1: Use phpMyAdmin (Easiest - Visual Interface)

1. **Open phpMyAdmin:**
   - I just opened it for you at: http://localhost:8080/phpmyadmin
   - Or click this link: http://localhost:8080/phpmyadmin

2. **Create Database:**
   - Click "New" in the left sidebar
   - Database name: `jd_reporting_company`
   - Click "Create"

3. **Import SQL File:**
   - Click on the `jd_reporting_company` database
   - Click "Import" tab at the top
   - Click "Choose File"
   - Navigate to: `C:\Users\kyle\Desktop\kyle\Kyle\jd 3\php_backend\setup_database.sql`
   - Click "Go" at the bottom
   - Wait for "Import has been successfully finished"

4. **Done! Now try the dashboard:**
   http://localhost:8080/jd%203/php_backend/admin/login.php

---

### OPTION 2: Run SQL Commands Directly (Quick Copy-Paste)

1. **Open phpMyAdmin:** http://localhost:8080/phpmyadmin

2. **Click "SQL" tab at the top**

3. **Copy and paste this SQL code:**

```sql
CREATE DATABASE IF NOT EXISTS jd_reporting_company;
USE jd_reporting_company;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'manager', 'transcriber', 'client') DEFAULT 'client',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    client_email VARCHAR(100) NOT NULL,
    client_phone VARCHAR(20),
    service_type ENUM('legal', 'medical', 'zoom', 'academic') NOT NULL,
    turnaround ENUM('same-day', '24h', '48h', '3-5') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    estimated_cost DECIMAL(10,2),
    special_instructions TEXT,
    status ENUM('pending', 'assigned', 'in_progress', 'completed', 'delivered', 'cancelled') DEFAULT 'pending',
    assigned_to INT,
    assigned_by INT,
    assigned_at TIMESTAMP NULL,
    deadline TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password, first_name, last_name, full_name, role, status) 
VALUES ('admin', 'admin@jdreporting.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'Admin User', 'admin', 'active');

INSERT INTO users (username, email, password, first_name, last_name, full_name, role, status) 
VALUES ('transcriber1', 'trans1@jdreporting.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Transcriber', 'John Transcriber', 'transcriber', 'active');
```

4. **Click "Go" button**

5. **Done! Now open:**
   http://localhost:8080/jd%203/php_backend/admin/login.php

---

## Login Credentials:
- **Admin:** username: `admin` | password: `admin123`
- **Transcriber:** username: `transcriber1` | password: `trans123`

---

## After Setup:
Once you see "success" or "import finished", refresh your dashboard and login!
