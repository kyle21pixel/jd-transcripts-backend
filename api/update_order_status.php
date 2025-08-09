<?php
/**
 * Update Order Status API
 * Handles order status updates from admin dashboard
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../database/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (empty($input['order_id']) || empty($input['new_status'])) {
        throw new Exception('Order ID and new status are required');
    }
    
    $order_id = (int)$input['order_id'];
    $new_status = sanitizeInput($input['new_status']);
    $notes = sanitizeInput($input['notes'] ?? '');
    $user_id = 1; // For demo, assume admin user ID is 1
    
    // Validate status
    $valid_statuses = ['pending', 'assigned', 'in_progress', 'completed', 'delivered', 'cancelled'];
    if (!in_array($new_status, $valid_statuses)) {
        throw new Exception('Invalid status');
    }
    
    $db = getDB();
    
    // Get current order details
    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$order_id]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        throw new Exception('Order not found');
    }
    
    $old_status = $order['status'];
    
    // Update order status
    $update_sql = "UPDATE orders SET status = ?, updated_at = NOW()";
    $params = [$new_status];
    
    // Set completion time if status is completed
    if ($new_status === 'completed') {
        $update_sql .= ", completed_at = NOW()";
    }
    
    // Set delivery time if status is delivered
    if ($new_status === 'delivered') {
        $update_sql .= ", delivered_at = NOW()";
    }
    
    $update_sql .= " WHERE id = ?";
    $params[] = $order_id;
    
    $stmt = $db->prepare($update_sql);
    $stmt->execute($params);
    
    // Add to status history
    $history_sql = "INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, notes) VALUES (?, ?, ?, ?, ?)";
    $history_stmt = $db->prepare($history_sql);
    $history_stmt->execute([$order_id, $old_status, $new_status, $user_id, $notes]);
    
    // Send notification to client based on status
    $notification_messages = [
        'assigned' => "Your order #{$order['order_number']} has been assigned to a transcriptionist and work will begin shortly.",
        'in_progress' => "Your order #{$order['order_number']} is currently being transcribed. We'll notify you when it's complete.",
        'completed' => "Great news! Your order #{$order['order_number']} has been completed. Please check your email for the transcript.",
        'delivered' => "Your order #{$order['order_number']} has been delivered. Thank you for choosing JD Transcripts!",
        'cancelled' => "Your order #{$order['order_number']} has been cancelled. If you have questions, please contact us."
    ];
    
    if (isset($notification_messages[$new_status])) {
        $subject = "Order Update - {$order['order_number']}";
        $message = $notification_messages[$new_status];
        sendNotification($order['client_email'], $subject, $message);
        
        // Add database notification if user exists
        $user_check = $db->prepare("SELECT id FROM users WHERE email = ?");
        $user_check->execute([$order['client_email']]);
        $client_user = $user_check->fetch();
        
        if ($client_user) {
            $notif_sql = "INSERT INTO notifications (user_id, title, message, type, related_order_id) VALUES (?, ?, ?, 'order', ?)";
            $notif_stmt = $db->prepare($notif_sql);
            $notif_stmt->execute([
                $client_user['id'],
                "Order Update: {$order['order_number']}",
                $message,
                $order_id
            ]);
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => "Order status updated to '$new_status'",
        'order_id' => $order_id,
        'old_status' => $old_status,
        'new_status' => $new_status
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>