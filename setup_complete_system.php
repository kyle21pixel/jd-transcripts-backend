<?php
/**
 * Complete System Setup Script
 * This will create the database, tables, and insert sample data
 */

// Database configuration
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'jd_transcripts';

try {
    // Connect to MySQL server (without database)
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✓ Connected to MySQL server\n";
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS $database");
    echo "✓ Database '$database' created\n";
    
    // Connect to the specific database
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create users table
    $pdo->exec("
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
        )
    ");
    echo "✓ Users table created\n";
    
    // Create orders table
    $pdo->exec("
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
        )
    ");
    echo "✓ Orders table created\n";
    
    // Create notifications table
    $pdo->exec("
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
        )
    ");
    echo "✓ Notifications table created\n";
    
    // Create order status history table
    $pdo->exec("
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
        )
    ");
    echo "✓ Order status history table created\n";
    
    // Insert default users
    $password_hash = password_hash('password123', PASSWORD_DEFAULT);
    
    $users = [
        ['admin', 'admin@jdlegaltranscripts.com', $password_hash, 'Admin', 'User', 'admin', '555-0001'],
        ['manager', 'manager@jdlegaltranscripts.com', $password_hash, 'Manager', 'User', 'manager', '555-0002'],
        ['transcriber1', 'transcriber1@jdlegaltranscripts.com', $password_hash, 'John', 'Transcriber', 'transcriber', '555-0003'],
        ['transcriber2', 'transcriber2@jdlegaltranscripts.com', $password_hash, 'Jane', 'Transcriber', 'transcriber', '555-0004']
    ];
    
    $stmt = $pdo->prepare("INSERT IGNORE INTO users (username, email, password, first_name, last_name, role, phone) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    foreach ($users as $user) {
        $stmt->execute($user);
    }
    echo "✓ Default users created\n";
    
    // Insert sample orders
    $sample_orders = [
        [
            'JD2025001', 'John Smith', 'john.smith@example.com', '555-1234',
            'legal', '24h', 'court_hearing.mp3', 'uploads/court_hearing.mp3',
            5242880, 45, 67.50, 'Please include timestamps', 'pending',
            date('Y-m-d H:i:s', strtotime('+24 hours'))
        ],
        [
            'JD2025002', 'Sarah Johnson', 'sarah.j@example.com', '555-5678',
            'medical', '48h', 'patient_consultation.wav', 'uploads/patient_consultation.wav',
            8388608, 60, 105.00, 'HIPAA compliant required', 'assigned',
            date('Y-m-d H:i:s', strtotime('+48 hours'))
        ],
        [
            'JD2025003', 'Mike Davis', 'mike.davis@company.com', '555-9012',
            'zoom', '3-5', 'team_meeting.mp4', 'uploads/team_meeting.mp4',
            15728640, 90, 112.50, 'Multiple speakers', 'in_progress',
            date('Y-m-d H:i:s', strtotime('+5 days'))
        ],
        [
            'JD2025004', 'Dr. Emily Wilson', 'emily.wilson@university.edu', '555-3456',
            'academic', '24h', 'research_interview.m4a', 'uploads/research_interview.m4a',
            7340032, 75, 117.19, 'Academic research project', 'completed',
            date('Y-m-d H:i:s', strtotime('+24 hours'))
        ]
    ];
    
    $order_stmt = $pdo->prepare("
        INSERT IGNORE INTO orders (
            order_number, client_name, client_email, client_phone,
            service_type, turnaround, file_name, file_path, file_size,
            duration_minutes, estimated_cost, special_instructions, status, deadline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    foreach ($sample_orders as $order) {
        $order_stmt->execute($order);
    }
    echo "✓ Sample orders created\n";
    
    // Assign some orders to transcribers
    $pdo->exec("UPDATE orders SET assigned_to = 3, assigned_by = 1, assigned_at = NOW() WHERE order_number = 'JD2025002'");
    $pdo->exec("UPDATE orders SET assigned_to = 4, assigned_by = 2, assigned_at = NOW() WHERE order_number = 'JD2025003'");
    echo "✓ Orders assigned to transcribers\n";
    
    // Create uploads directory
    $upload_dir = __DIR__ . '/uploads/orders/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
        echo "✓ Upload directory created\n";
    }
    
    echo "\n🎉 COMPLETE SYSTEM SETUP SUCCESSFUL! 🎉\n";
    echo "\nLogin Credentials:\n";
    echo "==================\n";
    echo "Admin: admin / password123\n";
    echo "Manager: manager / password123\n";
    echo "Transcriber1: transcriber1 / password123\n";
    echo "Transcriber2: transcriber2 / password123\n";
    echo "\nAccess URLs:\n";
    echo "============\n";
    echo "Main Website: http://localhost/jd%203/index.html\n";
    echo "Admin Login: http://localhost/jd%203/admin-login.html\n";
    echo "Admin Dashboard: http://localhost/jd%203/admin-functional.html\n";
    echo "Manager Dashboard: http://localhost/jd%203/admin-manager.html\n";
    echo "phpMyAdmin: http://localhost/phpmyadmin\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>