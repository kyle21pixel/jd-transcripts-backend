<?php
/*
Template Name: Admin Dashboard
*/

// Check if user has admin capabilities
if (!current_user_can('manage_options')) {
    wp_redirect(wp_login_url());
    exit;
}

get_header(); ?>

<style>
/* Admin Dashboard Styles */
.admin-dashboard {
    min-height: 100vh;
    padding: 120px 0 50px;
    background: var(--bg-primary);
}

.admin-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
}

.admin-header {
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    border-radius: var(--border-radius);
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid var(--border-color);
    text-align: center;
}

.admin-title {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    background: var(--gradient-gold);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.admin-subtitle {
    color: var(--text-secondary);
    font-size: 1.2rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.stat-card {
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    border-radius: var(--border-radius);
    padding: 2rem;
    border: 1px solid var(--border-color);
    text-align: center;
    transition: var(--transition-fast);
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-dark);
}

.stat-icon {
    width: 60px;
    height: 60px;
    background: var(--gradient-accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    font-size: 1.5rem;
    color: white;
}

.stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--gold-color);
    margin-bottom: 0.5rem;
}

.stat-label {
    color: var(--text-secondary);
    font-weight: 500;
}

.orders-section {
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    border-radius: var(--border-radius);
    padding: 2rem;
    border: 1px solid var(--border-color);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.orders-grid {
    display: grid;
    gap: 1.5rem;
}

.order-card {
    background: var(--bg-secondary);
    border-radius: var(--border-radius-small);
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    transition: var(--transition-fast);
}

.order-card:hover {
    background: var(--bg-card);
    transform: translateY(-2px);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.order-id {
    font-weight: 700;
    color: var(--gold-color);
}

.order-status {
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-pending {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border: 1px solid rgba(255, 193, 7, 0.3);
}

.status-processing {
    background: rgba(0, 123, 255, 0.2);
    color: #007bff;
    border: 1px solid rgba(0, 123, 255, 0.3);
}

.status-completed {
    background: rgba(40, 167, 69, 0.2);
    color: #28a745;
    border: 1px solid rgba(40, 167, 69, 0.3);
}

.order-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
}

.order-detail {
    display: flex;
    flex-direction: column;
}

.detail-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.3rem;
}

.detail-value {
    color: var(--text-primary);
    font-weight: 500;
}

.order-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.btn-small {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    border-radius: var(--border-radius-small);
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-secondary);
}

.empty-state i {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: var(--text-muted);
}

@media (max-width: 768px) {
    .admin-title {
        font-size: 2rem;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .section-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }
    
    .order-details {
        grid-template-columns: 1fr;
    }
    
    .order-actions {
        justify-content: center;
    }
}
</style>

<div class="admin-dashboard">
    <div class="admin-container">
        <div class="admin-header">
            <h1 class="admin-title">Executive Dashboard</h1>
            <p class="admin-subtitle">JD Legal Transcripts - Order Management System</p>
        </div>
        
        <?php
        // Get orders data
        $orders = get_posts(array(
            'post_type' => 'jd_order',
            'posts_per_page' => -1,
            'post_status' => 'publish'
        ));
        
        $total_orders = count($orders);
        $pending_orders = 0;
        $processing_orders = 0;
        $completed_orders = 0;
        $total_revenue = 0;
        
        foreach ($orders as $order) {
            $status = get_post_meta($order->ID, 'order_status', true);
            $price = floatval(get_post_meta($order->ID, 'total_price', true));
            
            switch ($status) {
                case 'pending':
                    $pending_orders++;
                    break;
                case 'processing':
                    $processing_orders++;
                    break;
                case 'completed':
                    $completed_orders++;
                    break;
            }
            $total_revenue += $price;
        }
        ?>
        
        <!-- Statistics -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <div class="stat-value"><?php echo $total_orders; ?></div>
                <div class="stat-label">Total Orders</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-value"><?php echo $pending_orders; ?></div>
                <div class="stat-label">Pending Orders</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-cog"></i>
                </div>
                <div class="stat-value"><?php echo $processing_orders; ?></div>
                <div class="stat-label">Processing</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stat-value">$<?php echo number_format($total_revenue, 2); ?></div>
                <div class="stat-label">Total Revenue</div>
            </div>
        </div>
        
        <!-- Orders Section -->
        <div class="orders-section">
            <div class="section-header">
                <h2>Recent Orders</h2>
                <div>
                    <a href="<?php echo admin_url('edit.php?post_type=jd_order'); ?>" class="btn btn-secondary btn-small">
                        <i class="fas fa-cog"></i> Manage Orders
                    </a>
                    <button onclick="exportOrders()" class="btn btn-gold btn-small">
                        <i class="fas fa-download"></i> Export Data
                    </button>
                </div>
            </div>
            
            <div class="orders-grid">
                <?php if (empty($orders)) : ?>
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No Orders Yet</h3>
                        <p>Orders will appear here when customers submit them through the website.</p>
                    </div>
                <?php else : ?>
                    <?php foreach (array_slice($orders, 0, 10) as $order) : 
                        $customer_name = get_post_meta($order->ID, 'customer_name', true);
                        $customer_email = get_post_meta($order->ID, 'customer_email', true);
                        $service_type = get_post_meta($order->ID, 'service_type', true);
                        $duration = get_post_meta($order->ID, 'duration_minutes', true);
                        $turnaround = get_post_meta($order->ID, 'turnaround_time', true);
                        $payment_method = get_post_meta($order->ID, 'payment_method', true);
                        $total_price = get_post_meta($order->ID, 'total_price', true);
                        $order_status = get_post_meta($order->ID, 'order_status', true);
                        $mpesa_phone = get_post_meta($order->ID, 'mpesa_phone', true);
                    ?>
                        <div class="order-card">
                            <div class="order-header">
                                <div class="order-id">JD-<?php echo $order->ID; ?></div>
                                <div class="order-status status-<?php echo $order_status; ?>">
                                    <?php echo ucfirst($order_status); ?>
                                </div>
                            </div>
                            
                            <div class="order-details">
                                <div class="order-detail">
                                    <div class="detail-label">Customer</div>
                                    <div class="detail-value"><?php echo $customer_name; ?></div>
                                </div>
                                <div class="order-detail">
                                    <div class="detail-label">Email</div>
                                    <div class="detail-value"><?php echo $customer_email; ?></div>
                                </div>
                                <div class="order-detail">
                                    <div class="detail-label">Service</div>
                                    <div class="detail-value"><?php echo ucfirst($service_type); ?> Transcription</div>
                                </div>
                                <div class="order-detail">
                                    <div class="detail-label">Duration</div>
                                    <div class="detail-value"><?php echo $duration; ?> minutes</div>
                                </div>
                                <div class="order-detail">
                                    <div class="detail-label">Turnaround</div>
                                    <div class="detail-value"><?php echo ucfirst(str_replace('-', ' ', $turnaround)); ?></div>
                                </div>
                                <div class="order-detail">
                                    <div class="detail-label">Payment</div>
                                    <div class="detail-value">
                                        <?php echo $payment_method === 'mpesa' ? '📱 M-Pesa' : '📄 Invoice'; ?>
                                        <?php if ($payment_method === 'mpesa' && $mpesa_phone) : ?>
                                            <br><small><?php echo $mpesa_phone; ?></small>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                <div class="order-detail">
                                    <div class="detail-label">Total Price</div>
                                    <div class="detail-value" style="color: var(--gold-color); font-weight: 700;">$<?php echo $total_price; ?></div>
                                </div>
                                <div class="order-detail">
                                    <div class="detail-label">Date</div>
                                    <div class="detail-value"><?php echo get_the_date('M j, Y g:i A', $order->ID); ?></div>
                                </div>
                            </div>
                            
                            <?php if (!empty($order->post_content)) : ?>
                                <div style="margin: 1rem 0; padding: 1rem; background: var(--bg-card); border-radius: var(--border-radius-small); border: 1px solid var(--border-color);">
                                    <div class="detail-label">Notes</div>
                                    <div class="detail-value"><?php echo nl2br(esc_html($order->post_content)); ?></div>
                                </div>
                            <?php endif; ?>
                            
                            <div class="order-actions">
                                <button onclick="updateOrderStatus(<?php echo $order->ID; ?>, 'processing')" class="btn btn-primary btn-small">
                                    <i class="fas fa-play"></i> Start Processing
                                </button>
                                <button onclick="updateOrderStatus(<?php echo $order->ID; ?>, 'completed')" class="btn btn-secondary btn-small">
                                    <i class="fas fa-check"></i> Mark Complete
                                </button>
                                <a href="mailto:<?php echo $customer_email; ?>" class="btn btn-gold btn-small">
                                    <i class="fas fa-envelope"></i> Email Customer
                                </a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<script>
// Update order status
function updateOrderStatus(orderId, newStatus) {
    if (confirm('Are you sure you want to update this order status?')) {
        // Use WordPress AJAX
        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'update_order_status',
                order_id: orderId,
                status: newStatus,
                nonce: '<?php echo wp_create_nonce('jd_transcripts_nonce'); ?>'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Order status updated successfully!');
                location.reload();
            } else {
                alert('Failed to update order status.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the order status.');
        });
    }
}

// Export orders
function exportOrders() {
    const orders = <?php echo json_encode(array_map(function($order) {
        return array(
            'id' => 'JD-' . $order->ID,
            'customer_name' => get_post_meta($order->ID, 'customer_name', true),
            'customer_email' => get_post_meta($order->ID, 'customer_email', true),
            'service_type' => get_post_meta($order->ID, 'service_type', true),
            'duration_minutes' => get_post_meta($order->ID, 'duration_minutes', true),
            'turnaround_time' => get_post_meta($order->ID, 'turnaround_time', true),
            'payment_method' => get_post_meta($order->ID, 'payment_method', true),
            'total_price' => get_post_meta($order->ID, 'total_price', true),
            'order_status' => get_post_meta($order->ID, 'order_status', true),
            'order_date' => get_the_date('Y-m-d H:i:s', $order->ID),
            'notes' => $order->post_content
        );
    }, $orders)); ?>;
    
    const dataStr = JSON.stringify(orders, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jd-transcripts-orders-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Auto-refresh every 30 seconds
setInterval(() => {
    location.reload();
}, 30000);
</script>

<?php get_footer(); ?>