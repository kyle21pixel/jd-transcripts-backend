<?php
/**
 * Database Configuration
 * 
 * IMPORTANT: Update these settings based on your hosting environment
 */

// Detect environment
$environment = getenv('ENVIRONMENT') ?: 'production';

if ($environment === 'development') {
    // Local Development (XAMPP)
    define('DB_HOST', '127.0.0.1');
    define('DB_PORT', '3307');
    define('DB_NAME', 'jd_reporting_company');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    
    // Enable error reporting for development
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    
} else {
    // Production Environment
    // Update these with your hosting provider's database credentials
    define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
    define('DB_PORT', getenv('DB_PORT') ?: '3306');
    define('DB_NAME', getenv('DB_NAME') ?: 'jd_reporting_company');
    define('DB_USER', getenv('DB_USER') ?: 'root');
    define('DB_PASS', getenv('DB_PASS') ?: '');
    
    // Disable error display in production
    error_reporting(E_ALL);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
}

// CORS Configuration
// Update this with your Netlify frontend URL after deployment
define('FRONTEND_URL', getenv('FRONTEND_URL') ?: 'http://localhost:5508');

// File Upload Settings
define('MAX_FILE_SIZE', 100 * 1024 * 1024); // 100MB
define('UPLOAD_PATH', __DIR__ . '/uploads/');

// Session Settings
define('SESSION_LIFETIME', 3600 * 24); // 24 hours

// Timezone
date_default_timezone_set('America/New_York');
