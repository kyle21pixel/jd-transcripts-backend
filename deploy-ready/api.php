<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Include database configuration
require_once './database/config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the request path
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/api.php', '', $path);

// Route the request
switch ($path) {
    case '/api/orders':
        handleOrders();
        break;
    case '/api/auth/login':
        handleLogin();
        break;
    case '/api/admin/dashboard':
        handleDashboard();
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}

// Handle orders endpoint
function handleOrders() {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Return mock orders for testing
        $orders = [
            [
                'id' => 1,
                'order_number' => 'JD20250001',
                'client_name' => 'John Doe',
                'service_type' => 'legal',
                'status' => 'pending',
                'created_at' => '2025-08-10T10:30:00Z',
                'estimated_cost' => 2500
            ],
            [
                'id' => 2,
                'order_number' => 'JD20250002',
                'client_name' => 'Jane Smith',
                'service_type' => 'medical',
                'status' => 'processing',
                'created_at' => '2025-08-11T14:15:00Z',
                'estimated_cost' => 3200
            ],
            [
                'id' => 3,
                'order_number' => 'JD20250003',
                'client_name' => 'Robert Johnson',
                'service_type' => 'zoom',
                'status' => 'completed',
                'created_at' => '2025-08-12T09:45:00Z',
                'estimated_cost' => 1800
            ]
        ];
        
        echo json_encode(['orders' => $orders]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid request data']);
            return;
        }
        
        // Generate a mock order number and estimated cost
        $order_number = generateOrderNumber();
        $estimated_cost = calculateCost(
            $data['service_type'] ?? 'legal',
            $data['duration_minutes'] ?? 60,
            $data['turnaround'] ?? '24h'
        );
        
        // Return success response
        echo json_encode([
            'success' => true,
            'message' => 'Order received successfully',
            'order_number' => $order_number,
            'estimated_cost' => $estimated_cost
        ]);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

// Handle login endpoint
function handleLogin() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid request data']);
            return;
        }
        
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        
        // Simple mock authentication
        if ($username === 'admin' && $password === 'password123') {
            echo json_encode([
                'success' => true,
                'token' => 'mock-jwt-token-for-testing',
                'user' => [
                    'id' => 1,
                    'username' => 'admin',
                    'name' => 'Admin User',
                    'role' => 'admin'
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid credentials'
            ]);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

// Handle dashboard endpoint
function handleDashboard() {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Return mock dashboard data
        echo json_encode([
            'stats' => [
                'total_orders' => 25,
                'pending_orders' => 8,
                'processing_orders' => 5,
                'completed_orders' => 12
            ],
            'recent_orders' => [
                [
                    'id' => 1,
                    'order_number' => 'JD20250001',
                    'client_name' => 'John Doe',
                    'service_type' => 'legal',
                    'status' => 'pending',
                    'created_at' => '2025-08-10T10:30:00Z',
                    'estimated_cost' => 2500
                ],
                [
                    'id' => 2,
                    'order_number' => 'JD20250002',
                    'client_name' => 'Jane Smith',
                    'service_type' => 'medical',
                    'status' => 'processing',
                    'created_at' => '2025-08-11T14:15:00Z',
                    'estimated_cost' => 3200
                ],
                [
                    'id' => 3,
                    'order_number' => 'JD20250003',
                    'client_name' => 'Robert Johnson',
                    'service_type' => 'zoom',
                    'status' => 'completed',
                    'created_at' => '2025-08-12T09:45:00Z',
                    'estimated_cost' => 1800
                ]
            ]
        ]);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}
?>