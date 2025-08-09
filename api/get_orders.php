<?php
/**
 * Get Orders API
 * Retrieves orders for dashboard display
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../database/config.php';

startSecureSession();

if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Authentication required']);
    exit();
}

try {
    $db = getDB();
    
    $user_role = $_SESSION['role'];
    $user_id = $_SESSION['user_id'];
    
    // Build query based on user role
    $sql = "SELECT 
        o.id, o.order_number, o.client_name, o.client_email, o.client_phone,
        o.service_type, o.turnaround, o.file_name, o.file_size, o.duration_minutes,
        o.estimated_cost, o.special_instructions, o.status, o.deadline,
        o.created_at, o.updated_at, o.assigned_at, o.completed_at,
        u1.first_name as assigned_to_name, u1.last_name as assigned_to_lastname,
        u2.first_name as assigned_by_name, u2.last_name as assigned_by_lastname
    FROM orders o
    LEFT JOIN users u1 ON o.assigned_to = u1.id
    LEFT JOIN users u2 ON o.assigned_by = u2.id";
    
    $params = [];
    
    // Filter based on role
    if ($user_role === 'transcriber') {
        $sql .= " WHERE o.assigned_to = ?";
        $params[] = $user_id;
    } elseif ($user_role === 'manager') {
        // Managers see all orders
    } elseif ($user_role === 'admin') {
        // Admins see all orders
    } else {
        throw new Exception('Access denied');
    }
    
    $sql .= " ORDER BY o.created_at DESC";
    
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the data
    foreach ($orders as &$order) {
        $order['assigned_to_full_name'] = $order['assigned_to_name'] ? 
            $order['assigned_to_name'] . ' ' . $order['assigned_to_lastname'] : null;
        $order['assigned_by_full_name'] = $order['assigned_by_name'] ? 
            $order['assigned_by_name'] . ' ' . $order['assigned_by_lastname'] : null;
        
        // Format file size
        if ($order['file_size']) {
            $order['file_size_formatted'] = formatFileSize($order['file_size']);
        }
        
        // Calculate time remaining
        if ($order['deadline']) {
            $deadline = new DateTime($order['deadline']);
            $now = new DateTime();
            $diff = $now->diff($deadline);
            
            if ($deadline < $now) {
                $order['time_remaining'] = 'Overdue';
                $order['is_overdue'] = true;
            } else {
                $order['time_remaining'] = $diff->format('%d days, %h hours');
                $order['is_overdue'] = false;
            }
        }
    }
    
    // Get summary statistics
    $stats_sql = "SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'assigned' THEN 1 ELSE 0 END) as assigned_orders,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_orders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
        SUM(estimated_cost) as total_revenue
    FROM orders";
    
    if ($user_role === 'transcriber') {
        $stats_sql .= " WHERE assigned_to = ?";
        $stats_params = [$user_id];
    } else {
        $stats_params = [];
    }
    
    $stats_stmt = $db->prepare($stats_sql);
    $stats_stmt->execute($stats_params);
    $stats = $stats_stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'orders' => $orders,
        'statistics' => $stats,
        'user_role' => $user_role
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

function formatFileSize($bytes) {
    if ($bytes >= 1073741824) {
        return number_format($bytes / 1073741824, 2) . ' GB';
    } elseif ($bytes >= 1048576) {
        return number_format($bytes / 1048576, 2) . ' MB';
    } elseif ($bytes >= 1024) {
        return number_format($bytes / 1024, 2) . ' KB';
    } else {
        return $bytes . ' bytes';
    }
}
?>