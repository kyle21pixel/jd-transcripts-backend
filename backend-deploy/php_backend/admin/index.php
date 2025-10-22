<?php
session_start();
require_once '../config/database.php';

// Check if user is logged in and is admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header('Location: login.php');
    exit();
}

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

// Get recent orders
$recent_orders = $db->fetchAll(
    "SELECT o.*, c.first_name, c.last_name, c.email, u.full_name as assigned_name 
     FROM orders o 
     JOIN customers c ON o.customer_id = c.id 
     LEFT JOIN users u ON o.assigned_to = u.id 
     ORDER BY o.created_at DESC LIMIT 10"
);

// Get new contact messages
$new_messages = $db->fetchAll(
    "SELECT * FROM contact_messages WHERE status = 'new' ORDER BY created_at DESC LIMIT 5"
);

// Get pending applications
$pending_applications = $db->fetchAll(
    "SELECT * FROM job_applications WHERE status = 'pending' ORDER BY created_at DESC LIMIT 5"
);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - JD Reporting Company</title>
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
            max-width: 1200px;
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
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(52, 152, 219, 0.1), transparent);
            transition: left 0.5s;
        }

        .stat-card:hover::before {
            left: 100%;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(52, 152, 219, 0.3);
        }

        .stat-card h3 {
            color: #2c3e50;
            font-size: 2rem;
            margin-bottom: 0.5rem;
            animation: countUp 0.5s ease-out;
        }

        .stat-card p {
            color: #7f8c8d;
            font-weight: 500;
        }

        @keyframes countUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .stat-card.has-update {
            animation: pulse 1s infinite;
        }

        .new-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #e74c3c;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: bold;
            animation: bounce 1s infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }

        .content-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
        }

        .card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .card:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .card-header {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 1rem 1.5rem;
            font-weight: 600;
            position: relative;
            overflow: hidden;
        }

        .card-header::after {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .card-content {
            padding: 1.5rem;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
        }

        .table tr:hover {
            background: #f8f9fa;
            transform: scale(1.01);
            transition: all 0.2s ease;
        }

        .table tr {
            transition: all 0.2s ease;
        }

        .table th {
            background: #f8f9fa;
            font-weight: 600;
        }

        .status {
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .status.pending { background: #fff3cd; color: #856404; }
        .status.assigned { background: #cce5ff; color: #004085; }
        .status.in_progress { background: #d4edda; color: #155724; }
        .status.completed { background: #d1ecf1; color: #0c5460; }
        .status.new { background: #f8d7da; color: #721c24; }

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
            transition: background 0.3s;
        }

        .btn:hover {
            background: #2980b9;
        }

        .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
        }

        .btn-success { background: #27ae60; }
        .btn-success:hover { background: #229954; }

        .btn-danger { background: #e74c3c; }
        .btn-danger:hover { background: #c0392b; }

        .alert {
            padding: 0.75rem 1rem;
            margin: 1rem 0;
            border-radius: 5px;
        }

        .alert-info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }

        @media (max-width: 768px) {
            .content-grid {
                grid-template-columns: 1fr;
            }
            
            .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>🏢 JD Reporting Company - Admin Dashboard</h1>
        <div class="user-info">
            <span>Welcome, <?= htmlspecialchars($_SESSION['username']) ?>!</span>
            <a href="logout.php" class="btn btn-sm">Logout</a>
        </div>
    </header>

    <nav class="nav">
        <ul>
            <li><a href="index.php" class="active">Dashboard</a></li>
            <li><a href="orders.php">Orders</a></li>
            <li><a href="customers.php">Customers</a></li>
            <li><a href="messages.php">Messages</a></li>
            <li><a href="applications.php">Applications</a></li>
            <li><a href="users.php">Users</a></li>
            <li><a href="settings.php">Settings</a></li>
        </ul>
    </nav>

    <div class="container">
        <div class="stats-grid">
            <div class="stat-card">
                <h3 id="total_orders"><?= $stats['total_orders'] ?></h3>
                <p>Total Orders</p>
            </div>
            <div class="stat-card">
                <h3 id="pending_orders"><?= $stats['pending_orders'] ?></h3>
                <p>Pending Orders</p>
            </div>
            <div class="stat-card">
                <h3 id="active_orders"><?= $stats['active_orders'] ?></h3>
                <p>Active Orders</p>
            </div>
            <div class="stat-card">
                <h3 id="completed_orders"><?= $stats['completed_orders'] ?></h3>
                <p>Completed Orders</p>
            </div>
            <div class="stat-card">
                <h3 id="new_messages"><?= $stats['new_messages'] ?></h3>
                <p>New Messages</p>
            </div>
            <div class="stat-card">
                <h3 id="pending_applications"><?= $stats['pending_applications'] ?></h3>
                <p>Job Applications</p>
            </div>
            <div class="stat-card">
                <h3 id="total_customers"><?= $stats['total_customers'] ?></h3>
                <p>Total Customers</p>
            </div>
            <div class="stat-card">
                <h3 id="active_transcribers"><?= $stats['active_transcribers'] ?></h3>
                <p>Active Transcribers</p>
            </div>
        </div>

        <div class="content-grid">
            <div class="card">
                <div class="card-header">Recent Orders</div>
                <div class="card-content">
                    <?php if (empty($recent_orders)): ?>
                        <div class="alert alert-info">No orders found.</div>
                    <?php else: ?>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Service</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($recent_orders as $order): ?>
                                    <tr>
                                        <td><?= htmlspecialchars($order['order_id']) ?></td>
                                        <td><?= htmlspecialchars($order['first_name'] . ' ' . $order['last_name']) ?></td>
                                        <td><?= ucfirst($order['service_type']) ?></td>
                                        <td><span class="status <?= $order['status'] ?>"><?= ucfirst(str_replace('_', ' ', $order['status'])) ?></span></td>
                                        <td>$<?= number_format($order['total_amount'], 2) ?></td>
                                        <td><?= date('M j, Y', strtotime($order['created_at'])) ?></td>
                                        <td>
                                            <a href="order_details.php?id=<?= $order['id'] ?>" class="btn btn-sm">View</a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php endif; ?>
                </div>
            </div>

            <div>
                <div class="card" style="margin-bottom: 1rem;">
                    <div class="card-header">New Contact Messages</div>
                    <div class="card-content">
                        <?php if (empty($new_messages)): ?>
                            <div class="alert alert-info">No new messages.</div>
                        <?php else: ?>
                            <?php foreach ($new_messages as $message): ?>
                                <div style="padding: 0.75rem 0; border-bottom: 1px solid #ecf0f1;">
                                    <div style="font-weight: 600;"><?= htmlspecialchars($message['name'] ?: 'Anonymous') ?></div>
                                    <div style="font-size: 0.875rem; color: #7f8c8d;"><?= htmlspecialchars($message['email']) ?></div>
                                    <div style="margin: 0.5rem 0; font-size: 0.875rem;"><?= htmlspecialchars(substr($message['message'], 0, 100)) ?>...</div>
                                    <a href="message_details.php?id=<?= $message['id'] ?>" class="btn btn-sm">Reply</a>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">Pending Applications</div>
                    <div class="card-content">
                        <?php if (empty($pending_applications)): ?>
                            <div class="alert alert-info">No pending applications.</div>
                        <?php else: ?>
                            <?php foreach ($pending_applications as $app): ?>
                                <div style="padding: 0.75rem 0; border-bottom: 1px solid #ecf0f1;">
                                    <div style="font-weight: 600;"><?= htmlspecialchars($app['first_name'] . ' ' . $app['last_name']) ?></div>
                                    <div style="font-size: 0.875rem; color: #7f8c8d;"><?= htmlspecialchars($app['position']) ?></div>
                                    <div style="font-size: 0.875rem; color: #7f8c8d;"><?= htmlspecialchars($app['email']) ?></div>
                                    <div style="margin-top: 0.5rem;">
                                        <a href="application_details.php?id=<?= $app['id'] ?>" class="btn btn-sm">Review</a>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Real-time dashboard updates with animations
        let lastOrderCount = <?= $stats['total_orders'] ?>;
        let lastPendingCount = <?= $stats['pending_orders'] ?>;

        // Auto-refresh dashboard every 30 seconds
        setInterval(() => {
            fetchDashboardUpdates();
        }, 30000);

        // Fetch dashboard updates via AJAX
        function fetchDashboardUpdates() {
            fetch('api/dashboard_stats.php')
                .then(response => response.json())
                .then(data => {
                    updateStats(data);
                })
                .catch(err => console.error('Error fetching updates:', err));
        }

        // Update statistics with animation
        function updateStats(newStats) {
            const statsMap = {
                'total_orders': newStats.total_orders,
                'pending_orders': newStats.pending_orders,
                'active_orders': newStats.active_orders,
                'completed_orders': newStats.completed_orders,
                'new_messages': newStats.new_messages,
                'pending_applications': newStats.pending_applications
            };

            Object.keys(statsMap).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    const oldValue = parseInt(element.textContent);
                    const newValue = statsMap[key];
                    
                    if (oldValue !== newValue) {
                        animateNumber(element, oldValue, newValue);
                        
                        // Add pulsing effect for updates
                        const card = element.closest('.stat-card');
                        card.classList.add('has-update');
                        setTimeout(() => card.classList.remove('has-update'), 2000);
                        
                        // Show notification badge for new items
                        if (newValue > oldValue && (key === 'pending_orders' || key === 'new_messages')) {
                            showNewBadge(card, newValue - oldValue);
                        }
                    }
                }
            });

            // Check for new orders
            if (newStats.pending_orders > lastPendingCount) {
                showNotification('New Order!', `You have ${newStats.pending_orders - lastPendingCount} new order(s) pending`);
                playNotificationSound();
            }

            lastOrderCount = newStats.total_orders;
            lastPendingCount = newStats.pending_orders;
        }

        // Animate number changes
        function animateNumber(element, start, end) {
            const duration = 500;
            const range = end - start;
            const increment = range / (duration / 16);
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                    current = end;
                    clearInterval(timer);
                }
                element.textContent = Math.round(current);
            }, 16);
        }

        // Show new item badge
        function showNewBadge(card, count) {
            const badge = document.createElement('div');
            badge.className = 'new-badge';
            badge.textContent = `+${count}`;
            card.appendChild(badge);
            
            setTimeout(() => {
                badge.style.animation = 'fadeOut 0.5s';
                setTimeout(() => badge.remove(), 500);
            }, 3000);
        }

        // Show browser notification
        function showNotification(title, message) {
            if ('Notification' in window) {
                if (Notification.permission === 'granted') {
                    new Notification(title, {
                        body: message,
                        icon: '/images/logo.png',
                        badge: '/images/badge.png'
                    });
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification(title, { body: message });
                        }
                    });
                }
            }
        }

        // Play notification sound
        function playNotificationSound() {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjWO1fHJdiwFKH/L8NuQPwoVXLLo7adWEwlOo+DzsWMWCj2V2PbLeSME');
            audio.volume = 0.3;
            audio.play().catch(err => console.log('Audio play prevented:', err));
        }

        // Add click handlers for quick actions
        document.addEventListener('DOMContentLoaded', function() {
            // Make stat cards clickable
            document.querySelectorAll('.stat-card').forEach(card => {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function() {
                    const text = this.querySelector('p').textContent;
                    if (text.includes('Orders')) {
                        window.location.href = 'orders.php';
                    } else if (text.includes('Messages')) {
                        window.location.href = 'messages.php';
                    } else if (text.includes('Applications')) {
                        window.location.href = 'applications.php';
                    } else if (text.includes('Customers')) {
                        window.location.href = 'customers.php';
                    } else if (text.includes('Transcribers')) {
                        window.location.href = 'users.php?role=transcriber';
                    }
                });
            });

            // Request notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }

            console.log('JD Reporting Admin Dashboard loaded successfully!');
        });

        // Add fade-out animation for fadeOut
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    </script>
</body>
</html>