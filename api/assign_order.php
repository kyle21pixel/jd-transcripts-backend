<?php
/**
 * Assign Order API
 * Allows managers to assign orders to transcribers
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../database/config.php';

startSecureSession();
requireRole('manager');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    $db = getDB();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $order_id = (int)($input['order_id'] ?? 0);
    $transcriber_id = (int)($input['transcriber_id'] ?? 0);
    $notes = sanitizeInput($input['notes'] ?? '');
    
    if (!$order_id || !$transcriber_id) {
        throw new Exception('Order ID and Transcriber ID are required');
    }
    
    // Verify order exists and is assignable
    $order_sql = "SELECT id, order_number, client_name, service_type, status FROM orders WHERE id = ?";
    $order_stmt = $db->prepare($order_sql);
    $order_stmt->execute([$order_id]);
    $order = $order_stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        throw new Exception('Order not found');
    }
    
    if ($order['status'] !== 'pending') {
        throw new Exception('Order is not available for assignment');
    }
    
    // Verify transcriber exists and is active
    $transcriber_sql = "SELECT id, first_name, last_name, email FROM users WHERE id = ? AND role = 'transcriber' AND status = 'active'";
    $transcriber_stmt = $db->prepare($transcriber_sql);
    $transcriber_stmt->execute([$transcriber_id]);
    $transcriber = $transcriber_stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$transcriber) {
        throw new Exception('Transcriber not found or inactive');
    }
    
    // Update order
    $update_sql = "UPDATE orders SET 
        assigned_to = ?, 
        assigned_by = ?, 
        assigned_at = NOW(), 
        status = 'assigned' 
    WHERE id = ?";
    $update_stmt = $db->prepare($update_sql);
    $update_stmt->execute([$transcriber_id, $_SESSION['user_id'], $order_id]);
    
    // Add to status history
    $history_sql = "INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, notes) VALUES (?, 'pending', 'assigned', ?, ?)";
    $history_stmt = $db->prepare($history_sql);
    $history_stmt->execute([$order_id, $_SESSION['user_id'], "Assigned to {$transcriber['first_name']} {$transcriber['last_name']}. $notes"]);
    
    // Send notification to transcriber
    $notif_sql = "INSERT INTO notifications (user_id, title, message, type, related_order_id) VALUES (?, ?, ?, 'assignment', ?)";
    $notif_stmt = $db->prepare($notif_sql);
    $notif_stmt->execute([
        $transcriber_id,
        "New Assignment: {$order['order_number']}",
        "You have been assigned a new {$order['service_type']} transcription order from {$order['client_name']}.",
        $order_id
    ]);
    
    // Send email notification
    sendNotification(
        $transcriber['email'],
        "New Assignment: {$order['order_number']}",
        "You have been assigned order #{$order['order_number']} for {$order['service_type']} transcription. Please log in to your dashboard to view details."
    );
    
    echo json_encode([
        'success' => true,
        'message' => 'Order assigned successfully',
        'order_id' => $order_id,
        'transcriber' => $transcriber['first_name'] . ' ' . $transcriber['last_name']
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>