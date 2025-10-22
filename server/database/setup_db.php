<?php
/**
 * JD Reporting Company - Database Setup Script
 * Run this script to create and populate the MySQL database
 */

// Include database configuration
require_once 'config.php';

try {
    // Create database if it doesn't exist
    $pdo = new PDO("mysql:host=" . DB_HOST . ";port=" . DB_PORT, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ Database '" . DB_NAME . "' created successfully\n";

    // Connect to the database
    $pdo->exec("USE " . DB_NAME);

    // Read and execute the SQL setup file
    $sql = file_get_contents('setup.sql');

    // Split SQL into individual statements
    $statements = explode(';', $sql);

    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            try {
                $pdo->exec($statement);
                echo "✅ Executed: " . substr($statement, 0, 50) . "...\n";
            } catch (Exception $e) {
                echo "⚠️  Skipped (might already exist): " . $e->getMessage() . "\n";
            }
        }
    }

    echo "\n🎉 Database setup completed successfully!\n";
    echo "📊 Default login credentials:\n";
    echo "   Admin: admin@jdreporting.org / password123\n";
    echo "   Manager: manager@jdreporting.org / password123\n";
    echo "   Transcriber: john@jdreporting.org / password123\n";

} catch (PDOException $e) {
    echo "❌ Database setup failed: " . $e->getMessage() . "\n";
    echo "💡 Make sure:\n";
    echo "   1. XAMPP Apache and MySQL services are running\n";
    echo "   2. MySQL root password is empty (default XAMPP setup)\n";
    echo "   3. Check phpMyAdmin at http://localhost/phpmyadmin/\n";
}
?>