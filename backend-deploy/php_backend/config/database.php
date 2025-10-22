<?php
/**
 * JD Reporting Company - Database Configuration
 * XAMPP/MySQL Integration
 */

class Database {
    private $host = '127.0.0.1';
    private $database = 'jd_reporting_company';
    private $username = 'root';
    private $password = ''; // Default XAMPP MySQL password is empty
    private $port = 3307;
    private $connection;

    public function __construct() {
        $this->connect();
    }

    private function connect() {
        try {
            // First try to connect without database to create it if needed
            $dsn_without_db = "mysql:host={$this->host};port={$this->port};charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];

            // Try to create database if it doesn't exist
            try {
                $tempConn = new PDO($dsn_without_db, $this->username, $this->password, $options);
                $tempConn->exec("CREATE DATABASE IF NOT EXISTS {$this->database}");
                $tempConn = null;
            } catch (PDOException $e) {
                // Database might already exist, continue
            }

            // Now connect to the specific database
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->database};charset=utf8mb4";
            $this->connection = new PDO($dsn, $this->username, $this->password, $options);
            
            // Initialize tables if they don't exist
            $this->initializeTables();
            
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage() . "<br><br>Please make sure MySQL is running in XAMPP Control Panel.");
        }
    }
    
    private function initializeTables() {
        try {
            // Check if users table exists
            $result = $this->connection->query("SHOW TABLES LIKE 'users'");
            if ($result->rowCount() == 0) {
                // Tables don't exist, create them
                $this->createTables();
                $this->insertDefaultData();
            }
        } catch (PDOException $e) {
            error_log("Error initializing tables: " . $e->getMessage());
        }
    }
    
    private function createTables() {
        $sql = "
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
            phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
            FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
            FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS order_status_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            old_status VARCHAR(50),
            new_status VARCHAR(50) NOT NULL,
            changed_by INT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
        );

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
            FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS customers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            email VARCHAR(100) UNIQUE,
            phone VARCHAR(20),
            company VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ";
        
        $this->connection->exec($sql);
    }
    
    private function insertDefaultData() {
        // Insert default admin user (password: admin123)
        $sql = "INSERT IGNORE INTO users (username, email, password, first_name, last_name, full_name, role, status) 
                VALUES ('admin', 'admin@jdreporting.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'Admin User', 'admin', 'active')";
        $this->connection->exec($sql);
        
        // Insert default transcriber user (password: trans123)
        $sql = "INSERT IGNORE INTO users (username, email, password, first_name, last_name, full_name, role, status) 
                VALUES ('transcriber1', 'trans1@jdreporting.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Transcriber', 'John Transcriber', 'transcriber', 'active')";
        $this->connection->exec($sql);
        
        // Insert a sample test order
        $sql = "INSERT IGNORE INTO orders (order_number, client_name, client_email, client_phone, service_type, turnaround, file_name, file_path, duration_minutes, estimated_cost, special_instructions, status, deadline, created_at)
                VALUES ('JD-20251020-TEST01', 'Test Customer', 'test@example.com', '555-0123', 'legal', '24h', 'test_audio.mp3', '/uploads/test_audio.mp3', 30, 300.00, 'This is a test order', 'pending', DATE_ADD(NOW(), INTERVAL 1 DAY), NOW())";
        $this->connection->exec($sql);
    }

    public function getConnection() {
        return $this->connection;
    }

    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Database query error: " . $e->getMessage());
            return false;
        }
    }

    public function fetch($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt ? $stmt->fetch() : false;
    }

    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt ? $stmt->fetchAll() : [];
    }

    public function insert($table, $data) {
        $keys = array_keys($data);
        $fields = implode(',', $keys);
        $placeholders = ':' . implode(', :', $keys);
        
        $sql = "INSERT INTO {$table} ({$fields}) VALUES ({$placeholders})";
        
        $stmt = $this->query($sql, $data);
        return $stmt ? $this->connection->lastInsertId() : false;
    }

    public function update($table, $data, $where, $whereParams = []) {
        $setParts = [];
        foreach ($data as $key => $value) {
            $setParts[] = "{$key} = :{$key}";
        }
        $setClause = implode(', ', $setParts);
        
        $sql = "UPDATE {$table} SET {$setClause} WHERE {$where}";
        
        $params = array_merge($data, $whereParams);
        return $this->query($sql, $params) !== false;
    }

    public function delete($table, $where, $params = []) {
        $sql = "DELETE FROM {$table} WHERE {$where}";
        return $this->query($sql, $params) !== false;
    }

    public function testConnection() {
        try {
            $result = $this->fetch("SELECT 1 as test");
            return $result !== false;
        } catch (Exception $e) {
            return false;
        }
    }
}

// Helper functions
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit(0);
    }
    
    echo json_encode($data, JSON_PRETTY_PRINT);
    exit;
}

function validateInput($data, $required = []) {
    $errors = [];
    
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            $errors[] = ucfirst($field) . " is required";
        }
    }
    
    return $errors;
}

function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

// Initialize database connection
$db = new Database();

// Test connection on first load
if (!$db->testConnection()) {
    jsonResponse([
        'error' => true,
        'message' => 'Database connection failed. Please check XAMPP MySQL service.'
    ], 500);
}
?>