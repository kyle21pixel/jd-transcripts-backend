<?php
/**
 * Database Initialization Script
 * This script initializes the MySQL database for JD Reporting Company
 */

// Include the database configuration
require_once 'config.php';

// Function to create the database
function createDatabase() {
    try {
        $host = DB_HOST;
        $port = DB_PORT;
        $user = DB_USER;
        $pass = DB_PASS;
        $dbname = DB_NAME;
        
        // Connect to MySQL server without specifying a database
        $pdo = new PDO("mysql:host=$host;port=$port", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Create the database if it doesn't exist
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        
        echo "✅ Database '$dbname' created or already exists.<br>";
        return true;
    } catch (PDOException $e) {
        echo "❌ Error creating database: " . $e->getMessage() . "<br>";
        return false;
    }
}

// Function to run the setup SQL script
function runSetupScript() {
    $setupFile = __DIR__ . '/setup.sql';
    
    if (!file_exists($setupFile)) {
        echo "❌ Setup file not found: $setupFile<br>";
        return false;
    }
    
    try {
        $sql = file_get_contents($setupFile);
        
        // Connect to the database
        $host = DB_HOST;
        $port = DB_PORT;
        $user = DB_USER;
        $pass = DB_PASS;
        $dbname = DB_NAME;
        
        $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Execute the SQL script
        $pdo->exec($sql);
        
        echo "✅ Setup script executed successfully.<br>";
        return true;
    } catch (PDOException $e) {
        echo "❌ Error executing setup script: " . $e->getMessage() . "<br>";
        return false;
    }
}

// Main execution
echo "<h1>JD Reporting Company - Database Initialization</h1>";
echo "<p>Initializing MySQL database...</p>";

// Step 1: Create the database
echo "<h2>Step 1: Creating Database</h2>";
if (createDatabase()) {
    // Step 2: Run the setup script
    echo "<h2>Step 2: Setting Up Tables</h2>";
    if (runSetupScript()) {
        echo "<h2>Database Initialization Complete</h2>";
        echo "<p>The database has been successfully initialized.</p>";
        echo "<p><a href='manage.php'>Go to Database Management</a></p>";
    } else {
        echo "<h2>Database Initialization Failed</h2>";
        echo "<p>Failed to set up tables. Please check the error messages above.</p>";
    }
} else {
    echo "<h2>Database Initialization Failed</h2>";
    echo "<p>Failed to create database. Please check the error messages above.</p>";
}
?>