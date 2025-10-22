<?php
// Test orders API endpoint
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Simulate a POST request to the API
$_SERVER['REQUEST_METHOD'] = 'POST';

// Sample order data
$orderData = [
    'client_name' => 'Test Client',
    'client_email' => 'test@example.com',
    'client_phone' => '555-1234',
    'service_type' => 'legal',
    'turnaround' => '24h',
    'file_name' => 'test-audio.mp3',
    'special_instructions' => 'This is a test order'
];

// Simulate the input
$_POST = $orderData;

echo "Testing orders API endpoint...\n\n";
echo "Request data:\n";
print_r($orderData);
echo "\n";

// Include and test the API
ob_start();
include 'C:\xampp\htdocs\jd 3\php_backend\api\orders.php';
$output = ob_get_clean();

echo "API Response:\n";
echo $output;
echo "\n";

// Try to decode JSON
$response = json_decode($output, true);
if (json_last_error() === JSON_ERROR_NONE) {
    echo "\n✅ Valid JSON response!\n";
    if (isset($response['success']) && $response['success']) {
        echo "✅ Order created successfully!\n";
        echo "Order Number: " . ($response['order']['order_number'] ?? 'N/A') . "\n";
    } else {
        echo "❌ Order creation failed: " . ($response['error'] ?? 'Unknown error') . "\n";
    }
} else {
    echo "\n❌ Invalid JSON response!\n";
    echo "JSON Error: " . json_last_error_msg() . "\n";
}
?>
