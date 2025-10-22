<?php
/**
 * Database Connection Test Script
 * This script tests the connection to the MySQL database
 */

// Include the database configuration
require_once 'config.php';

// Create a new database instance
$database = new Database();

// Test the connection
if ($database->testConnection()) {
    echo "✅ Database connection successful!<br>";
    echo "Connected to: " . DB_HOST . ":" . DB_PORT . "<br>";
    echo "Database: " . DB_NAME . "<br>";
    echo "User: " . DB_USER . "<br>";
    
    // Try to get the MySQL version
    try {
        $conn = $database->getConnection();
        $stmt = $conn->query("SELECT VERSION() as version");
        $row = $stmt->fetch();
        echo "MySQL Version: " . $row['version'] . "<br>";
        
        // Check if the database has tables
        $stmt = $conn->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (count($tables) > 0) {
            echo "<br>✅ Found " . count($tables) . " tables in the database:<br>";
            echo "<ul>";
            foreach ($tables as $table) {
                echo "<li>" . $table . "</li>";
            }
            echo "</ul>";
        } else {
            echo "<br>⚠️ No tables found in the database. You may need to run the setup.sql script.<br>";
            echo "You can run the setup script using the following command in MySQL:<br>";
            echo "<code>mysql -u " . DB_USER . " -p < setup.sql</code>";
        }
    } catch (PDOException $e) {
        echo "❌ Error querying database: " . $e->getMessage();
    }
} else {
    echo "❌ Database connection failed!<br>";
    echo "Please check your database configuration in config.php<br>";
    echo "Make sure MySQL server is running and the database '" . DB_NAME . "' exists.";
}

// Function to create the database if it doesn't exist
function createDatabase() {
    try {
        $host = DB_HOST;
        $port = DB_PORT;
        $user = DB_USER;
        $pass = DB_PASS;
        
        $pdo = new PDO("mysql:host=$host;port=$port", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $dbname = DB_NAME;
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname`;");
        
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
        $conn = (new Database())->getConnection();
        
        // Split SQL by semicolons
        $queries = explode(';', $sql);
        
        foreach ($queries as $query) {
            $query = trim($query);
            if (!empty($query)) {
                $conn->exec($query);
            }
        }
        
        echo "✅ Setup script executed successfully.<br>";
        return true;
    } catch (PDOException $e) {
        echo "❌ Error executing setup script: " . $e->getMessage() . "<br>";
        return false;
    }
}

// Provide option to create database and run setup script
if (!$database->testConnection()) {
    echo "<br><br>";
    echo "<form method='post'>";
    echo "<button type='submit' name='create_db' style='padding: 10px; background: #4CAF50; color: white; border: none; cursor: pointer; margin-right: 10px;'>Create Database</button>";
    echo "</form>";
} else {
    $conn = $database->getConnection();
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (count($tables) == 0) {
        echo "<br><br>";
        echo "<form method='post'>";
        echo "<button type='submit' name='run_setup' style='padding: 10px; background: #2196F3; color: white; border: none; cursor: pointer;'>Run Setup Script</button>";
        echo "</form>";
    }
}

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['create_db'])) {
        createDatabase();
        // Refresh the page
        echo "<script>window.location.reload();</script>";
    }
    
    if (isset($_POST['run_setup'])) {
        runSetupScript();
        // Refresh the page
        echo "<script>window.location.reload();</script>";
    }
}
?>