<?php
/**
 * Database Connection Test & Auto-Setup
 * This file will test the database connection and auto-create tables if needed
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<!DOCTYPE html>
<html>
<head>
    <title>Database Connection Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .status {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 10px 0;
            backdrop-filter: blur(10px);
        }
        .success {
            border-left: 5px solid #10b981;
        }
        .error {
            border-left: 5px solid #ef4444;
        }
        .info {
            border-left: 5px solid #3b82f6;
        }
        h1 { text-align: center; }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: white;
            color: #667eea;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
            font-weight: bold;
        }
        .btn:hover {
            background: #f0f0f0;
        }
        .center { text-align: center; }
    </style>
</head>
<body>
    <h1>🗄️ JD Reporting Database Setup</h1>";

try {
    echo "<div class='status info'><strong>Step 1:</strong> Attempting to connect to MySQL server...</div>";
    
    // Connection parameters
    $host = 'localhost';
    $port = 3306;
    $username = 'root';
    $password = '';
    $database = 'jd_reporting_company';
    
    // Try to connect without specifying database first
    $dsn_without_db = "mysql:host=$host;port=$port;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ];
    
    $conn = new PDO($dsn_without_db, $username, $password, $options);
    echo "<div class='status success'><strong>✓ Step 1 Complete:</strong> Connected to MySQL server successfully!</div>";
    
    // Create database if not exists
    echo "<div class='status info'><strong>Step 2:</strong> Creating database '$database'...</div>";
    $conn->exec("CREATE DATABASE IF NOT EXISTS $database");
    echo "<div class='status success'><strong>✓ Step 2 Complete:</strong> Database '$database' ready!</div>";
    
    // Connect to the database
    echo "<div class='status info'><strong>Step 3:</strong> Connecting to database...</div>";
    $dsn = "mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4";
    $db = new PDO($dsn, $username, $password, $options);
    echo "<div class='status success'><strong>✓ Step 3 Complete:</strong> Connected to database!</div>";
    
    // Create tables
    echo "<div class='status info'><strong>Step 4:</strong> Creating tables...</div>";
    
    require_once __DIR__ . '/database.php';
    $database_obj = new Database();
    
    echo "<div class='status success'><strong>✓ Step 4 Complete:</strong> All tables created successfully!</div>";
    
    // Verify tables exist
    echo "<div class='status info'><strong>Step 5:</strong> Verifying database structure...</div>";
    $tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<div class='status success'><strong>✓ Step 5 Complete:</strong> Found " . count($tables) . " tables:<br>";
    echo "<ul>";
    foreach ($tables as $table) {
        $count = $db->query("SELECT COUNT(*) FROM $table")->fetchColumn();
        echo "<li><strong>$table</strong> - $count records</li>";
    }
    echo "</ul></div>";
    
    echo "<div class='status success' style='border-left: 5px solid #10b981; font-size: 18px;'>
            <strong>🎉 SUCCESS! Database is fully configured and ready!</strong>
          </div>";
    
    echo "<div class='center' style='margin-top: 30px;'>
            <a href='../../order-form.html' class='btn'>📝 Submit Test Order</a>
            <a href='../admin/login.php' class='btn'>👨‍💼 Admin Login</a>
            <a href='../transcriber/login.php' class='btn'>✍️ Transcriber Login</a>
          </div>";
    
    echo "<div class='status info' style='margin-top: 20px;'>
            <strong>Login Credentials:</strong><br>
            Admin: <code>admin</code> / <code>admin123</code><br>
            Transcriber: <code>transcriber1</code> / <code>trans123</code>
          </div>";
    
} catch (PDOException $e) {
    echo "<div class='status error'>
            <strong>❌ ERROR:</strong> " . $e->getMessage() . "<br><br>
            <strong>Troubleshooting:</strong><br>
            1. Make sure XAMPP is running<br>
            2. Start Apache and MySQL in XAMPP Control Panel<br>
            3. Check if MySQL is running on port 3306<br>
            4. Try restarting XAMPP<br><br>
            <a href='javascript:location.reload()' class='btn'>🔄 Retry Connection</a>
          </div>";
}

echo "</body></html>";
?>
