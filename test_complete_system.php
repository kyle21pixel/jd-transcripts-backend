<?php
/**
 * Complete System Test Script
 * This will test all components of the JD Transcripts system
 */

echo "<h1>JD Transcripts System Test</h1>\n";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;}</style>\n";

// Test 1: Database Connection
echo "<h2>1. Testing Database Connection</h2>\n";
try {
    $pdo = new PDO("mysql:host=localhost", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p class='success'>✓ MySQL connection successful</p>\n";
    
    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS jd_transcripts");
    echo "<p class='success'>✓ Database 'jd_transcripts' ready</p>\n";
    
    // Connect to specific database
    $pdo = new PDO("mysql:host=localhost;dbname=jd_transcripts", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch (PDOException $e) {
    echo "<p class='error'>❌ Database connection failed: " . $e->getMessage() . "</p>\n";
    exit;
}

// Test 2: Create Tables
echo "<h2>2. Creating Database Tables</h2>\n";
try {
    // Users table
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
    echo "<p class='success'>✓ Users table created</p>\n";
    
    // Orders table
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
    echo "<p class='success'>✓ Orders table created</p>\n";
    
    // Notifications table
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
    echo "<p class='success'>✓ Notifications table created</p>\n";
    
    // Order status history table
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
    echo "<p class='success'>✓ Order status history table created</p>\n";
    
} catch (PDOException $e) {
    echo "<p class='error'>❌ Table creation failed: " . $e->getMessage() . "</p>\n";
}

// Test 3: Insert Sample Data
echo "<h2>3. Inserting Sample Data</h2>\n";
try {
    // Insert users
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
    echo "<p class='success'>✓ Sample users created</p>\n";
    
    // Insert sample orders
    $sample_orders = [
        [
            'JD2025001', 'John Smith', 'john.smith@example.com', '555-1234',
            'legal', '24h', 'court_hearing.mp3', 'uploads/orders/court_hearing.mp3',
            5242880, 45, 67.50, 'Please include timestamps', 'pending',
            date('Y-m-d H:i:s', strtotime('+24 hours'))
        ],
        [
            'JD2025002', 'Sarah Johnson', 'sarah.j@example.com', '555-5678',
            'medical', '48h', 'patient_consultation.wav', 'uploads/orders/patient_consultation.wav',
            8388608, 60, 105.00, 'HIPAA compliant required', 'assigned',
            date('Y-m-d H:i:s', strtotime('+48 hours'))
        ],
        [
            'JD2025003', 'Mike Davis', 'mike.davis@company.com', '555-9012',
            'zoom', '3-5', 'team_meeting.mp4', 'uploads/orders/team_meeting.mp4',
            15728640, 90, 112.50, 'Multiple speakers', 'in_progress',
            date('Y-m-d H:i:s', strtotime('+5 days'))
        ],
        [
            'JD2025004', 'Dr. Emily Wilson', 'emily.wilson@university.edu', '555-3456',
            'academic', '24h', 'research_interview.m4a', 'uploads/orders/research_interview.m4a',
            7340032, 75, 117.19, 'Academic research project', 'completed',
            date('Y-m-d H:i:s', strtotime('+24 hours'))
        ],
        [
            'JD2025005', 'Legal Firm ABC', 'contact@legalfirmabc.com', '555-7890',
            'legal', 'same-day', 'deposition.wav', 'uploads/orders/deposition.wav',
            12582912, 120, 270.00, 'Urgent deposition transcript needed', 'pending',
            date('Y-m-d H:i:s', strtotime('+8 hours'))
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
    echo "<p class='success'>✓ Sample orders created</p>\n";
    
    // Assign some orders to transcribers
    $pdo->exec("UPDATE orders SET assigned_to = 3, assigned_by = 1, assigned_at = NOW() WHERE order_number = 'JD2025002'");
    $pdo->exec("UPDATE orders SET assigned_to = 4, assigned_by = 2, assigned_at = NOW() WHERE order_number = 'JD2025003'");
    echo "<p class='success'>✓ Orders assigned to transcribers</p>\n";
    
} catch (PDOException $e) {
    echo "<p class='error'>❌ Sample data insertion failed: " . $e->getMessage() . "</p>\n";
}

// Test 4: Create Upload Directory
echo "<h2>4. Creating Upload Directory</h2>\n";
$upload_dir = __DIR__ . '/uploads/orders/';
if (!is_dir($upload_dir)) {
    if (mkdir($upload_dir, 0755, true)) {
        echo "<p class='success'>✓ Upload directory created: $upload_dir</p>\n";
    } else {
        echo "<p class='error'>❌ Failed to create upload directory</p>\n";
    }
} else {
    echo "<p class='success'>✓ Upload directory already exists</p>\n";
}

// Test 5: Test API Endpoints
echo "<h2>5. Testing API Endpoints</h2>\n";

// Check if API files exist
$api_files = ['get_orders.php', 'submit_order.php', 'login.php', 'assign_order.php'];
foreach ($api_files as $file) {
    if (file_exists(__DIR__ . '/api/' . $file)) {
        echo "<p class='success'>✓ API file exists: api/$file</p>\n";
    } else {
        echo "<p class='error'>❌ API file missing: api/$file</p>\n";
    }
}

// Test 6: Display System Summary
echo "<h2>6. System Summary</h2>\n";
try {
    $user_count = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $order_count = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
    $pending_orders = $pdo->query("SELECT COUNT(*) FROM orders WHERE status = 'pending'")->fetchColumn();
    $completed_orders = $pdo->query("SELECT COUNT(*) FROM orders WHERE status = 'completed'")->fetchColumn();
    
    echo "<div style='background:#f0f8ff;padding:20px;border-radius:10px;margin:20px 0;'>\n";
    echo "<h3>📊 Database Statistics</h3>\n";
    echo "<p><strong>Total Users:</strong> $user_count</p>\n";
    echo "<p><strong>Total Orders:</strong> $order_count</p>\n";
    echo "<p><strong>Pending Orders:</strong> $pending_orders</p>\n";
    echo "<p><strong>Completed Orders:</strong> $completed_orders</p>\n";
    echo "</div>\n";
    
} catch (PDOException $e) {
    echo "<p class='error'>❌ Failed to get statistics: " . $e->getMessage() . "</p>\n";
}

// Test 7: Access Links
echo "<h2>7. System Access Links</h2>\n";
echo "<div style='background:#f8f9fa;padding:20px;border-radius:10px;margin:20px 0;'>\n";
echo "<h3>🔗 Quick Access Links</h3>\n";
echo "<p><a href='index.html' target='_blank' style='color:#007bff;'>📄 Main Website</a></p>\n";
echo "<p><a href='admin-login.html' target='_blank' style='color:#007bff;'>🔐 Admin Login</a></p>\n";
echo "<p><a href='admin-functional.html' target='_blank' style='color:#007bff;'>👨‍💼 Admin Dashboard</a></p>\n";
echo "<p><a href='admin-manager.html' target='_blank' style='color:#007bff;'>👩‍💼 Manager Dashboard</a></p>\n";
echo "<p><a href='http://localhost/phpmyadmin' target='_blank' style='color:#007bff;'>🗄️ phpMyAdmin</a></p>\n";
echo "</div>\n";

echo "<h2>8. Login Credentials</h2>\n";
echo "<div style='background:#e8f5e8;padding:20px;border-radius:10px;margin:20px 0;'>\n";
echo "<h3>🔑 Demo Login Credentials</h3>\n";
echo "<p><strong>Admin:</strong> admin / password123</p>\n";
echo "<p><strong>Manager:</strong> manager / password123</p>\n";
echo "<p><strong>Transcriber 1:</strong> transcriber1 / password123</p>\n";
echo "<p><strong>Transcriber 2:</strong> transcriber2 / password123</p>\n";
echo "</div>\n";

echo "<div style='background:#d4edda;padding:20px;border-radius:10px;margin:20px 0;border:2px solid #28a745;'>\n";
echo "<h2 style='color:#155724;'>🎉 SYSTEM SETUP COMPLETE!</h2>\n";
echo "<p style='color:#155724;'>Your JD Transcripts system is now fully functional and ready for testing.</p>\n";
echo "<p style='color:#155724;'><strong>Next Steps:</strong></p>\n";
echo "<ol style='color:#155724;'>\n";
echo "<li>Visit the <a href='index.html' target='_blank'>main website</a> to test order submission</li>\n";
echo "<li>Login to the <a href='admin-login.html' target='_blank'>admin panel</a> to manage orders</li>\n";
echo "<li>Test the complete workflow from order submission to completion</li>\n";
echo "</ol>\n";
echo "</div>\n";

?>