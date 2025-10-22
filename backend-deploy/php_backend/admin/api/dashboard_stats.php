<?php
session_start();
require_once '../../config/database.php';

// Check if user is logged in and is admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

header('Content-Type: application/json');

$db = new Database();

// Get dashboard statistics
$stats = [
    'total_orders' => $db->fetch("SELECT COUNT(*) as count FROM orders")['count'],
    'pending_orders' => $db->fetch("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'")['count'],
    'active_orders' => $db->fetch("SELECT COUNT(*) as count FROM orders WHERE status IN ('assigned', 'in_progress')")['count'],
    'completed_orders' => $db->fetch("SELECT COUNT(*) as count FROM orders WHERE status = 'completed'")['count'],
    'new_messages' => $db->fetch("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new'")['count'],
    'pending_applications' => $db->fetch("SELECT COUNT(*) as count FROM job_applications WHERE status = 'pending'")['count'],
    'total_customers' => $db->fetch("SELECT COUNT(*) as count FROM customers")['count'],
    'active_transcribers' => $db->fetch("SELECT COUNT(*) as count FROM users WHERE role = 'transcriber' AND status = 'active'")['count']
];

echo json_encode($stats);
?>
