<?php
// Test database connection
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = '127.0.0.1';
$database = 'jd_reporting_company';
$username = 'root';
$password = '';
$port = 3307;

try {
    // Try connection
    $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    echo "✅ Database connection successful!\n\n";
    
    // Check if orders table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'orders'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Orders table exists!\n\n";
        
        // Count orders
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM orders");
        $result = $stmt->fetch();
        echo "📊 Total orders: " . $result['count'] . "\n\n";
        
        // Show table structure
        echo "📋 Orders table structure:\n";
        $stmt = $pdo->query("DESCRIBE orders");
        $columns = $stmt->fetchAll();
        foreach ($columns as $col) {
            echo "  - " . $col['Field'] . " (" . $col['Type'] . ")\n";
        }
    } else {
        echo "❌ Orders table does not exist!\n";
        echo "Creating tables...\n";
        
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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_status (status),
                INDEX idx_order_number (order_number),
                INDEX idx_client_email (client_email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");
        
        echo "✅ Orders table created!\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Database connection failed!\n";
    echo "Error: " . $e->getMessage() . "\n";
    echo "\nPlease ensure:\n";
    echo "1. MySQL is running in XAMPP Control Panel\n";
    echo "2. Database 'jd_reporting_company' exists\n";
    echo "3. MySQL is running on port 3307\n";
}
?>
