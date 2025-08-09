<?php
/**
 * Database Configuration for JD Legal Transcripts
 * Free MySQL Database Setup
 */

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'jd_transcripts');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Create database connection
class Database {
    private $host = DB_HOST;
    private $db_name = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    private $charset = DB_CHARSET;
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}

// Helper function to get database connection
function getDB() {
    $database = new Database();
    return $database->getConnection();
}

// Helper function to generate order number
function generateOrderNumber() {
    return 'JD' . date('Y') . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
}

// Helper function to calculate estimated cost
function calculateCost($service_type, $duration_minutes, $turnaround) {
    $base_rates = [
        'legal' => 1.50,
        'medical' => 1.75,
        'zoom' => 1.25,
        'academic' => 1.25
    ];
    
    $turnaround_multipliers = [
        'same-day' => 1.50,
        '24h' => 1.25,
        '48h' => 1.10,
        '3-5' => 1.00
    ];
    
    $base_rate = $base_rates[$service_type] ?? 1.25;
    $multiplier = $turnaround_multipliers[$turnaround] ?? 1.00;
    
    return round($duration_minutes * $base_rate * $multiplier, 2);
}

// Helper function to send email notifications
function sendNotification($to_email, $subject, $message) {
    // For demo purposes, we'll log notifications
    // In production, you'd use a real email service
    $log_entry = date('Y-m-d H:i:s') . " - TO: $to_email - SUBJECT: $subject - MESSAGE: $message\n";
    file_put_contents(__DIR__ . '/notifications.log', $log_entry, FILE_APPEND);
    return true;
}

// Security functions
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Session management
function startSecureSession() {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
}

function isLoggedIn() {
    startSecureSession();
    return isset($_SESSION['user_id']) && isset($_SESSION['username']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: admin-login.html');
        exit();
    }
}

function hasRole($required_role) {
    startSecureSession();
    if (!isLoggedIn()) return false;
    
    $user_role = $_SESSION['role'] ?? '';
    
    // Admin can access everything
    if ($user_role === 'admin') return true;
    
    // Check specific role
    return $user_role === $required_role;
}

function requireRole($required_role) {
    if (!hasRole($required_role)) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied']);
        exit();
    }
}
?>