<?php<?php<?php

// JD Reporting Company - Orders API

// Handles order creation/**/**



error_reporting(E_ALL); * JD Reporting Company - Orders API (Standalone) * JD Reporting Company - Orders API

ini_set('display_errors', 0);

ini_set('log_errors', 1); * Handles order creation * Handles all order-related operations



header('Content-Type: application/json'); */ */

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Enable error reporting for debuggingrequire_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    http_response_code(200);error_reporting(E_ALL);

    exit();

}ini_set('display_errors', 0); // Don't display errors in output (they break JSON)header('Content-Type: application/json');



function getDatabase() {ini_set('log_errors', 1);header('Access-Control-Allow-Origin: *');

    $host = '127.0.0.1';

    $database = 'jd_reporting_company';ini_set('error_log', 'C:\xampp\php\logs\php_error_log');header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

    $username = 'root';

    $password = '';header('Access-Control-Allow-Headers: Content-Type, Authorization');

    $port = 3307;

    // Set headers

    try {

        $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";header('Content-Type: application/json');if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

        $pdo = new PDO($dsn, $username, $password, [

            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,header('Access-Control-Allow-Origin: *');    http_response_code(200);

            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC

        ]);header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');    exit();

        return $pdo;

    } catch (PDOException $e) {header('Access-Control-Allow-Headers: Content-Type, Authorization');}

        http_response_code(500);

        echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);

        exit();

    }// Handle preflight$db = new Database();

}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {$method = $_SERVER['REQUEST_METHOD'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    try {    http_response_code(200);$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        $json = file_get_contents('php://input');

        $data = json_decode($json, true);    exit();$pathParts = explode('/', trim($path, '/'));

        

        if (!$data) {}

            http_response_code(400);

            echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);// Get request body

            exit();

        }// Database connection$input = json_decode(file_get_contents('php://input'), true);

        

        $required = ['clientName', 'clientEmail', 'serviceType', 'turnaround'];function getDatabase() {

        foreach ($required as $field) {

            if (!isset($data[$field]) || empty($data[$field])) {    $host = '127.0.0.1';// Route to appropriate function

                http_response_code(400);

                echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);    $database = 'jd_reporting_company';switch ($method) {

                exit();

            }    $username = 'root';    case 'GET':

        }

            $password = '';        if (isset($_GET['id'])) {

        $pdo = getDatabase();

            $port = 3307;            getOrder($db, $_GET['id']);

        $orderNumber = 'JD-' . date('Ymd') . '-' . strtoupper(substr(md5(uniqid()), 0, 6));

                    } elseif (isset($_GET['track'])) {

        $basePrices = [

            'legal' => 150,    try {            trackOrder($db, $_GET['track'], $_GET['email'] ?? '');

            'medical' => 180,

            'zoom' => 120,        $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";        } else {

            'academic' => 100

        ];        $pdo = new PDO($dsn, $username, $password, [            getAllOrders($db);

        

        $turnaroundMultipliers = [            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,        }

            'same-day' => 2.5,

            '24h' => 2.0,            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC        break;

            '48h' => 1.5,

            '3-5' => 1.0        ]);        

        ];

                return $pdo;    case 'POST':

        $basePrice = $basePrices[$data['serviceType']] ?? 100;

        $multiplier = $turnaroundMultipliers[$data['turnaround']] ?? 1.0;    } catch (PDOException $e) {        createOrder($db, $input);

        $estimatedCost = $basePrice * $multiplier;

                http_response_code(500);        break;

        $deadline = new DateTime();

        switch ($data['turnaround']) {        echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);        

            case 'same-day':

                $deadline->modify('+8 hours');        exit();    case 'PUT':

                break;

            case '24h':    }        updateOrder($db, $input);

                $deadline->modify('+1 day');

                break;}        break;

            case '48h':

                $deadline->modify('+2 days');        

                break;

            case '3-5':// Handle POST request - Create order    case 'DELETE':

                $deadline->modify('+4 days');

                break;if ($_SERVER['REQUEST_METHOD'] === 'POST') {        deleteOrder($db, $_GET['id'] ?? null);

        }

            try {        break;

        $sql = "INSERT INTO orders (

            order_number, client_name, client_email, client_phone,        // Get JSON input        

            service_type, turnaround, file_name, file_path,

            duration_minutes, estimated_cost, special_instructions,        $json = file_get_contents('php://input');    default:

            status, deadline, created_at

        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())";        $data = json_decode($json, true);        http_response_code(405);

        

        $stmt = $pdo->prepare($sql);                echo json_encode(['error' => 'Method not allowed']);

        $result = $stmt->execute([

            $orderNumber,        if (!$data) {}

            $data['clientName'],

            $data['clientEmail'],            http_response_code(400);

            $data['clientPhone'] ?? null,

            $data['serviceType'],            echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);/**

            $data['turnaround'],

            $data['fileName'] ?? 'uploaded_file.mp3',            exit(); * Create a new order

            '/uploads/' . uniqid() . '.mp3',

            0,        } */

            $estimatedCost,

            $data['specialInstructions'] ?? null,        function createOrder($db, $data) {

            $deadline->format('Y-m-d H:i:s')

        ]);        // Validate required fields    // Validate required fields

        

        if ($result) {        $required = ['client_name', 'client_email', 'service_type', 'turnaround'];    $required = ['client_name', 'client_email', 'service_type', 'turnaround'];

            $orderId = $pdo->lastInsertId();

                    foreach ($required as $field) {    foreach ($required as $field) {

            echo json_encode([

                'success' => true,            if (!isset($data[$field]) || empty($data[$field])) {        if (!isset($data[$field]) || empty($data[$field])) {

                'message' => 'Order created successfully',

                'orderNumber' => $orderNumber,                http_response_code(400);            http_response_code(400);

                'order' => [

                    'id' => $orderId,                echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);            echo json_encode(['error' => "Missing required field: $field"]);

                    'order_number' => $orderNumber,

                    'estimated_cost' => $estimatedCost,                exit();            return;

                    'deadline' => $deadline->format('Y-m-d H:i:s'),

                    'status' => 'pending'            }        }

                ]

            ]);        }    }

        } else {

            http_response_code(500);            

            echo json_encode(['success' => false, 'error' => 'Failed to create order']);

        }        // Get database connection    // Generate unique order number

        

    } catch (Exception $e) {        $pdo = getDatabase();    $orderNumber = 'JD-' . date('Ymd') . '-' . strtoupper(substr(md5(uniqid()), 0, 6));

        http_response_code(500);

        echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);            

    }

    exit();        // Generate unique order number    // Calculate estimated cost based on service and turnaround

}

        $orderNumber = 'JD-' . date('Ymd') . '-' . strtoupper(substr(md5(uniqid()), 0, 6));    $basePrices = [

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    try {                'legal' => 150,

        $pdo = getDatabase();

        $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100");        // Calculate estimated cost        'medical' => 180,

        $orders = $stmt->fetchAll();

                $basePrices = [        'zoom' => 120,

        echo json_encode([

            'success' => true,            'legal' => 150,        'academic' => 100

            'count' => count($orders),

            'orders' => $orders            'medical' => 180,    ];

        ]);

    } catch (Exception $e) {            'zoom' => 120,    

        http_response_code(500);

        echo json_encode(['success' => false, 'error' => $e->getMessage()]);            'academic' => 100    $turnaroundMultipliers = [

    }

    exit();        ];        'same-day' => 2.5,

}

                '24h' => 2.0,

http_response_code(405);

echo json_encode(['success' => false, 'error' => 'Method not allowed']);        $turnaroundMultipliers = [        '48h' => 1.5,

?>

            'same-day' => 2.5,        '3-5' => 1.0

            '24h' => 2.0,    ];

            '48h' => 1.5,    

            '3-5' => 1.0    $basePrice = $basePrices[$data['service_type']] ?? 100;

        ];    $multiplier = $turnaroundMultipliers[$data['turnaround']] ?? 1.0;

            $estimatedCost = $basePrice * $multiplier;

        $basePrice = $basePrices[$data['service_type']] ?? 100;    

        $multiplier = $turnaroundMultipliers[$data['turnaround']] ?? 1.0;    // Calculate deadline

        $estimatedCost = $basePrice * $multiplier;    $deadline = new DateTime();

            switch ($data['turnaround']) {

        // Calculate deadline        case 'same-day':

        $deadline = new DateTime();            $deadline->modify('+8 hours');

        switch ($data['turnaround']) {            break;

            case 'same-day':        case '24h':

                $deadline->modify('+8 hours');            $deadline->modify('+1 day');

                break;            break;

            case '24h':        case '48h':

                $deadline->modify('+1 day');            $deadline->modify('+2 days');

                break;            break;

            case '48h':        case '3-5':

                $deadline->modify('+2 days');            $deadline->modify('+4 days');

                break;            break;

            case '3-5':    }

                $deadline->modify('+4 days');    

                break;    // Insert order

        }    $sql = "INSERT INTO orders (

                order_number, client_name, client_email, client_phone,

        // Insert order        service_type, turnaround, file_name, file_path,

        $sql = "INSERT INTO orders (        duration_minutes, estimated_cost, special_instructions,

            order_number, client_name, client_email, client_phone,        status, deadline, created_at

            service_type, turnaround, file_name, file_path,    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())";

            duration_minutes, estimated_cost, special_instructions,    

            status, deadline, created_at    $params = [

        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())";        $orderNumber,

                $data['client_name'],

        $stmt = $pdo->prepare($sql);        $data['client_email'],

        $result = $stmt->execute([        $data['client_phone'] ?? null,

            $orderNumber,        $data['service_type'],

            $data['client_name'],        $data['turnaround'],

            $data['client_email'],        $data['file_name'] ?? 'uploaded_file.mp3',

            $data['client_phone'] ?? null,        $data['file_path'] ?? '/uploads/' . uniqid() . '.mp3',

            $data['service_type'],        $data['duration_minutes'] ?? 0,

            $data['turnaround'],        $estimatedCost,

            $data['file_name'] ?? 'uploaded_file.mp3',        $data['special_instructions'] ?? null,

            '/uploads/' . uniqid() . '.mp3',        $deadline->format('Y-m-d H:i:s')

            0,    ];

            $estimatedCost,    

            $data['special_instructions'] ?? null,    $result = $db->query($sql, $params);

            $deadline->format('Y-m-d H:i:s')    

        ]);    if ($result) {

                $orderId = $db->getConnection()->lastInsertId();

        if ($result) {        

            $orderId = $pdo->lastInsertId();        // Create order timeline entry

                    $db->query(

            echo json_encode([            "INSERT INTO order_status_history (order_id, new_status, notes, created_at) 

                'success' => true,             VALUES (?, 'pending', 'Order created', NOW())",

                'message' => 'Order created successfully',            [$orderId]

                'order' => [        );

                    'id' => $orderId,        

                    'order_number' => $orderNumber,        echo json_encode([

                    'estimated_cost' => $estimatedCost,            'success' => true,

                    'deadline' => $deadline->format('Y-m-d H:i:s'),            'message' => 'Order created successfully',

                    'status' => 'pending'            'order' => [

                ]                'id' => $orderId,

            ]);                'order_number' => $orderNumber,

        } else {                'estimated_cost' => $estimatedCost,

            http_response_code(500);                'deadline' => $deadline->format('Y-m-d H:i:s'),

            echo json_encode(['success' => false, 'error' => 'Failed to create order']);                'status' => 'pending'

        }            ]

                ]);

    } catch (Exception $e) {    } else {

        http_response_code(500);        http_response_code(500);

        echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);        echo json_encode(['error' => 'Failed to create order']);

    }    }

    exit();}

}

/**

// Handle GET request - Get all orders * Get all orders with filters

if ($_SERVER['REQUEST_METHOD'] === 'GET') { */

    try {function getAllOrders($db) {

        $pdo = getDatabase();    $where = [];

        $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100");    $params = [];

        $orders = $stmt->fetchAll();    

            // Apply filters

        echo json_encode([    if (isset($_GET['status'])) {

            'success' => true,        $where[] = "status = ?";

            'count' => count($orders),        $params[] = $_GET['status'];

            'orders' => $orders    }

        ]);    

    } catch (Exception $e) {    if (isset($_GET['service_type'])) {

        http_response_code(500);        $where[] = "service_type = ?";

        echo json_encode(['success' => false, 'error' => $e->getMessage()]);        $params[] = $_GET['service_type'];

    }    }

    exit();    

}    if (isset($_GET['assigned_to'])) {

        $where[] = "assigned_to = ?";

// Method not allowed        $params[] = $_GET['assigned_to'];

http_response_code(405);    }

echo json_encode(['success' => false, 'error' => 'Method not allowed']);    

?>    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    
    $sql = "SELECT o.*, 
            u.first_name as transcriber_first_name, 
            u.last_name as transcriber_last_name
            FROM orders o
            LEFT JOIN users u ON o.assigned_to = u.id
            $whereClause
            ORDER BY o.created_at DESC
            LIMIT " . (isset($_GET['limit']) ? intval($_GET['limit']) : 100);
    
    $result = $db->query($sql, $params);
    $orders = $result->fetchAll();
    
    echo json_encode([
        'success' => true,
        'count' => count($orders),
        'orders' => $orders
    ]);
}

/**
 * Get single order by ID
 */
function getOrder($db, $id) {
    $sql = "SELECT o.*, 
            u.first_name as transcriber_first_name, 
            u.last_name as transcriber_last_name,
            u.email as transcriber_email
            FROM orders o
            LEFT JOIN users u ON o.assigned_to = u.id
            WHERE o.id = ?";
    
    $result = $db->query($sql, [$id]);
    $order = $result->fetch();
    
    if ($order) {
        // Get status history
        $historyResult = $db->query(
            "SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC",
            [$id]
        );
        $order['history'] = $historyResult->fetchAll();
        
        echo json_encode([
            'success' => true,
            'order' => $order
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Order not found']);
    }
}

/**
 * Update order (status, assignment, etc.)
 */
function updateOrder($db, $data) {
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Order ID required']);
        return;
    }
    
    $updates = [];
    $params = [];
    $oldStatus = null;
    
    // Get current order data for comparison
    $currentOrder = $db->query("SELECT * FROM orders WHERE id = ?", [$data['id']])->fetch();
    if (!$currentOrder) {
        http_response_code(404);
        echo json_encode(['error' => 'Order not found']);
        return;
    }
    
    // Build update query dynamically
    if (isset($data['status'])) {
        $updates[] = "status = ?";
        $params[] = $data['status'];
        $oldStatus = $currentOrder['status'];
    }
    
    if (isset($data['assigned_to'])) {
        $updates[] = "assigned_to = ?";
        $params[] = $data['assigned_to'];
        
        if (!$currentOrder['assigned_at']) {
            $updates[] = "assigned_at = NOW()";
        }
    }
    
    if (isset($data['special_instructions'])) {
        $updates[] = "special_instructions = ?";
        $params[] = $data['special_instructions'];
    }
    
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update']);
        return;
    }
    
    // Add updated_at
    $updates[] = "updated_at = NOW()";
    $params[] = $data['id'];
    
    $sql = "UPDATE orders SET " . implode(', ', $updates) . " WHERE id = ?";
    $result = $db->query($sql, $params);
    
    if ($result) {
        // Log status change if status was updated
        if (isset($data['status']) && $oldStatus !== $data['status']) {
            $db->query(
                "INSERT INTO order_status_history (order_id, old_status, new_status, notes, created_at) 
                 VALUES (?, ?, ?, ?, NOW())",
                [$data['id'], $oldStatus, $data['status'], $data['notes'] ?? 'Status updated']
            );
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Order updated successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update order']);
    }
}

/**
 * Track order by order number and email
 */
function trackOrder($db, $orderNumber, $email) {
    $sql = "SELECT * FROM orders WHERE order_number = ? AND client_email = ?";
    $result = $db->query($sql, [$orderNumber, $email]);
    $order = $result->fetch();
    
    if ($order) {
        // Get status history
        $historyResult = $db->query(
            "SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC",
            [$order['id']]
        );
        $order['history'] = $historyResult->fetchAll();
        
        echo json_encode([
            'success' => true,
            'order' => $order
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Order not found or email does not match']);
    }
}

/**
 * Delete order (soft delete by changing status)
 */
function deleteOrder($db, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Order ID required']);
        return;
    }
    
    $result = $db->query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [$id]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Order cancelled successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to cancel order']);
    }
}
?>
