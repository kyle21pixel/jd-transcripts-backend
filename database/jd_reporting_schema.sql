-- JD Reporting Company Database Schema
-- Execute this in phpMyAdmin or MySQL command line

-- Create database
CREATE DATABASE IF NOT EXISTS jd_reporting_company;
USE jd_reporting_company;

-- Users table (for admin and transcribers)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'transcriber', 'manager') DEFAULT 'transcriber',
    full_name VARCHAR(100),
    phone VARCHAR(20),
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'USA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20) UNIQUE NOT NULL,
    customer_id INT,
    service_type ENUM('legal', 'medical', 'business', 'academic', 'other') DEFAULT 'legal',
    audio_file_name VARCHAR(255),
    audio_file_path VARCHAR(500),
    duration_minutes INT,
    urgent BOOLEAN DEFAULT FALSE,
    special_instructions TEXT,
    status ENUM('pending', 'assigned', 'in_progress', 'quality_check', 'completed', 'delivered', 'cancelled') DEFAULT 'pending',
    assigned_to INT NULL,
    base_price DECIMAL(10,2) DEFAULT 0.00,
    urgent_fee DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    estimated_completion DATETIME,
    actual_completion DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Transcriptions table
CREATE TABLE transcriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    transcriber_id INT NOT NULL,
    content LONGTEXT,
    word_count INT DEFAULT 0,
    accuracy_score DECIMAL(3,2) DEFAULT 0.00,
    time_spent_minutes INT DEFAULT 0,
    status ENUM('draft', 'completed', 'reviewed', 'approved') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (transcriber_id) REFERENCES users(id)
);

-- Order timeline/status updates
CREATE TABLE order_timeline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status ENUM('pending', 'assigned', 'in_progress', 'quality_check', 'completed', 'delivered', 'cancelled'),
    description TEXT,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Contact messages
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
    replied_by INT NULL,
    reply_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (replied_by) REFERENCES users(id)
);

-- Job applications
CREATE TABLE job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(100) NOT NULL,
    experience_years INT DEFAULT 0,
    resume_text TEXT,
    cover_letter TEXT,
    availability VARCHAR(100),
    salary_expectation DECIMAL(10,2),
    status ENUM('pending', 'reviewing', 'interview', 'hired', 'rejected') DEFAULT 'pending',
    reviewed_by INT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- System settings
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123 - change this!)
INSERT INTO users (username, email, password_hash, role, full_name) 
VALUES ('admin', 'admin@jdreporting.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'System Administrator');

-- Insert default settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', 'JD Reporting Company', 'Company name displayed on website'),
('contact_email', 'info@jdreporting.com', 'Main contact email'),
('base_price_per_minute', '2.50', 'Base transcription price per minute'),
('urgent_multiplier', '1.5', 'Multiplier for urgent orders'),
('max_file_size_mb', '100', 'Maximum audio file size in MB'),
('business_hours', '9 AM - 6 PM EST', 'Business hours description'),
('turnaround_time_hours', '24', 'Standard turnaround time in hours');

-- Insert sample data for testing
INSERT INTO customers (first_name, last_name, email, phone, company) VALUES
('John', 'Smith', 'john.smith@lawfirm.com', '555-0101', 'Smith & Associates Law'),
('Jane', 'Doe', 'jane.doe@legal.com', '555-0102', 'Legal Eagles LLC'),
('Michael', 'Johnson', 'mjohnson@court.gov', '555-0103', 'County Court System');

INSERT INTO orders (order_id, customer_id, service_type, audio_file_name, duration_minutes, status, base_price, total_amount, estimated_completion) VALUES
('JD001', 1, 'legal', 'deposition_smith_case.mp3', 60, 'completed', 150.00, 150.00, DATE_ADD(NOW(), INTERVAL 24 HOUR)),
('JD002', 2, 'legal', 'hearing_transcript.wav', 45, 'in_progress', 112.50, 112.50, DATE_ADD(NOW(), INTERVAL 18 HOUR)),
('JD003', 3, 'legal', 'court_session.mp4', 90, 'pending', 225.00, 225.00, DATE_ADD(NOW(), INTERVAL 36 HOUR));

-- Create indexes for better performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_assigned ON orders(assigned_to);
CREATE INDEX idx_timeline_order ON order_timeline(order_id);
CREATE INDEX idx_contact_status ON contact_messages(status);
CREATE INDEX idx_applications_status ON job_applications(status);