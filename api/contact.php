<?php
/**
 * Contact Form API
 * Handles contact form submissions
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
    
    // Fallback to POST data if JSON is not available
    if (!$input) {
        $input = $_POST;
    }
    
    // Validate required fields
    $required_fields = ['contactName', 'contactEmail', 'contactMessage'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Field '$field' is required");
        }
    }
    
    // Sanitize input
    $name = sanitizeInput($input['contactName']);
    $email = filter_var($input['contactEmail'], FILTER_VALIDATE_EMAIL);
    $message = sanitizeInput($input['contactMessage']);
    
    if (!$email) {
        throw new Exception('Invalid email address');
    }
    
    // Store contact message in database (optional)
    $db = getDB();
    if ($db) {
        try {
            // Create contacts table if it doesn't exist
            $db->exec("
                CREATE TABLE IF NOT EXISTS contacts (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) NOT NULL,
                    message TEXT NOT NULL,
                    status ENUM('new', 'read', 'replied') DEFAULT 'new',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ");
            
            // Insert contact message
            $stmt = $db->prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
            $stmt->execute([$name, $email, $message]);
            
        } catch (PDOException $e) {
            // Log error but don't fail the request
            error_log("Contact form database error: " . $e->getMessage());
        }
    }
    
    // Send notification to admin
    $admin_email = 'admin@jdlegaltranscripts.com';
    $subject = "New Contact Form Submission from $name";
    $notification_message = "
        New contact form submission:
        
        Name: $name
        Email: $email
        Message: $message
        
        Submitted at: " . date('Y-m-d H:i:s') . "
    ";
    
    sendNotification($admin_email, $subject, $notification_message);
    
    // Send auto-reply to customer
    $customer_subject = "Thank you for contacting JD Transcripts";
    $customer_message = "
        Dear $name,
        
        Thank you for contacting JD Legal Transcripts. We have received your message and will respond within 24 hours.
        
        Your message:
        $message
        
        Best regards,
        JD Legal Transcripts Team
        
        ---
        This is an automated response. Please do not reply to this email.
    ";
    
    sendNotification($email, $customer_subject, $customer_message);
    
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! We will get back to you within 24 hours.'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>