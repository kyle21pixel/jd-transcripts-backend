<?php
/**
 * Database Management Interface
 * This script provides a simple interface to manage the database
 */

// Include the database configuration
require_once 'config.php';

// Create a new database instance
$database = new Database();
$conn = $database->getConnection();

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle database reset
    if (isset($_POST['reset_db'])) {
        try {
            // Drop all tables
            $conn->exec("SET FOREIGN_KEY_CHECKS = 0");
            $stmt = $conn->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            foreach ($tables as $table) {
                $conn->exec("DROP TABLE IF EXISTS `$table`");
            }
            $conn->exec("SET FOREIGN_KEY_CHECKS = 1");
            
            $message = "Database reset successful. All tables have been dropped.";
            $messageType = "success";
        } catch (PDOException $e) {
            $message = "Error resetting database: " . $e->getMessage();
            $messageType = "error";
        }
    }
    
    // Handle setup script execution
    if (isset($_POST['run_setup'])) {
        try {
            $setupFile = __DIR__ . '/setup.sql';
            $sql = file_get_contents($setupFile);
            
            // Split SQL by semicolons
            $queries = explode(';', $sql);
            
            foreach ($queries as $query) {
                $query = trim($query);
                if (!empty($query)) {
                    $conn->exec($query);
                }
            }
            
            $message = "Setup script executed successfully.";
            $messageType = "success";
        } catch (PDOException $e) {
            $message = "Error executing setup script: " . $e->getMessage();
            $messageType = "error";
        }
    }
    
    // Handle backup creation
    if (isset($_POST['create_backup'])) {
        try {
            $backupDir = __DIR__ . '/backups';
            if (!is_dir($backupDir)) {
                mkdir($backupDir, 0755, true);
            }
            
            $backupFile = $backupDir . '/backup_' . date('Y-m-d_H-i-s') . '.sql';
            $output = '';
            
            // Get all tables
            $stmt = $conn->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            foreach ($tables as $table) {
                // Add table structure
                $stmt = $conn->query("SHOW CREATE TABLE `$table`");
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $output .= "DROP TABLE IF EXISTS `$table`;\n";
                $output .= $row['Create Table'] . ";\n\n";
                
                // Add table data
                $stmt = $conn->query("SELECT * FROM `$table`");
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                if (count($rows) > 0) {
                    $output .= "INSERT INTO `$table` VALUES\n";
                    $rowsOutput = [];
                    
                    foreach ($rows as $row) {
                        $values = [];
                        foreach ($row as $value) {
                            if ($value === null) {
                                $values[] = 'NULL';
                            } else {
                                $values[] = $conn->quote($value);
                            }
                        }
                        $rowsOutput[] = '(' . implode(', ', $values) . ')';
                    }
                    
                    $output .= implode(",\n", $rowsOutput) . ";\n\n";
                }
            }
            
            file_put_contents($backupFile, $output);
            
            $message = "Database backup created successfully: " . basename($backupFile);
            $messageType = "success";
        } catch (Exception $e) {
            $message = "Error creating backup: " . $e->getMessage();
            $messageType = "error";
        }
    }
}

// Get database information
$dbInfo = [
    'connection' => $database->testConnection(),
    'tables' => [],
    'records' => []
];

if ($dbInfo['connection']) {
    try {
        // Get tables
        $stmt = $conn->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $dbInfo['tables'] = $tables;
        
        // Get record counts for each table
        foreach ($tables as $table) {
            $stmt = $conn->query("SELECT COUNT(*) as count FROM `$table`");
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $dbInfo['records'][$table] = $row['count'];
        }
    } catch (PDOException $e) {
        $message = "Error querying database: " . $e->getMessage();
        $messageType = "error";
    }
}

// Get MySQL version
$mysqlVersion = '';
if ($dbInfo['connection']) {
    try {
        $stmt = $conn->query("SELECT VERSION() as version");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $mysqlVersion = $row['version'];
    } catch (PDOException $e) {
        // Ignore
    }
}

// Check for backups
$backups = [];
$backupDir = __DIR__ . '/backups';
if (is_dir($backupDir)) {
    $files = scandir($backupDir);
    foreach ($files as $file) {
        if ($file != '.' && $file != '..' && pathinfo($file, PATHINFO_EXTENSION) == 'sql') {
            $backups[] = [
                'name' => $file,
                'size' => filesize($backupDir . '/' . $file),
                'date' => date('Y-m-d H:i:s', filemtime($backupDir . '/' . $file))
            ];
        }
    }
    
    // Sort backups by date (newest first)
    usort($backups, function($a, $b) {
        return strtotime($b['date']) - strtotime($a['date']);
    });
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Management - JD Reporting Company</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
            color: #333;
            line-height: 1.6;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: 700;
        }
        
        .header p {
            opacity: 0.9;
            margin-top: 5px;
        }
        
        .card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .card-header {
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 15px;
            margin-bottom: 15px;
        }
        
        .card-header h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
        }
        
        .info-item {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
        }
        
        .info-item h3 {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 5px;
        }
        
        .info-item p {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
        }
        
        .table-list {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        
        .table-list th, .table-list td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .table-list th {
            font-weight: 600;
            color: #64748b;
            font-size: 14px;
        }
        
        .table-list tr:last-child td {
            border-bottom: none;
        }
        
        .btn {
            display: inline-block;
            background: #2563eb;
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .btn:hover {
            background: #1d4ed8;
        }
        
        .btn-danger {
            background: #ef4444;
        }
        
        .btn-danger:hover {
            background: #dc2626;
        }
        
        .btn-success {
            background: #10b981;
        }
        
        .btn-success:hover {
            background: #059669;
        }
        
        .btn-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .alert {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .alert-success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        
        .alert-error {
            background: #fee2e2;
            color: #b91c1c;
            border: 1px solid #fecaca;
        }
        
        .backup-list {
            margin-top: 15px;
        }
        
        .backup-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .backup-item:last-child {
            border-bottom: none;
        }
        
        .backup-info {
            flex: 1;
        }
        
        .backup-name {
            font-weight: 500;
            color: #1e293b;
        }
        
        .backup-meta {
            font-size: 14px;
            color: #64748b;
            margin-top: 5px;
        }
        
        .backup-actions {
            display: flex;
            gap: 10px;
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }
        
        .modal-content {
            background: white;
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
            padding: 20px;
        }
        
        .modal-header {
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 15px;
            margin-bottom: 15px;
        }
        
        .modal-header h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
        }
        
        .modal-body {
            margin-bottom: 20px;
        }
        
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        
        .close-modal {
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Database Management</h1>
            <p>JD Reporting Company - MySQL Database</p>
        </div>
        
        <?php if (isset($message)): ?>
            <div class="alert alert-<?php echo $messageType; ?>">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>
        
        <div class="card">
            <div class="card-header">
                <h2>Database Information</h2>
            </div>
            
            <div class="info-grid">
                <div class="info-item">
                    <h3>Connection Status</h3>
                    <p><?php echo $dbInfo['connection'] ? '✅ Connected' : '❌ Not Connected'; ?></p>
                </div>
                
                <div class="info-item">
                    <h3>Database Name</h3>
                    <p><?php echo DB_NAME; ?></p>
                </div>
                
                <div class="info-item">
                    <h3>MySQL Version</h3>
                    <p><?php echo $mysqlVersion ?: 'Unknown'; ?></p>
                </div>
                
                <div class="info-item">
                    <h3>Tables Count</h3>
                    <p><?php echo count($dbInfo['tables']); ?></p>
                </div>
            </div>
            
            <div class="btn-group">
                <form method="post" onsubmit="return confirm('Are you sure you want to run the setup script? This will create all tables if they don\'t exist.');">
                    <button type="submit" name="run_setup" class="btn btn-success">Run Setup Script</button>
                </form>
                
                <form method="post" onsubmit="return confirm('WARNING: This will delete all data in the database. Are you sure you want to continue?');">
                    <button type="submit" name="reset_db" class="btn btn-danger">Reset Database</button>
                </form>
                
                <form method="post">
                    <button type="submit" name="create_backup" class="btn">Create Backup</button>
                </form>
            </div>
        </div>
        
        <?php if ($dbInfo['connection'] && count($dbInfo['tables']) > 0): ?>
            <div class="card">
                <div class="card-header">
                    <h2>Database Tables</h2>
                </div>
                
                <table class="table-list">
                    <thead>
                        <tr>
                            <th>Table Name</th>
                            <th>Records</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($dbInfo['tables'] as $table): ?>
                            <tr>
                                <td><?php echo $table; ?></td>
                                <td><?php echo $dbInfo['records'][$table]; ?></td>
                                <td>
                                    <a href="#" class="btn" onclick="viewTable('<?php echo $table; ?>')">View</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
        
        <?php if (count($backups) > 0): ?>
            <div class="card">
                <div class="card-header">
                    <h2>Database Backups</h2>
                </div>
                
                <div class="backup-list">
                    <?php foreach ($backups as $backup): ?>
                        <div class="backup-item">
                            <div class="backup-info">
                                <div class="backup-name"><?php echo $backup['name']; ?></div>
                                <div class="backup-meta">
                                    Size: <?php echo formatBytes($backup['size']); ?> | 
                                    Date: <?php echo $backup['date']; ?>
                                </div>
                            </div>
                            <div class="backup-actions">
                                <a href="backups/<?php echo $backup['name']; ?>" class="btn" download>Download</a>
                                <a href="#" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this backup?')">Delete</a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>
    </div>
    
    <div class="modal" id="tableModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Table Data: <span id="tableName"></span></h2>
                <span class="close-modal" onclick="closeModal()">&times;</span>
            </div>
            <div class="modal-body" id="tableData">
                Loading...
            </div>
            <div class="modal-footer">
                <button class="btn" onclick="closeModal()">Close</button>
            </div>
        </div>
    </div>
    
    <script>
        function viewTable(tableName) {
            document.getElementById('tableName').textContent = tableName;
            document.getElementById('tableData').innerHTML = 'Loading...';
            document.getElementById('tableModal').style.display = 'flex';
            
            // Here you would typically fetch the table data via AJAX
            // For simplicity, we'll just show a message
            document.getElementById('tableData').innerHTML = 'Table data would be displayed here. In a real application, this would fetch data via AJAX.';
        }
        
        function closeModal() {
            document.getElementById('tableModal').style.display = 'none';
        }
        
        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target == document.getElementById('tableModal')) {
                closeModal();
            }
        }
    </script>
</body>
</html>

<?php
// Helper function to format bytes
function formatBytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    
    $bytes /= pow(1024, $pow);
    
    return round($bytes, $precision) . ' ' . $units[$pow];
}
?>