<?php
/**
 * WordPress Admin Dashboard Template for Order Management
 * Manager can view, assign, and distribute orders to transcribers
 */
?>

<div class="wrap jd-admin-dashboard">
    <h1 class="wp-heading-inline">📋 JD Transcripts - Order Management</h1>
    
    <style>
    .jd-admin-dashboard {
        background: #f8fafc;
        margin: 0 -20px;
        padding: 20px;
        min-height: calc(100vh - 32px);
    }
    
    .jd-dashboard-header {
        background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
        color: white;
        padding: 30px;
        border-radius: 15px;
        margin-bottom: 30px;
        box-shadow: 0 10px 30px rgba(26, 54, 93, 0.2);
    }
    
    .jd-dashboard-title {
        font-size: 2rem;
        margin: 0 0 10px 0;
        font-weight: 700;
    }
    
    .jd-dashboard-subtitle {
        opacity: 0.9;
        font-size: 1.1rem;
        margin: 0;
    }
    
    .jd-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    
    .jd-stat-card {
        background: white;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        border: 1px solid #e2e8f0;
        text-align: center;
        transition: transform 0.3s ease;
    }
    
    .jd-stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
    
    .jd-stat-icon {
        font-size: 2.5rem;
        margin-bottom: 15px;
    }
    
    .jd-stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: #1a365d;
        margin-bottom: 5px;
    }
    
    .jd-stat-label {
        color: #4a5568;
        font-weight: 500;
    }
    
    .jd-orders-section {
        background: white;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        border: 1px solid #e2e8f0;
        overflow: hidden;
    }
    
    .jd-section-header {
        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        padding: 20px 30px;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .jd-section-title {
        font-size: 1.4rem;
        font-weight: 700;
        color: #1a365d;
        margin: 0;
    }
    
    .jd-orders-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .jd-orders-table th {
        background: #f7fafc;
        padding: 15px 20px;
        text-align: left;
        font-weight: 600;
        color: #2d3748;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .jd-orders-table td {
        padding: 15px 20px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
    }
    
    .jd-orders-table tr:hover {
        background: #f7fafc;
    }
    
    .jd-status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .jd-status-pending {
        background: #fed7d7;
        color: #c53030;
    }
    
    .jd-status-assigned {
        background: #bee3f8;
        color: #2b6cb0;
    }
    
    .jd-status-in-progress {
        background: #faf089;
        color: #975a16;
    }
    
    .jd-status-completed {
        background: #c6f6d5;
        color: #276749;
    }
    
    .jd-assign-btn {
        background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .jd-assign-btn:hover {
        background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
        transform: translateY(-1px);
    }
    
    .jd-modal {
        display: none;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(5px);
    }
    
    .jd-modal-content {
        background: white;
        margin: 5% auto;
        padding: 30px;
        border-radius: 15px;
        width: 90%;
        max-width: 600px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        position: relative;
    }
    
    .jd-modal-header {
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .jd-modal-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1a365d;
        margin: 0;
    }
    
    .jd-close {
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        color: #a0aec0;
        transition: color 0.3s ease;
    }
    
    .jd-close:hover {
        color: #e53e3e;
    }
    
    .jd-form-group {
        margin-bottom: 20px;
    }
    
    .jd-form-label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #2d3748;
    }
    
    .jd-form-input,
    .jd-form-select,
    .jd-form-textarea {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
        box-sizing: border-box;
    }
    
    .jd-form-input:focus,
    .jd-form-select:focus,
    .jd-form-textarea:focus {
        outline: none;
        border-color: #1a365d;
    }
    
    .jd-submit-btn {
        background: linear-gradient(135deg, #d69e2e 0%, #b7791f 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .jd-submit-btn:hover {
        background: linear-gradient(135deg, #b7791f 0%, #975a16 100%);
        transform: translateY(-1px);
    }
    
    .jd-transcriber-info {
        background: #f7fafc;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        border: 1px solid #e2e8f0;
    }
    
    .jd-workload-indicator {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-left: 10px;
    }
    
    .jd-workload-low {
        background: #c6f6d5;
        color: #276749;
    }
    
    .jd-workload-medium {
        background: #faf089;
        color: #975a16;
    }
    
    .jd-workload-high {
        background: #fed7d7;
        color: #c53030;
    }
    </style>

    <!-- Dashboard Header -->
    <div class="jd-dashboard-header">
        <h1 class="jd-dashboard-title">🎯 Order Management Dashboard</h1>
        <p class="jd-dashboard-subtitle">Manage and distribute transcription orders to your team</p>
    </div>

    <!-- Statistics Cards -->
    <div class="jd-stats-grid">
        <div class="jd-stat-card">
            <div class="jd-stat-icon">📋</div>
            <div class="jd-stat-number"><?php echo $pending_orders; ?></div>
            <div class="jd-stat-label">Pending Orders</div>
        </div>
        <div class="jd-stat-card">
            <div class="jd-stat-icon">⚡</div>
            <div class="jd-stat-number"><?php echo $active_orders; ?></div>
            <div class="jd-stat-label">In Progress</div>
        </div>
        <div class="jd-stat-card">
            <div class="jd-stat-icon">✅</div>
            <div class="jd-stat-number"><?php echo $completed_today; ?></div>
            <div class="jd-stat-label">Completed Today</div>
        </div>
        <div class="jd-stat-card">
            <div class="jd-stat-icon">👥</div>
            <div class="jd-stat-number"><?php echo count($transcribers); ?></div>
            <div class="jd-stat-label">Active Transcribers</div>
        </div>
    </div>

    <!-- Orders Table -->
    <div class="jd-orders-section">
        <div class="jd-section-header">
            <h2 class="jd-section-title">📝 Recent Orders</h2>
        </div>
        
        <table class="jd-orders-table">
            <thead>
                <tr>
                    <th>Order #</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Turnaround</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($orders as $order): ?>
                <tr>
                    <td><strong><?php echo esc_html($order->order_number); ?></strong></td>
                    <td>
                        <div><?php echo esc_html($order->client_name); ?></div>
                        <small style="color: #718096;"><?php echo esc_html($order->client_email); ?></small>
                    </td>
                    <td><?php echo esc_html(ucfirst($order->service_type)); ?></td>
                    <td><?php echo esc_html($order->turnaround); ?></td>
                    <td>
                        <span class="jd-status-badge jd-status-<?php echo esc_attr($order->status); ?>">
                            <?php echo esc_html(ucfirst($order->status)); ?>
                        </span>
                    </td>
                    <td>
                        <?php if ($order->transcriber_name): ?>
                            <strong><?php echo esc_html($order->transcriber_name); ?></strong>
                        <?php else: ?>
                            <em style="color: #a0aec0;">Unassigned</em>
                        <?php endif; ?>
                    </td>
                    <td><?php echo date('M j, Y g:i A', strtotime($order->created_at)); ?></td>
                    <td>
                        <?php if ($order->status === 'pending'): ?>
                            <button class="jd-assign-btn" onclick="openAssignModal(<?php echo $order->id; ?>, '<?php echo esc_js($order->order_number); ?>')">
                                👤 Assign
                            </button>
                        <?php else: ?>
                            <button class="jd-assign-btn" onclick="viewOrderDetails(<?php echo $order->id; ?>)">
                                👁️ View
                            </button>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Assignment Modal -->
<div id="assignModal" class="jd-modal">
    <div class="jd-modal-content">
        <span class="jd-close" onclick="closeAssignModal()">&times;</span>
        <div class="jd-modal-header">
            <h2 class="jd-modal-title">👤 Assign Order to Transcriber</h2>
        </div>
        
        <form id="assignOrderForm" method="post">
            <input type="hidden" id="assign_order_id" name="order_id">
            
            <div class="jd-form-group">
                <label class="jd-form-label">Order Number:</label>
                <div id="assign_order_number" style="font-weight: bold; color: #1a365d; font-size: 1.1rem;"></div>
            </div>
            
            <div class="jd-form-group">
                <label for="transcriber_id" class="jd-form-label">Select Transcriber:</label>
                <select id="transcriber_id" name="transcriber_id" class="jd-form-select" required>
                    <option value="">Choose a transcriber...</option>
                    <?php foreach ($transcribers as $transcriber): 
                        $workload_class = $transcriber->workload < 3 ? 'low' : ($transcriber->workload < 6 ? 'medium' : 'high');
                    ?>
                        <option value="<?php echo $transcriber->id; ?>">
                            <?php echo esc_html($transcriber->name); ?> 
                            (<?php echo esc_html($transcriber->specialization); ?>) 
                            - Workload: <?php echo $transcriber->workload; ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            
            <div class="jd-form-group">
                <label for="deadline" class="jd-form-label">Deadline:</label>
                <input type="datetime-local" id="deadline" name="deadline" class="jd-form-input" required>
            </div>
            
            <div class="jd-form-group">
                <label for="assignment_notes" class="jd-form-label">Assignment Notes:</label>
                <textarea id="assignment_notes" name="assignment_notes" class="jd-form-textarea" rows="3" placeholder="Special instructions for the transcriber..."></textarea>
            </div>
            
            <button type="submit" name="assign_order" class="jd-submit-btn">
                🚀 Assign Order
            </button>
        </form>
    </div>
</div>

<script>
function openAssignModal(orderId, orderNumber) {
    document.getElementById('assign_order_id').value = orderId;
    document.getElementById('assign_order_number').textContent = orderNumber;
    
    // Set default deadline (24 hours from now)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('deadline').value = tomorrow.toISOString().slice(0, 16);
    
    document.getElementById('assignModal').style.display = 'block';
}

function closeAssignModal() {
    document.getElementById('assignModal').style.display = 'none';
}

function viewOrderDetails(orderId) {
    // Implement order details view
    alert('Order details view - Order ID: ' + orderId);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('assignModal');
    if (event.target === modal) {
        closeAssignModal();
    }
}

// Auto-refresh every 30 seconds
setInterval(function() {
    location.reload();
}, 30000);
</script>