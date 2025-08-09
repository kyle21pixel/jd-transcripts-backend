<?php
/**
 * Order Submission API
 * Handles new transcription orders
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
    $db = getDB();
    
    // Validate required fields
    $required_fields = ['name', 'email', 'service', 'turnaround'];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("Field '$field' is required");
        }
    }
    
    // Sanitize input
    $client_name = sanitizeInput($_POST['name']);
    $client_email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $client_phone = sanitizeInput($_POST['phone'] ?? '');
    $service_type = sanitizeInput($_POST['service']);
    $turnaround = sanitizeInput($_POST['turnaround']);
    $special_instructions = sanitizeInput($_POST['notes'] ?? '');
    
    if (!$client_email) {
        throw new Exception('Invalid email address');
    }
    
    // Handle file upload
    $file_name = '';
    $file_path = '';
    $file_size = 0;
    $duration_minutes = 0;
    
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = '../uploads/orders/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        
        $file_name = $_FILES['file']['name'];
        $file_size = $_FILES['file']['size'];
        $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        
        // Validate file type
        $allowed_extensions = ['mp3', 'wav', 'mp4', 'mov', 'avi', 'm4a', 'wma'];
        if (!in_array($file_extension, $allowed_extensions)) {
            throw new Exception('Invalid file type. Please upload audio or video files only.');
        }
        
        // Generate unique filename
        $unique_filename = uniqid() . '_' . $file_name;
        $file_path = $upload_dir . $unique_filename;
        
        if (!move_uploaded_file($_FILES['file']['tmp_name'], $file_path)) {
            throw new Exception('Failed to upload file');
        }
        
        // Estimate duration (simplified - in production you'd use ffmpeg or similar)
        $duration_minutes = max(1, round($file_size / (1024 * 1024))); // Rough estimate: 1MB = 1 minute
    }
    
    // Generate order number
    $order_number = generateOrderNumber();
    
    // Calculate estimated cost
    $estimated_cost = calculateCost($service_type, $duration_minutes, $turnaround);
    
    // Calculate deadline
    $deadline_hours = [
        'same-day' => 8,
        '24h' => 24,
        '48h' => 48,
        '3-5' => 120
    ];
    $deadline = date('Y-m-d H:i:s', strtotime('+' . $deadline_hours[$turnaround] . ' hours'));
    
    // Insert order into database
    $sql = "INSERT INTO orders (
        order_number, client_name, client_email, client_phone, 
        service_type, turnaround, file_name, file_path, file_size, 
        duration_minutes, estimated_cost, special_instructions, deadline
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([
        $order_number, $client_name, $client_email, $client_phone,
        $service_type, $turnaround, $file_name, $file_path, $file_size,
        $duration_minutes, $estimated_cost, $special_instructions, $deadline
    ]);
    
    $order_id = $db->lastInsertId();
    
    // Add to status history
    $history_sql = "INSERT INTO order_status_history (order_id, new_status, notes) VALUES (?, 'pending', 'Order submitted by client')";
    $history_stmt = $db->prepare($history_sql);
    $history_stmt->execute([$order_id]);
    
    // Send notification to managers
    $manager_sql = "SELECT email FROM users WHERE role IN ('admin', 'manager') AND status = 'active'";
    $manager_stmt = $db->prepare($manager_sql);
    $manager_stmt->execute();
    $managers = $manager_stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($managers as $manager) {
        sendNotification(
            $manager['email'],
            "New Order Received - $order_number",
            "A new $service_type transcription order has been received from $client_name. Order #$order_number requires $turnaround turnaround."
        );
        
        // Add database notification
        $notif_sql = "INSERT INTO notifications (user_id, title, message, type, related_order_id) 
                      SELECT id, ?, ?, 'order', ? FROM users WHERE email = ?";
        $notif_stmt = $db->prepare($notif_sql);
        $notif_stmt->execute([
            "New Order: $order_number",
            "New $service_type order from $client_name",
            $order_id,
            $manager['email']
        ]);
    }
    
    // Send confirmation to client
    sendNotification(
        $client_email,
        "Order Confirmation - $order_number",
        "Thank you for your order! Your transcription request has been received and will be processed within the requested timeframe. Order #$order_number"
    );
    
    echo json_encode([
        'success' => true,
        'message' => 'Order submitted successfully!',
        'order_number' => $order_number,
        'estimated_cost' => $estimated_cost,
        'deadline' => $deadline
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>