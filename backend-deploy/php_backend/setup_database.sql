-- JD Reporting Company - Quick Database Setup
-- Run this in phpMyAdmin or MySQL command line

-- Create the database
CREATE DATABASE IF NOT EXISTS jd_reporting_company;
USE jd_reporting_company;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'manager', 'transcriber', 'client') DEFAULT 'client',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
);

-- Orders table
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
    file_size INT,
    duration_minutes INT,
    estimated_cost DECIMAL(10,2),
    special_instructions TEXT,
    status ENUM('pending', 'assigned', 'in_progress', 'completed', 'delivered', 'cancelled') DEFAULT 'pending',
    assigned_to INT,
    assigned_by INT,
    assigned_at TIMESTAMP NULL,
    deadline TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
);

-- Order status history
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

-- Contact messages
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

-- Job applications
CREATE TABLE IF NOT EXISTS job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(100),
    experience_years INT,
    resume_text TEXT,
    cover_letter TEXT,
    availability VARCHAR(50),
    salary_expectation DECIMAL(10,2),
    status ENUM('pending', 'reviewed', 'interview', 'hired', 'rejected') DEFAULT 'pending',
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    company VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, first_name, last_name, full_name, role, status) 
VALUES ('admin', 'admin@jdreporting.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'Admin User', 'admin', 'active')
ON DUPLICATE KEY UPDATE username=username;

-- Insert default transcriber user (password: trans123)
INSERT INTO users (username, email, password, first_name, last_name, full_name, role, status) 
VALUES ('transcriber1', 'trans1@jdreporting.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Transcriber', 'John Transcriber', 'transcriber', 'active')
ON DUPLICATE KEY UPDATE username=username;

-- Insert sample test order
INSERT INTO orders (order_number, client_name, client_email, client_phone, service_type, turnaround, file_name, file_path, duration_minutes, estimated_cost, special_instructions, status, deadline, created_at)
VALUES ('JD-20251020-TEST01', 'Test Customer', 'test@example.com', '555-0123', 'legal', '24h', 'test_audio.mp3', '/uploads/test_audio.mp3', 30, 300.00, 'This is a test order', 'pending', DATE_ADD(NOW(), INTERVAL 1 DAY), NOW())
ON DUPLICATE KEY UPDATE order_number=order_number;

SELECT 'Database setup completed successfully!' AS status;
