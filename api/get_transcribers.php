<?php
/**
 * Get Transcribers API
 * Returns list of available transcribers for assignment
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../database/config.php';

startSecureSession();
requireRole('manager');

try {
    $db = getDB();
    
    // Get all active transcribers with their current workload
    $sql = "SELECT 
        u.id, u.first_name, u.last_name, u.email,
        COUNT(o.id) as active_orders,
        MAX(o.deadline) as latest_deadline
    FROM users u
    LEFT JOIN orders o ON u.id = o.assigned_to AND o.status IN ('assigned', 'in_progress')
    WHERE u.role = 'transcriber' AND u.status = 'active'
    GROUP BY u.id, u.first_name, u.last_name, u.email
    ORDER BY active_orders ASC, u.first_name ASC";
    
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $transcribers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the data
    foreach ($transcribers as &$transcriber) {
        $transcriber['full_name'] = $transcriber['first_name'] . ' ' . $transcriber['last_name'];
        $transcriber['workload_status'] = $transcriber['active_orders'] == 0 ? 'Available' : 
            ($transcriber['active_orders'] <= 2 ? 'Light Load' : 
            ($transcriber['active_orders'] <= 5 ? 'Moderate Load' : 'Heavy Load'));
    }
    
    echo json_encode([
        'success' => true,
        'transcribers' => $transcribers
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>