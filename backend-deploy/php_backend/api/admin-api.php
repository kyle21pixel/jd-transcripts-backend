<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function getDatabase() {
    $host = '127.0.0.1';
    $database = 'jd_reporting_company';
    $username = 'root';
    $password = '';
    $port = 3307;
    
    try {
        $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";
        $pdo = new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
        exit();
    }
}

$pdo = getDatabase();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// GET Dashboard Stats
if ($method === 'GET' && $action === 'dashboard') {
    try {
        $stats = [];
        
        $result = $pdo->query("SELECT COUNT(*) as count FROM orders")->fetch();
        $stats['totalOrders'] = (int)$result['count'];
        
        $result = $pdo->query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'")->fetch();
        $stats['pendingOrders'] = (int)$result['count'];
        
        $result = $pdo->query("SELECT COUNT(*) as count FROM orders WHERE status IN ('assigned', 'in_progress')")->fetch();
        $stats['processingOrders'] = (int)$result['count'];
        $stats['inProgressOrders'] = (int)$result['count'];
        
        $result = $pdo->query("SELECT COALESCE(SUM(estimated_cost), 0) as total FROM orders WHERE status = 'completed'")->fetch();
        $stats['totalRevenue'] = (float)$result['total'];
        
        echo json_encode([
            'success' => true,
            'data' => $stats,
            'stats' => $stats
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit();
}

// GET All Orders
if ($method === 'GET' && $action === 'orders') {
    try {
        $stmt = $pdo->query("
            SELECT o.*, 
                   u.first_name as transcriber_first_name, 
                   u.last_name as transcriber_last_name
            FROM orders o
            LEFT JOIN users u ON o.assigned_to = u.id
            ORDER BY o.created_at DESC
        ");
        $orders = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $orders,
            'orders' => $orders,
            'count' => count($orders)
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit();
}

// GET Daily Report
if ($method === 'GET' && $action === 'daily') {
    try {
        $stats = [];
        
        $result = $pdo->query("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()")->fetch();
        $stats['ordersToday'] = (int)$result['count'];
        
        $result = $pdo->query("SELECT COUNT(*) as count FROM orders WHERE status = 'completed' AND DATE(completed_at) = CURDATE()")->fetch();
        $stats['completedToday'] = (int)$result['count'];
        
        echo json_encode([
            'success' => true,
            'data' => $stats
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit();
}

// GET Transcribers
if ($method === 'GET' && $action === 'transcribers') {
    try {
        $stmt = $pdo->query("
            SELECT u.*,
                   (SELECT COUNT(*) FROM orders WHERE assigned_to = u.id) as assigned_count,
                   (SELECT COUNT(*) FROM orders WHERE assigned_to = u.id AND status = 'completed') as completed_count
            FROM users u
            WHERE u.role = 'transcriber'
            ORDER BY u.first_name
        ");
        $transcribers = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $transcribers,
            'transcribers' => $transcribers
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit();
}

// POST Add Transcriber
if ($method === 'POST' && $action === 'add-transcriber') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['username']) || !isset($data['email']) || !isset($data['password']) || 
            !isset($data['first_name']) || !isset($data['last_name'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            exit();
        }
        
        // Check if username already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$data['username']]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Username already exists']);
            exit();
        }
        
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Email already exists']);
            exit();
        }
        
        // Insert new transcriber
        $full_name = $data['first_name'] . ' ' . $data['last_name'];
        $stmt = $pdo->prepare("
            INSERT INTO users (username, email, password, first_name, last_name, full_name, role, status, phone, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 'transcriber', 'active', ?, NOW(), NOW())
        ");
        
        $stmt->execute([
            $data['username'],
            $data['email'],
            $data['password'], // Store plain text password as per current system
            $data['first_name'],
            $data['last_name'],
            $full_name,
            $data['phone'] ?? ''
        ]);
        
        $new_id = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Transcriber added successfully',
            'transcriber_id' => $new_id
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit();
}

// POST Assign Order
if ($method === 'POST' && $action === 'assign') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $orderId = $input['orderId'] ?? null;
        $transcriberId = $input['transcriberId'] ?? null;
        
        if (!$orderId || !$transcriberId) {
            echo json_encode(['success' => false, 'error' => 'Missing orderId or transcriberId']);
            exit();
        }
        
        $stmt = $pdo->prepare("
            UPDATE orders 
            SET assigned_to = ?, 
                status = 'assigned',
                assigned_at = NOW(),
                updated_at = NOW()
            WHERE id = ?
        ");
        $stmt->execute([$transcriberId, $orderId]);
        
        echo json_encode(['success' => true, 'message' => 'Order assigned successfully']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit();
}

// PUT Update Order Status
if ($method === 'PUT' && $action === 'status') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $orderId = $input['orderId'] ?? null;
        $status = $input['status'] ?? null;
        
        if (!$orderId || !$status) {
            echo json_encode(['success' => false, 'error' => 'Missing orderId or status']);
            exit();
        }
        
        $completedAt = ($status === 'completed') ? ', completed_at = NOW()' : '';
        
        $stmt = $pdo->prepare("
            UPDATE orders 
            SET status = ?,
                updated_at = NOW()
                $completedAt
            WHERE id = ?
        ");
        $stmt->execute([$status, $orderId]);
        
        echo json_encode(['success' => true, 'message' => 'Status updated successfully']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit();
}

// DELETE Order
if ($method === 'DELETE' && $action === 'delete') {
    try {
        $orderId = $_GET['orderId'] ?? null;
        
        if (!$orderId) {
            echo json_encode(['success' => false, 'error' => 'Missing orderId']);
            exit();
        }
        
        $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->execute([$orderId]);
        
        echo json_encode(['success' => true, 'message' => 'Order deleted successfully']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit();
}

// DELETE Transcriber
if ($method === 'DELETE' && $action === 'delete-transcriber') {
    try {
        $transcriberId = $_GET['id'] ?? null;
        
        if (!$transcriberId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing transcriber ID']);
            exit();
        }
        
        // Check if transcriber has assigned orders
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM orders WHERE assigned_to = ? AND status NOT IN ('completed', 'delivered', 'cancelled')");
        $stmt->execute([$transcriberId]);
        $activeOrders = $stmt->fetchColumn();
        
        if ($activeOrders > 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'error' => 'Cannot delete transcriber with active orders. Please reassign or complete their orders first.'
            ]);
            exit();
        }
        
        // Delete the transcriber
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ? AND role = 'transcriber'");
        $stmt->execute([$transcriberId]);
        
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Transcriber not found']);
            exit();
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Transcriber deleted successfully'
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit();
}

// GET Reports (Last 7 days)
if ($method === 'GET' && $action === 'reports') {
    try {
        $stmt = $pdo->query("
            SELECT DATE(created_at) as date,
                   COUNT(*) as orders,
                   SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
            FROM orders
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date
        ");
        $data = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $data
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit();
}

// If no valid action
echo json_encode([
    'success' => false,
    'error' => 'Invalid action or method',
    'available_actions' => ['dashboard', 'orders', 'daily', 'transcribers', 'add-transcriber', 'delete-transcriber', 'assign', 'status', 'delete', 'reports']
]);
