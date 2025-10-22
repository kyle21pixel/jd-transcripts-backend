-- JD Reporting Company Database Setup
-- This creates all the tables needed for your transcription business

-- Create database
CREATE DATABASE IF NOT EXISTS jd_reporting;
USE jd_reporting;

-- Users table (for authentication and user management)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('admin', 'manager', 'transcriber', 'client') DEFAULT 'client',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
);

-- Orders table (for transcription orders)
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

-- Career applications table
CREATE TABLE IF NOT EXISTS career_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    position VARCHAR(100) NOT NULL,
    experience VARCHAR(20) NOT NULL,
    availability VARCHAR(50) NOT NULL,
    typing_speed INT,
    cover_letter TEXT,
    resume_path VARCHAR(500),
    certifications JSON,
    status ENUM('pending', 'reviewed', 'interview', 'hired', 'rejected') DEFAULT 'pending',
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- Order status history (for tracking changes)
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

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('order', 'assignment', 'completion', 'system') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    related_order_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (related_order_id) REFERENCES orders(id)
);

-- Insert default admin user
INSERT INTO users (username, email, password, first_name, last_name, role, phone) VALUES
('admin', 'admin@jdreporting.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin', '+254712345678'),
('manager', 'manager@jdreporting.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Manager', 'User', 'manager', '+254712345679'),
('transcriber1', 'john@jdreporting.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', 'transcriber', '+254712345680'),
('transcriber2', 'jane@jdreporting.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Smith', 'transcriber', '+254712345681');

-- Note: Password for all demo users is 'password123'

-- Add settings table for site configuration
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_group VARCHAR(50) DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, setting_group, is_public) VALUES
('site_name', 'JD Reporting Company', 'general', TRUE),
('site_description', 'Professional transcription services for legal, medical, and business needs.', 'general', TRUE),
('contact_email', 'info@jdreporting.org', 'contact', TRUE),
('contact_phone', '+254712345678', 'contact', TRUE),
('contact_address', 'Nairobi, Kenya', 'contact', TRUE),
('currency', 'KES', 'payment', TRUE),
('tax_rate', '16', 'payment', FALSE),
('smtp_host', 'smtp.gmail.com', 'email', FALSE),
('smtp_port', '587', 'email', FALSE),
('smtp_username', 'notifications@jdreporting.org', 'email', FALSE),
('smtp_password', 'your-password-here', 'email', FALSE),
('smtp_encryption', 'tls', 'email', FALSE);

-- Add payments table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_reference VARCHAR(100) UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('mpesa', 'bank_transfer', 'card', 'cash') NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);