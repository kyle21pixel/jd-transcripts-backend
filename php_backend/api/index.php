<?php
/**
 * JD Reporting Company - Main API Router
 * XAMPP/PHP Backend Integration
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Remove 'api' from path if present
if (isset($pathParts[0]) && $pathParts[0] === 'api') {
    array_shift($pathParts);
}

// Get the endpoint
$endpoint = isset($pathParts[0]) ? $pathParts[0] : '';
$action = isset($pathParts[1]) ? $pathParts[1] : '';

// Get request body for POST/PUT requests
$requestBody = null;
if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
    $requestBody = json_decode(file_get_contents('php://input'), true);
}

// Route requests
try {
    switch ($endpoint) {
        case 'health':
            handleHealthCheck();
            break;
            
        case 'contact':
            handleContactRequests($method, $action, $requestBody);
            break;
            
        case 'orders':
            handleOrderRequests($method, $action, $requestBody);
            break;
            
        case 'careers':
            handleCareerRequests($method, $action, $requestBody);
            break;
            
        case 'auth':
            handleAuthRequests($method, $action, $requestBody);
            break;
            
        case 'admin':
            handleAdminRequests($method, $action, $requestBody);
            break;
            
        default:
            jsonResponse([
                'error' => true,
                'message' => 'Invalid API endpoint',
                'available_endpoints' => [
                    'health' => 'GET /api/health',
                    'contact' => 'POST /api/contact',
                    'orders' => 'GET/POST /api/orders/{action}',
                    'careers' => 'POST /api/careers/apply',
                    'auth' => 'POST /api/auth/{action}',
                    'admin' => 'GET/POST /api/admin/{action}'
                ]
            ], 404);
    }
} catch (Exception $e) {
    jsonResponse([
        'error' => true,
        'message' => 'Internal server error: ' . $e->getMessage()
    ], 500);
}

// Health check endpoint
function handleHealthCheck() {
    global $db;
    
    $dbStatus = $db->testConnection();
    $mysqlVersion = $db->fetch("SELECT VERSION() as version");
    
    jsonResponse([
        'status' => 'OK',
        'service' => 'JD Reporting Company API',
        'version' => '1.0.0',
        'timestamp' => date('c'),
        'database' => [
            'connected' => $dbStatus,
            'mysql_version' => $mysqlVersion['version'] ?? 'Unknown'
        ],
        'php_version' => PHP_VERSION,
        'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
    ]);
}

// Contact form requests
function handleContactRequests($method, $action, $data) {
    global $db;
    
    if ($method !== 'POST') {
        jsonResponse(['error' => true, 'message' => 'Only POST method allowed'], 405);
    }
    
    // Validate required fields
    $errors = validateInput($data, ['email', 'message']);
    
    if (!empty($errors)) {
        jsonResponse(['error' => true, 'message' => implode(', ', $errors)], 400);
    }
    
    // Validate email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['error' => true, 'message' => 'Invalid email format'], 400);
    }
    
    // Insert contact message
    $contactData = [
        'name' => sanitizeInput($data['name'] ?? ''),
        'email' => sanitizeInput($data['email']),
        'phone' => sanitizeInput($data['phone'] ?? ''),
        'subject' => sanitizeInput($data['subject'] ?? 'General Inquiry'),
        'message' => sanitizeInput($data['message']),
        'status' => 'new'
    ];
    
    $insertId = $db->insert('contact_messages', $contactData);
    
    if ($insertId) {
        jsonResponse([
            'success' => true,
            'message' => 'Thank you for your message! We will get back to you within 24 hours.',
            'contact_id' => $insertId
        ]);
    } else {
        jsonResponse(['error' => true, 'message' => 'Failed to save your message'], 500);
    }
}

// Order tracking and management
function handleOrderRequests($method, $action, $data) {
    global $db;
    
    switch ($action) {
        case 'track':
            if ($method !== 'POST') {
                jsonResponse(['error' => true, 'message' => 'POST method required'], 405);
            }
            
            $errors = validateInput($data, ['orderId', 'email']);
            if (!empty($errors)) {
                jsonResponse(['error' => true, 'message' => implode(', ', $errors)], 400);
            }
            
            // Find order by ID and customer email
            $order = $db->fetch(
                "SELECT o.*, c.email as customer_email, c.first_name, c.last_name, u.full_name as assigned_name
                 FROM orders o 
                 JOIN customers c ON o.customer_id = c.id 
                 LEFT JOIN users u ON o.assigned_to = u.id
                 WHERE o.order_id = ? AND c.email = ?",
                [$data['orderId'], $data['email']]
            );
            
            if (!$order) {
                jsonResponse(['error' => true, 'message' => 'Order not found or email does not match'], 404);
            }
            
            // Get order timeline
            $timeline = $db->fetchAll(
                "SELECT ot.*, u.full_name as updated_by_name 
                 FROM order_timeline ot 
                 LEFT JOIN users u ON ot.updated_by = u.id 
                 WHERE ot.order_id = ? 
                 ORDER BY ot.created_at ASC",
                [$order['id']]
            );
            
            jsonResponse([
                'success' => true,
                'data' => [
                    'orderId' => $order['order_id'],
                    'status' => $order['status'],
                    'serviceType' => ucfirst($order['service_type']),
                    'totalAmount' => floatval($order['total_amount']),
                    'paymentStatus' => $order['payment_status'],
                    'estimatedCompletion' => $order['estimated_completion'],
                    'actualCompletion' => $order['actual_completion'],
                    'assignedTo' => $order['assigned_name'],
                    'timeline' => $timeline
                ]
            ]);
            break;
            
        case 'create':
            if ($method !== 'POST') {
                jsonResponse(['error' => true, 'message' => 'POST method required'], 405);
            }
            
            // This would handle new order creation
            jsonResponse(['error' => true, 'message' => 'Order creation not yet implemented'], 501);
            break;
            
        default:
            jsonResponse(['error' => true, 'message' => 'Invalid order action'], 400);
    }
}

// Career applications
function handleCareerRequests($method, $action, $data) {
    global $db;
    
    if ($action !== 'apply' || $method !== 'POST') {
        jsonResponse(['error' => true, 'message' => 'Only POST /careers/apply allowed'], 405);
    }
    
    $errors = validateInput($data, ['firstName', 'lastName', 'email', 'position']);
    
    if (!empty($errors)) {
        jsonResponse(['error' => true, 'message' => implode(', ', $errors)], 400);
    }
    
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['error' => true, 'message' => 'Invalid email format'], 400);
    }
    
    $applicationData = [
        'first_name' => sanitizeInput($data['firstName']),
        'last_name' => sanitizeInput($data['lastName']),
        'email' => sanitizeInput($data['email']),
        'phone' => sanitizeInput($data['phone'] ?? ''),
        'position' => sanitizeInput($data['position']),
        'experience_years' => intval($data['experience'] ?? 0),
        'resume_text' => sanitizeInput($data['resumeText'] ?? ''),
        'cover_letter' => sanitizeInput($data['coverLetter'] ?? ''),
        'availability' => sanitizeInput($data['availability'] ?? ''),
        'salary_expectation' => floatval($data['salaryExpectation'] ?? 0),
        'status' => 'pending'
    ];
    
    $insertId = $db->insert('job_applications', $applicationData);
    
    if ($insertId) {
        jsonResponse([
            'success' => true,
            'message' => 'Thank you for your application! We will review it and get back to you soon.',
            'application_id' => $insertId
        ]);
    } else {
        jsonResponse(['error' => true, 'message' => 'Failed to save your application'], 500);
    }
}

// Authentication
function handleAuthRequests($method, $action, $data) {
    global $db;
    
    switch ($action) {
        case 'login':
            if ($method !== 'POST') {
                jsonResponse(['error' => true, 'message' => 'POST method required'], 405);
            }
            
            $errors = validateInput($data, ['username', 'password']);
            if (!empty($errors)) {
                jsonResponse(['error' => true, 'message' => implode(', ', $errors)], 400);
            }
            
            $user = $db->fetch(
                "SELECT * FROM users WHERE (username = ? OR email = ?) AND status = 'active'",
                [$data['username'], $data['username']]
            );
            
            if ($user && password_verify($data['password'], $user['password_hash'])) {
                // Start session
                session_start();
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['role'] = $user['role'];
                
                jsonResponse([
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'role' => $user['role'],
                        'full_name' => $user['full_name']
                    ]
                ]);
            } else {
                jsonResponse(['error' => true, 'message' => 'Invalid username or password'], 401);
            }
            break;
            
        case 'logout':
            session_start();
            session_destroy();
            jsonResponse(['success' => true, 'message' => 'Logged out successfully']);
            break;
            
        default:
            jsonResponse(['error' => true, 'message' => 'Invalid auth action'], 400);
    }
}

// Admin requests (requires authentication)
function handleAdminRequests($method, $action, $data) {
    session_start();
    
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
        jsonResponse(['error' => true, 'message' => 'Admin access required'], 403);
    }
    
    global $db;
    
    switch ($action) {
        case 'dashboard':
            $stats = [
                'total_orders' => $db->fetch("SELECT COUNT(*) as count FROM orders")['count'],
                'pending_orders' => $db->fetch("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'")['count'],
                'active_orders' => $db->fetch("SELECT COUNT(*) as count FROM orders WHERE status IN ('assigned', 'in_progress')")['count'],
                'completed_orders' => $db->fetch("SELECT COUNT(*) as count FROM orders WHERE status = 'completed'")['count'],
                'new_messages' => $db->fetch("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new'")['count'],
                'pending_applications' => $db->fetch("SELECT COUNT(*) as count FROM job_applications WHERE status = 'pending'")['count']
            ];
            
            jsonResponse(['success' => true, 'stats' => $stats]);
            break;
            
        default:
            jsonResponse(['error' => true, 'message' => 'Invalid admin action'], 400);
    }
}
?>