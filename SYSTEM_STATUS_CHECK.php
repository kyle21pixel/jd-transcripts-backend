<?php
/**
 * Complete System Status Check
 * This file checks all components of the JD Reporting system
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

$checks = [];

// Check 1: PHP Version
$checks[] = [
    'name' => 'PHP Version',
    'status' => version_compare(PHP_VERSION, '7.4.0', '>='),
    'message' => 'PHP ' . PHP_VERSION,
    'required' => 'PHP 7.4 or higher'
];

// Check 2: PDO Extension
$checks[] = [
    'name' => 'PDO Extension',
    'status' => extension_loaded('pdo'),
    'message' => extension_loaded('pdo') ? 'Installed' : 'Not installed',
    'required' => 'Required for database'
];

// Check 3: PDO MySQL Driver
$checks[] = [
    'name' => 'PDO MySQL Driver',
    'status' => extension_loaded('pdo_mysql'),
    'message' => extension_loaded('pdo_mysql') ? 'Installed' : 'Not installed',
    'required' => 'Required for MySQL'
];

// Check 4: File permissions (uploads directory)
$upload_dir = __DIR__ . '/uploads';
$uploads_writable = is_dir($upload_dir) && is_writable($upload_dir);
if (!is_dir($upload_dir)) {
    @mkdir($upload_dir, 0777, true);
    $uploads_writable = is_writable($upload_dir);
}
$checks[] = [
    'name' => 'Uploads Directory',
    'status' => $uploads_writable,
    'message' => $uploads_writable ? 'Writable' : 'Not writable or missing',
    'required' => 'Required for file uploads'
];

// Check 5: Database Connection
$db_connected = false;
$db_message = '';
try {
    $dsn = "mysql:host=localhost;port=3306;charset=utf8mb4";
    $conn = new PDO($dsn, 'root', '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $db_connected = true;
    $db_message = 'Connected successfully';
} catch (PDOException $e) {
    $db_message = 'Connection failed: ' . $e->getMessage();
}
$checks[] = [
    'name' => 'MySQL Connection',
    'status' => $db_connected,
    'message' => $db_message,
    'required' => 'MySQL must be running'
];

// Check 6: Database Exists
$db_exists = false;
$db_exists_message = '';
if ($db_connected) {
    try {
        $result = $conn->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'jd_reporting_company'");
        $db_exists = $result->rowCount() > 0;
        $db_exists_message = $db_exists ? 'Database exists' : 'Database does not exist (will be created automatically)';
    } catch (PDOException $e) {
        $db_exists_message = 'Cannot check: ' . $e->getMessage();
    }
}
$checks[] = [
    'name' => 'Database (jd_reporting_company)',
    'status' => $db_connected, // We'll auto-create it, so connection is enough
    'message' => $db_exists_message,
    'required' => 'Auto-created on first use'
];

// Check 7: Required Files
$required_files = [
    'php_backend/config/database.php',
    'php_backend/api/orders.php',
    'php_backend/admin/index.php',
    'php_backend/transcriber/index.php',
    'order-form.html'
];

$files_exist = true;
$missing_files = [];
foreach ($required_files as $file) {
    if (!file_exists(__DIR__ . '/' . $file)) {
        $files_exist = false;
        $missing_files[] = $file;
    }
}

$checks[] = [
    'name' => 'Required Files',
    'status' => $files_exist,
    'message' => $files_exist ? 'All files present' : 'Missing: ' . implode(', ', $missing_files),
    'required' => 'Core system files'
];

// Calculate overall status
$all_critical_passed = true;
foreach ($checks as $check) {
    if (!$check['status'] && in_array($check['name'], ['PDO Extension', 'PDO MySQL Driver', 'MySQL Connection'])) {
        $all_critical_passed = false;
    }
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>JD Reporting - System Status</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .overall-status {
            padding: 20px 30px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }
        .overall-status.success {
            background: #10b981;
            color: white;
        }
        .overall-status.warning {
            background: #f59e0b;
            color: white;
        }
        .overall-status.error {
            background: #ef4444;
            color: white;
        }
        .checks {
            padding: 30px;
        }
        .check-item {
            display: flex;
            align-items: center;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 10px;
            background: #f9fafb;
            border-left: 4px solid #e5e7eb;
        }
        .check-item.pass {
            border-left-color: #10b981;
            background: #ecfdf5;
        }
        .check-item.fail {
            border-left-color: #ef4444;
            background: #fef2f2;
        }
        .check-icon {
            font-size: 24px;
            margin-right: 15px;
            width: 30px;
        }
        .check-content {
            flex: 1;
        }
        .check-name {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
        }
        .check-message {
            font-size: 14px;
            color: #6b7280;
        }
        .check-required {
            font-size: 12px;
            color: #9ca3af;
            font-style: italic;
        }
        .actions {
            padding: 30px;
            background: #f9fafb;
            text-align: center;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            margin: 5px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .btn-secondary {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 System Status Check</h1>
            <p>JD Reporting Company - System Diagnostics</p>
        </div>
        
        <div class="overall-status <?php echo $all_critical_passed ? 'success' : 'error'; ?>">
            <?php if ($all_critical_passed): ?>
                ✅ SYSTEM READY - All critical components operational
            <?php else: ?>
                ❌ SYSTEM NOT READY - Please fix critical issues below
            <?php endif; ?>
        </div>
        
        <div class="checks">
            <?php foreach ($checks as $check): ?>
                <div class="check-item <?php echo $check['status'] ? 'pass' : 'fail'; ?>">
                    <div class="check-icon">
                        <?php echo $check['status'] ? '✅' : '❌'; ?>
                    </div>
                    <div class="check-content">
                        <div class="check-name"><?php echo $check['name']; ?></div>
                        <div class="check-message"><?php echo $check['message']; ?></div>
                        <div class="check-required"><?php echo $check['required']; ?></div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        
        <div class="actions">
            <?php if ($all_critical_passed): ?>
                <a href="php_backend/config/test_connection.php" class="btn">🗄️ Initialize Database</a>
                <a href="order-form.html" class="btn">📝 Test Order Form</a>
                <a href="php_backend/admin/login.php" class="btn">👨‍💼 Admin Login</a>
            <?php else: ?>
                <a href="javascript:location.reload()" class="btn">🔄 Recheck Status</a>
                <a href="http://localhost/dashboard" class="btn-secondary">🚀 Open XAMPP</a>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
