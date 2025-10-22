<?php
/**
 * Test Order Connection to Database
 * This script tests if orders are being saved to MySQL properly
 */

require_once 'php_backend/config/database.php';

header('Content-Type: application/json');

try {
    $db = new Database();
    
    // Test data for a sample order
    $testData = [
        'order_number' => 'JD-TEST-' . time(),
        'client_name' => 'Test Customer',
        'client_email' => 'test@example.com',
        'client_phone' => '555-0123',
        'service_type' => 'legal',
        'turnaround' => '24h',
        'file_name' => 'test_audio.mp3',
        'file_path' => '/uploads/test_audio.mp3',
        'duration_minutes' => 30,
        'estimated_cost' => 300.00,
        'special_instructions' => 'This is a test order',
        'status' => 'pending',
        'deadline' => date('Y-m-d H:i:s', strtotime('+1 day'))
    ];
    
    // Insert test order
    $sql = "INSERT INTO orders (
        order_number, client_name, client_email, client_phone,
        service_type, turnaround, file_name, file_path,
        duration_minutes, estimated_cost, special_instructions,
        status, deadline, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $params = [
        $testData['order_number'],
        $testData['client_name'],
        $testData['client_email'],
        $testData['client_phone'],
        $testData['service_type'],
        $testData['turnaround'],
        $testData['file_name'],
        $testData['file_path'],
        $testData['duration_minutes'],
        $testData['estimated_cost'],
        $testData['special_instructions'],
        $testData['status'],
        $testData['deadline']
    ];
    
    $result = $db->query($sql, $params);
    
    if ($result) {
        $orderId = $db->getConnection()->lastInsertId();
        
        // Verify the order was created
        $verifyResult = $db->query("SELECT * FROM orders WHERE id = ?", [$orderId]);
        $order = $verifyResult->fetch();
        
        echo json_encode([
            'success' => true,
            'message' => 'Test order created successfully!',
            'order_id' => $orderId,
            'order_number' => $testData['order_number'],
            'order_details' => $order,
            'instructions' => [
                'step_1' => 'Open phpMyAdmin at http://localhost:8080/phpmyadmin/',
                'step_2' => 'Select the "jd_reporting_company" database from the left sidebar',
                'step_3' => 'Click on the "orders" table',
                'step_4' => 'You should see the test order with order number: ' . $testData['order_number']
            ]
        ], JSON_PRETTY_PRINT);
    } else {
        throw new Exception('Failed to insert test order');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'troubleshooting' => [
            'check_1' => 'Verify XAMPP MySQL is running on port 3307',
            'check_2' => 'Confirm database "jd_reporting_company" exists',
            'check_3' => 'Ensure Apache/PHP is running in XAMPP'
        ]
    ], JSON_PRETTY_PRINT);
}
