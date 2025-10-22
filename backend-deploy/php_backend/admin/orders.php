<?php
session_start();
require_once '../config/database.php';

// Check if user is logged in and is admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header('Location: login.php');
    exit();
}

$db = new Database();

// Get available transcribers for assignment
$transcribers = $db->fetchAll(
    "SELECT id, username, first_name, last_name, email 
     FROM users 
     WHERE role = 'transcriber' AND status = 'active' 
     ORDER BY last_name, first_name"
);

// Handle order assignment/update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'assign':
                $orderId = $_POST['order_id'];
                $transcriberId = $_POST['transcriber_id'];
                
                $db->query(
                    "UPDATE orders SET assigned_to = ?, assigned_by = ?, assigned_at = NOW(), status = 'assigned' WHERE id = ?",
                    [$transcriberId, $_SESSION['user_id'], $orderId]
                );
                
                $db->query(
                    "INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, notes, created_at) 
                     VALUES (?, 'pending', 'assigned', ?, 'Order assigned to transcriber', NOW())",
                    [$orderId, $_SESSION['user_id']]
                );
                
                $_SESSION['message'] = 'Order assigned successfully!';
                break;
                
            case 'update_status':
                $orderId = $_POST['order_id'];
                $newStatus = $_POST['status'];
                
                // Get current status
                $currentOrder = $db->fetch("SELECT status FROM orders WHERE id = ?", [$orderId]);
                $oldStatus = $currentOrder['status'];
                
                $db->query("UPDATE orders SET status = ? WHERE id = ?", [$newStatus, $orderId]);
                
                $db->query(
                    "INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, notes, created_at) 
                     VALUES (?, ?, ?, ?, 'Status updated by admin', NOW())",
                    [$orderId, $oldStatus, $newStatus, $_SESSION['user_id']]
                );
                
                $_SESSION['message'] = 'Order status updated successfully!';
                break;
        }
        
        header('Location: orders.php');
        exit();
    }
}

// Get filter parameters
$statusFilter = $_GET['status'] ?? '';
$serviceFilter = $_GET['service'] ?? '';
$searchQuery = $_GET['search'] ?? '';

// Build query with filters
$whereClauses = [];
$params = [];

if ($statusFilter) {
    $whereClauses[] = "o.status = ?";
    $params[] = $statusFilter;
}

if ($serviceFilter) {
    $whereClauses[] = "o.service_type = ?";
    $params[] = $serviceFilter;
}

if ($searchQuery) {
    $whereClauses[] = "(o.order_number LIKE ? OR o.client_name LIKE ? OR o.client_email LIKE ?)";
    $params[] = "%$searchQuery%";
    $params[] = "%$searchQuery%";
    $params[] = "%$searchQuery%";
}

$whereClause = !empty($whereClauses) ? 'WHERE ' . implode(' AND ', $whereClauses) : '';

// Get orders
$orders = $db->fetchAll(
    "SELECT o.*, 
     u.first_name as transcriber_first_name, 
     u.last_name as transcriber_last_name,
     u.email as transcriber_email
     FROM orders o
     LEFT JOIN users u ON o.assigned_to = u.id
     $whereClause
     ORDER BY o.created_at DESC
     LIMIT 100",
    $params
);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Management - JD Reporting Company</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            line-height: 1.6;
        }

        .header {
            background: #2c3e50;
            color: white;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header h1 {
            font-size: 1.5rem;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .nav {
            background: #34495e;
            padding: 0 2rem;
        }

        .nav ul {
            list-style: none;
            display: flex;
            gap: 0;
        }

        .nav li a {
            color: white;
            text-decoration: none;
            padding: 1rem 1.5rem;
            display: block;
            transition: background 0.3s;
        }

        .nav li a:hover, .nav li a.active {
            background: #2c3e50;
        }

        .container {
            max-width: 1400px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        .filters {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .filters form {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            align-items: end;
        }

        .filter-group {
            flex: 1;
            min-width: 200px;
        }

        .filter-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #2c3e50;
        }

        .filter-group select,
        .filter-group input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
        }

        .btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            font-size: 0.875rem;
            transition: all 0.3s;
        }

        .btn:hover {
            background: #2980b9;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
        }

        .btn-success { background: #27ae60; }
        .btn-success:hover { background: #229954; }

        .btn-danger { background: #e74c3c; }
        .btn-danger:hover { background: #c0392b; }

        .btn-warning { background: #f39c12; }
        .btn-warning:hover { background: #e67e22; }

        .card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .card-header {
            background: #3498db;
            color: white;
            padding: 1rem 1.5rem;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .table-container {
            overflow-x: auto;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
        }

        .table th, .table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #ecf0f1;
        }

        .table th {
            background: #f8f9fa;
            font-weight: 600;
            position: sticky;
            top: 0;
        }

        .table tr:hover {
            background: #f8f9fa;
        }

        .status {
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.875rem;
            font-weight: 500;
            white-space: nowrap;
        }

        .status.pending { background: #fff3cd; color: #856404; }
        .status.assigned { background: #cce5ff; color: #004085; }
        .status.in_progress { background: #d4edda; color: #155724; }
        .status.completed { background: #d1ecf1; color: #0c5460; }
        .status.delivered { background: #c3e6cb; color: #155724; }
        .status.cancelled { background: #f8d7da; color: #721c24; }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-content {
            background: white;
            margin: 5% auto;
            padding: 2rem;
            border-radius: 10px;
            max-width: 500px;
            animation: slideDown 0.3s;
        }

        @keyframes slideDown {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
            margin-bottom: 1.5rem;
        }

        .modal-header h2 {
            color: #2c3e50;
        }

        .close {
            float: right;
            font-size: 1.5rem;
            cursor: pointer;
            color: #7f8c8d;
        }

        .close:hover {
            color: #2c3e50;
        }

        .form-group {
            margin-bottom: 1rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #2c3e50;
        }

        .form-group select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
        }

        .alert {
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .order-actions {
            display: flex;
            gap: 0.5rem;
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>🏢 JD Reporting Company - Order Management</h1>
        <div class="user-info">
            <span>Welcome, <?= htmlspecialchars($_SESSION['username']) ?>!</span>
            <a href="logout.php" class="btn btn-sm">Logout</a>
        </div>
    </header>

    <nav class="nav">
        <ul>
            <li><a href="index.php">Dashboard</a></li>
            <li><a href="orders.php" class="active">Orders</a></li>
            <li><a href="customers.php">Customers</a></li>
            <li><a href="messages.php">Messages</a></li>
            <li><a href="applications.php">Applications</a></li>
            <li><a href="users.php">Users</a></li>
            <li><a href="settings.php">Settings</a></li>
        </ul>
    </nav>

    <div class="container">
        <?php if (isset($_SESSION['message'])): ?>
            <div class="alert alert-success">
                <?= htmlspecialchars($_SESSION['message']) ?>
            </div>
            <?php unset($_SESSION['message']); ?>
        <?php endif; ?>

        <div class="filters">
            <form method="GET" action="orders.php">
                <div class="filter-group">
                    <label>Search</label>
                    <input type="text" name="search" placeholder="Order #, Name, Email..." value="<?= htmlspecialchars($searchQuery) ?>">
                </div>
                <div class="filter-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="">All Statuses</option>
                        <option value="pending" <?= $statusFilter === 'pending' ? 'selected' : '' ?>>Pending</option>
                        <option value="assigned" <?= $statusFilter === 'assigned' ? 'selected' : '' ?>>Assigned</option>
                        <option value="in_progress" <?= $statusFilter === 'in_progress' ? 'selected' : '' ?>>In Progress</option>
                        <option value="completed" <?= $statusFilter === 'completed' ? 'selected' : '' ?>>Completed</option>
                        <option value="delivered" <?= $statusFilter === 'delivered' ? 'selected' : '' ?>>Delivered</option>
                        <option value="cancelled" <?= $statusFilter === 'cancelled' ? 'selected' : '' ?>>Cancelled</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>Service Type</label>
                    <select name="service">
                        <option value="">All Services</option>
                        <option value="legal" <?= $serviceFilter === 'legal' ? 'selected' : '' ?>>Legal</option>
                        <option value="medical" <?= $serviceFilter === 'medical' ? 'selected' : '' ?>>Medical</option>
                        <option value="zoom" <?= $serviceFilter === 'zoom' ? 'selected' : '' ?>>Zoom</option>
                        <option value="academic" <?= $serviceFilter === 'academic' ? 'selected' : '' ?>>Academic</option>
                    </select>
                </div>
                <button type="submit" class="btn">Filter</button>
                <a href="orders.php" class="btn btn-warning">Clear</a>
            </form>
        </div>

        <div class="card">
            <div class="card-header">
                <span>All Orders (<?= count($orders) ?>)</span>
                <button class="btn btn-sm" onclick="refreshOrders()">🔄 Refresh</button>
            </div>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Client</th>
                            <th>Service</th>
                            <th>Turnaround</th>
                            <th>Status</th>
                            <th>Assigned To</th>
                            <th>Cost</th>
                            <th>Deadline</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="ordersTable">
                        <?php foreach ($orders as $order): ?>
                            <tr>
                                <td><strong><?= htmlspecialchars($order['order_number']) ?></strong></td>
                                <td>
                                    <?= htmlspecialchars($order['client_name']) ?><br>
                                    <small style="color: #7f8c8d;"><?= htmlspecialchars($order['client_email']) ?></small>
                                </td>
                                <td><?= ucfirst($order['service_type']) ?></td>
                                <td><?= ucfirst($order['turnaround']) ?></td>
                                <td><span class="status <?= $order['status'] ?>"><?= ucfirst(str_replace('_', ' ', $order['status'])) ?></span></td>
                                <td>
                                    <?php if ($order['assigned_to']): ?>
                                        <?= htmlspecialchars($order['transcriber_first_name'] . ' ' . $order['transcriber_last_name']) ?>
                                    <?php else: ?>
                                        <em style="color: #7f8c8d;">Unassigned</em>
                                    <?php endif; ?>
                                </td>
                                <td>$<?= number_format($order['estimated_cost'], 2) ?></td>
                                <td><?= $order['deadline'] ? date('M j, Y H:i', strtotime($order['deadline'])) : '-' ?></td>
                                <td><?= date('M j, Y', strtotime($order['created_at'])) ?></td>
                                <td>
                                    <div class="order-actions">
                                        <button class="btn btn-sm" onclick="viewOrder(<?= $order['id'] ?>)">👁️ View</button>
                                        <?php if ($order['status'] === 'pending'): ?>
                                            <button class="btn btn-sm btn-success" onclick="assignOrder(<?= $order['id'] ?>)">👤 Assign</button>
                                        <?php endif; ?>
                                        <button class="btn btn-sm btn-warning" onclick="updateStatus(<?= $order['id'] ?>, '<?= $order['status'] ?>')">📝 Update</button>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Assign Order Modal -->
    <div id="assignModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <span class="close" onclick="closeModal('assignModal')">&times;</span>
                <h2>Assign Order</h2>
            </div>
            <form method="POST" action="orders.php">
                <input type="hidden" name="action" value="assign">
                <input type="hidden" name="order_id" id="assign_order_id">
                <div class="form-group">
                    <label>Select Transcriber</label>
                    <select name="transcriber_id" required>
                        <option value="">-- Choose a transcriber --</option>
                        <?php foreach ($transcribers as $transcriber): ?>
                            <option value="<?= $transcriber['id'] ?>">
                                <?= htmlspecialchars($transcriber['first_name'] . ' ' . $transcriber['last_name']) ?> (<?= htmlspecialchars($transcriber['email']) ?>)
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <button type="submit" class="btn btn-success">Assign Order</button>
            </form>
        </div>
    </div>

    <!-- Update Status Modal -->
    <div id="statusModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <span class="close" onclick="closeModal('statusModal')">&times;</span>
                <h2>Update Order Status</h2>
            </div>
            <form method="POST" action="orders.php">
                <input type="hidden" name="action" value="update_status">
                <input type="hidden" name="order_id" id="status_order_id">
                <div class="form-group">
                    <label>New Status</label>
                    <select name="status" id="new_status" required>
                        <option value="pending">Pending</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-success">Update Status</button>
            </form>
        </div>
    </div>

    <script>
        function assignOrder(orderId) {
            document.getElementById('assign_order_id').value = orderId;
            document.getElementById('assignModal').style.display = 'block';
        }

        function updateStatus(orderId, currentStatus) {
            document.getElementById('status_order_id').value = orderId;
            document.getElementById('new_status').value = currentStatus;
            document.getElementById('statusModal').style.display = 'block';
        }

        function viewOrder(orderId) {
            window.location.href = 'order_details.php?id=' + orderId;
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        function refreshOrders() {
            location.reload();
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        }

        // Auto-refresh every 60 seconds
        setInterval(refreshOrders, 60000);

        // Add notification sound for new orders
        let lastOrderCount = <?= count($orders) ?>;

        function checkNewOrders() {
            fetch('orders.php?ajax=1')
                .then(response => response.json())
                .then(data => {
                    if (data.count > lastOrderCount) {
                        playNotificationSound();
                        showNotification('New order received!');
                        lastOrderCount = data.count;
                    }
                })
                .catch(err => console.error('Error checking orders:', err));
        }

        function playNotificationSound() {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjWO1fHJdiwFKH/L8NuQPwoVXLLo7adWEwlOo+DzsWMWCj2V2PbLeSME');
            audio.play();
        }

        function showNotification(message) {
            if (Notification.permission === 'granted') {
                new Notification('JD Reporting', {
                    body: message,
                    icon: '/images/logo.png'
                });
            }
        }

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Check for new orders every 30 seconds
        setInterval(checkNewOrders, 30000);
    </script>
</body>
</html>
