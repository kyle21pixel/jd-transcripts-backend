<?php
session_start();
require_once '../config/database.php';

// Check if user is logged in and is transcriber
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'transcriber') {
    header('Location: ../admin/login.php');
    exit();
}

$db = new Database();

// Get transcriber's assigned orders
$myOrders = $db->fetchAll(
    "SELECT o.*, 
     TIMESTAMPDIFF(HOUR, NOW(), o.deadline) as hours_remaining
     FROM orders o
     WHERE o.assigned_to = ?
     AND o.status IN ('assigned', 'in_progress')
     ORDER BY o.deadline ASC",
    [$_SESSION['user_id']]
);

// Get transcriber statistics
$stats = [
    'assigned' => $db->fetch(
        "SELECT COUNT(*) as count FROM orders WHERE assigned_to = ? AND status = 'assigned'",
        [$_SESSION['user_id']]
    )['count'],
    'in_progress' => $db->fetch(
        "SELECT COUNT(*) as count FROM orders WHERE assigned_to = ? AND status = 'in_progress'",
        [$_SESSION['user_id']]
    )['count'],
    'completed_today' => $db->fetch(
        "SELECT COUNT(*) as count FROM orders 
         WHERE assigned_to = ? AND status = 'completed' 
         AND DATE(completed_at) = CURDATE()",
        [$_SESSION['user_id']]
    )['count'],
    'total_completed' => $db->fetch(
        "SELECT COUNT(*) as count FROM orders WHERE assigned_to = ? AND status = 'completed'",
        [$_SESSION['user_id']]
    )['count']
];

// Handle status updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'update_status') {
        $orderId = $_POST['order_id'];
        $newStatus = $_POST['status'];
        
        // Verify this order is assigned to the transcriber
        $order = $db->fetch(
            "SELECT * FROM orders WHERE id = ? AND assigned_to = ?",
            [$orderId, $_SESSION['user_id']]
        );
        
        if ($order) {
            $updateData = ['status' => $newStatus];
            
            if ($newStatus === 'completed') {
                $updateData['completed_at'] = date('Y-m-d H:i:s');
            }
            
            $db->update('orders', $updateData, ['id' => $orderId]);
            
            $db->query(
                "INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, created_at) 
                 VALUES (?, ?, ?, ?, NOW())",
                [$orderId, $order['status'], $newStatus, $_SESSION['user_id']]
            );
            
            $_SESSION['message'] = 'Order status updated successfully!';
        }
        
        header('Location: index.php');
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transcriber Dashboard - JD Reporting Company</title>
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
            line-height: 1.6;
        }

        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header h1 {
            font-size: 1.5rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .container {
            max-width: 1400px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            text-align: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            opacity: 0;
            transition: opacity 0.3s;
        }

        .stat-card:hover::before {
            opacity: 1;
        }

        .stat-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
        }

        .stat-card h3 {
            font-size: 2.5rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
            position: relative;
            z-index: 1;
        }

        .stat-card p {
            color: #555;
            font-weight: 500;
            position: relative;
            z-index: 1;
        }

        .card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            overflow: hidden;
            margin-bottom: 2rem;
            animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .card-header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 1.5rem;
            font-weight: 600;
            font-size: 1.2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
        }

        .table th, .table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #f0f0f0;
        }

        .table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
        }

        .table tr {
            transition: all 0.2s ease;
        }

        .table tbody tr:hover {
            background: linear-gradient(90deg, rgba(102, 126, 234, 0.05), transparent);
            transform: translateX(5px);
        }

        .status {
            padding: 0.4rem 1rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status.assigned { 
            background: linear-gradient(135deg, #ffd89b, #19547b);
            color: white;
        }
        .status.in_progress { 
            background: linear-gradient(135deg, #84fab0, #8fd3f4);
            color: #155724;
        }
        .status.completed { 
            background: linear-gradient(135deg, #a8edea, #fed6e3);
            color: #0c5460;
        }

        .btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 0.6rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            font-size: 0.875rem;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .btn:active {
            transform: translateY(0);
        }

        .btn-sm {
            padding: 0.4rem 1rem;
            font-size: 0.75rem;
        }

        .btn-success { 
            background: linear-gradient(135deg, #11998e, #38ef7d);
        }

        .btn-warning { 
            background: linear-gradient(135deg, #f093fb, #f5576c);
        }

        .priority-high {
            border-left: 4px solid #e74c3c;
        }

        .priority-medium {
            border-left: 4px solid #f39c12;
        }

        .priority-low {
            border-left: 4px solid #3498db;
        }

        .deadline-warning {
            color: #e74c3c;
            font-weight: bold;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        .upload-zone {
            border: 2px dashed #667eea;
            border-radius: 10px;
            padding: 1rem;
            text-align: center;
            transition: all 0.3s;
            cursor: pointer;
        }

        .upload-zone:hover {
            background: rgba(102, 126, 234, 0.05);
            border-color: #764ba2;
        }

        .upload-zone.dragover {
            background: rgba(102, 126, 234, 0.1);
            border-color: #764ba2;
            transform: scale(1.02);
        }

        .alert {
            padding: 1rem 1.5rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .alert-success {
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
            color: #155724;
            border-left: 4px solid #28a745;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin-top: 0.5rem;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .progress-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        @media (max-width: 768px) {
            .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>🎯 Transcriber Dashboard</h1>
        <div class="user-info">
            <span>👋 <?= htmlspecialchars($_SESSION['username']) ?></span>
            <a href="../admin/logout.php" class="btn btn-sm">Logout</a>
        </div>
    </header>

    <div class="container">
        <?php if (isset($_SESSION['message'])): ?>
            <div class="alert alert-success">
                <?= htmlspecialchars($_SESSION['message']) ?>
            </div>
            <?php unset($_SESSION['message']); ?>
        <?php endif; ?>

        <div class="stats-grid">
            <div class="stat-card">
                <h3 id="stat_assigned"><?= $stats['assigned'] ?></h3>
                <p>📋 New Assignments</p>
            </div>
            <div class="stat-card">
                <h3 id="stat_in_progress"><?= $stats['in_progress'] ?></h3>
                <p>⚡ In Progress</p>
            </div>
            <div class="stat-card">
                <h3 id="stat_completed_today"><?= $stats['completed_today'] ?></h3>
                <p>✅ Completed Today</p>
            </div>
            <div class="stat-card">
                <h3 id="stat_total_completed"><?= $stats['total_completed'] ?></h3>
                <p>🏆 Total Completed</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <span>📝 My Active Tasks</span>
                <button class="btn btn-sm" onclick="refreshTasks()">🔄 Refresh</button>
            </div>
            <div style="overflow-x: auto;">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Client</th>
                            <th>Service Type</th>
                            <th>Status</th>
                            <th>Deadline</th>
                            <th>Progress</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tasksTable">
                        <?php if (empty($myOrders)): ?>
                            <tr>
                                <td colspan="7" style="text-align: center; padding: 3rem; color: #888;">
                                    <div style="font-size: 3rem;">📭</div>
                                    <p>No active tasks at the moment</p>
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($myOrders as $order): ?>
                                <?php
                                $priority = 'low';
                                if ($order['hours_remaining'] < 4) {
                                    $priority = 'high';
                                } elseif ($order['hours_remaining'] < 24) {
                                    $priority = 'medium';
                                }
                                ?>
                                <tr class="priority-<?= $priority ?>">
                                    <td><strong><?= htmlspecialchars($order['order_number']) ?></strong></td>
                                    <td><?= htmlspecialchars($order['client_name']) ?></td>
                                    <td><?= ucfirst($order['service_type']) ?></td>
                                    <td><span class="status <?= $order['status'] ?>"><?= ucfirst(str_replace('_', ' ', $order['status'])) ?></span></td>
                                    <td>
                                        <?php if ($order['hours_remaining'] < 4): ?>
                                            <span class="deadline-warning">
                                                ⚠️ <?= date('M j, H:i', strtotime($order['deadline'])) ?>
                                            </span>
                                        <?php else: ?>
                                            <?= date('M j, H:i', strtotime($order['deadline'])) ?>
                                        <?php endif; ?>
                                        <br>
                                        <small style="color: #888;">
                                            <?= abs($order['hours_remaining']) ?>h <?= $order['hours_remaining'] < 0 ? 'overdue' : 'remaining' ?>
                                        </small>
                                    </td>
                                    <td>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: <?= $order['status'] === 'in_progress' ? '50%' : '10%' ?>"></div>
                                        </div>
                                    </td>
                                    <td>
                                        <?php if ($order['status'] === 'assigned'): ?>
                                            <button class="btn btn-sm btn-success" onclick="startWork(<?= $order['id'] ?>)">▶️ Start</button>
                                        <?php elseif ($order['status'] === 'in_progress'): ?>
                                            <button class="btn btn-sm" onclick="showUpload(<?= $order['id'] ?>)">📤 Upload</button>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Upload Modal -->
    <div id="uploadModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; animation: fadeIn 0.3s;">
        <div style="background: white; margin: 5% auto; padding: 2rem; border-radius: 15px; max-width: 500px; animation: slideUp 0.3s;">
            <h2>Upload Completed Transcription</h2>
            <div class="upload-zone" id="dropZone">
                <p>📁 Drag & drop your file here or click to browse</p>
                <input type="file" id="fileInput" style="display: none;" accept=".pdf,.doc,.docx,.txt">
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="btn btn-warning" onclick="closeUpload()">Cancel</button>
                <button class="btn btn-success" onclick="uploadFile()">Upload & Complete</button>
            </div>
        </div>
    </div>

    <script>
        let currentOrderId = null;

        function startWork(orderId) {
            if (confirm('Start working on this order?')) {
                updateOrderStatus(orderId, 'in_progress');
            }
        }

        function showUpload(orderId) {
            currentOrderId = orderId;
            document.getElementById('uploadModal').style.display = 'block';
        }

        function closeUpload() {
            document.getElementById('uploadModal').style.display = 'none';
            currentOrderId = null;
        }

        function updateOrderStatus(orderId, status) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.innerHTML = `
                <input type="hidden" name="action" value="update_status">
                <input type="hidden" name="order_id" value="${orderId}">
                <input type="hidden" name="status" value="${status}">
            `;
            document.body.appendChild(form);
            form.submit();
        }

        function uploadFile() {
            const fileInput = document.getElementById('fileInput');
            if (!fileInput.files.length) {
                alert('Please select a file to upload');
                return;
            }
            
            // In a real implementation, upload the file via AJAX
            alert('File upload functionality would be implemented here');
            updateOrderStatus(currentOrderId, 'completed');
        }

        function refreshTasks() {
            location.reload();
        }

        // Drag and drop functionality
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');

        dropZone.onclick = () => fileInput.click();

        dropZone.ondragover = (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        };

        dropZone.ondragleave = () => {
            dropZone.classList.remove('dragover');
        };

        dropZone.ondrop = (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            fileInput.files = e.dataTransfer.files;
            dropZone.querySelector('p').textContent = '✓ ' + fileInput.files[0].name;
        };

        fileInput.onchange = () => {
            if (fileInput.files.length) {
                dropZone.querySelector('p').textContent = '✓ ' + fileInput.files[0].name;
            }
        };

        // Auto-refresh every 60 seconds
        setInterval(refreshTasks, 60000);

        console.log('Transcriber Dashboard loaded successfully! 🚀');
    </script>
</body>
</html>
