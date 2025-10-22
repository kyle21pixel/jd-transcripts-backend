<?php
/**
 * JD Reporting Company - Backend API
 * Version: 1.0.0
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . (defined('FRONTEND_URL') ? FRONTEND_URL : '*'));
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

echo json_encode([
    'success' => true,
    'message' => 'JD Reporting Company API',
    'version' => '1.0.0',
    'status' => 'online',
    'endpoints' => [
        '/api/orders.php' => 'Order management',
        '/api/auth.php' => 'Authentication',
        '/api/admin-api.php' => 'Admin operations',
        '/api/transcriber-api.php' => 'Transcriber operations'
    ],
    'timestamp' => date('Y-m-d H:i:s')
]);
