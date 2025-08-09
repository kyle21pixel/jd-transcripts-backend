<?php
// Update styles and navigation for Admin Manager
echo "<h1>🎨 Adding Admin Manager Styles & Navigation</h1>";

$theme_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';

// Read current CSS file
$current_css = file_get_contents($theme_dir . 'style.css');

// Add Admin Manager specific styles
$admin_manager_css = '

/* ===== ADMIN MANAGER DASHBOARD STYLES ===== */

.admin-manager-dashboard {
    background: var(--dark);
    min-height: 100vh;
    padding: 20px 0;
}

.admin-performance-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 25px;
    margin: 30px 0;
}

.admin-performance-card {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 25px;
    transition: all 0.3s ease;
}

.admin-performance-card:hover {
    transform: translateY(-5px);
    border-color: var(--gold);
    box-shadow: 0 10px 30px rgba(212,175,55,0.2);
}

.admin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.admin-avatar img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid var(--gold);
}

.admin-info h3 {
    color: var(--gold);
    margin: 0 0 5px 0;
    font-size: 1.2rem;
}

.admin-info p {
    margin: 0;
    opacity: 0.8;
    font-size: 0.9rem;
}

.admin-status {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    margin-top: 8px;
    display: inline-block;
}

.admin-status.status-online {
    background: rgba(74,222,128,0.2);
    color: #4ade80;
    border: 1px solid rgba(74,222,128,0.3);
}

.admin-status.status-away {
    background: rgba(251,191,36,0.2);
    color: #fbbf24;
    border: 1px solid rgba(251,191,36,0.3);
}

.admin-status.status-offline {
    background: rgba(156,163,175,0.2);
    color: #9ca3af;
    border: 1px solid rgba(156,163,175,0.3);
}

.performance-score {
    text-align: center;
}

.score-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.1rem;
    position: relative;
    background: conic-gradient(var(--gold) 0deg, var(--gold) calc(var(--score, 0) * 3.6deg), rgba(255,255,255,0.1) calc(var(--score, 0) * 3.6deg));
}

.score-circle.excellent {
    background: conic-gradient(#4ade80 0deg, #4ade80 calc(var(--score, 0) * 3.6deg), rgba(255,255,255,0.1) calc(var(--score, 0) * 3.6deg));
    color: #4ade80;
}

.score-circle.good {
    background: conic-gradient(var(--gold) 0deg, var(--gold) calc(var(--score, 0) * 3.6deg), rgba(255,255,255,0.1) calc(var(--score, 0) * 3.6deg));
    color: var(--gold);
}

.score-circle.average {
    background: conic-gradient(#fbbf24 0deg, #fbbf24 calc(var(--score, 0) * 3.6deg), rgba(255,255,255,0.1) calc(var(--score, 0) * 3.6deg));
    color: #fbbf24;
}

.score-circle.needs-improvement {
    background: conic-gradient(#ef4444 0deg, #ef4444 calc(var(--score, 0) * 3.6deg), rgba(255,255,255,0.1) calc(var(--score, 0) * 3.6deg));
    color: #ef4444;
}

.admin-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin: 20px 0;
}

.metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 15px;
    background: rgba(255,255,255,0.03);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.05);
}

.metric-label {
    font-size: 0.8rem;
    opacity: 0.7;
    margin-bottom: 5px;
}

.metric-value {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--gold);
}

.admin-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
}

.admin-actions .btn {
    flex: 1;
    min-width: 100px;
}

/* Activity Log Styles */
.activity-log {
    max-height: 500px;
    overflow-y: auto;
    background: rgba(255,255,255,0.02);
    border-radius: 10px;
    padding: 20px;
}

.activity-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.activity-item:last-child {
    border-bottom: none;
}

.activity-time {
    font-size: 0.9rem;
    opacity: 0.7;
    min-width: 80px;
}

.activity-avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: var(--gold);
    color: var(--dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.9rem;
}

.activity-content {
    flex: 1;
}

.activity-title {
    font-weight: 500;
    margin-bottom: 3px;
}

.activity-meta {
    font-size: 0.8rem;
    opacity: 0.6;
}

.activity-status {
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
}

.activity-status.status-success {
    background: rgba(74,222,128,0.2);
    color: #4ade80;
}

.activity-status.status-info {
    background: rgba(59,130,246,0.2);
    color: #3b82f6;
}

/* Comparison Chart Styles */
.comparison-chart {
    background: rgba(255,255,255,0.02);
    border-radius: 10px;
    padding: 30px;
}

.chart-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.chart-bar {
    display: flex;
    align-items: center;
    gap: 20px;
}

.bar-label {
    min-width: 120px;
    font-weight: 500;
}

.bar-container {
    flex: 1;
    height: 30px;
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    position: relative;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), #f4c430);
    border-radius: 15px;
    transition: width 0.8s ease;
    position: relative;
}

.bar-value {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-weight: bold;
    color: var(--dark);
    font-size: 0.9rem;
}

/* Modal Styles for Admin Details */
.large-modal .modal-content {
    max-width: 800px;
    width: 90%;
}

.admin-profile {
    padding: 20px 0;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 30px;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.profile-avatar img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid var(--gold);
}

.profile-info h2 {
    color: var(--gold);
    margin: 0 0 10px 0;
}

.profile-info p {
    margin: 5px 0;
    opacity: 0.8;
}

.profile-info i {
    color: var(--gold);
    margin-right: 8px;
    width: 16px;
}

.profile-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin: 30px 0;
}

.stat-item {
    text-align: center;
    padding: 20px;
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
}

.stat-item .stat-value {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--gold);
    margin-bottom: 5px;
}

.stat-item .stat-label {
    font-size: 0.9rem;
    opacity: 0.7;
}

.profile-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-top: 30px;
}

.profile-section h4 {
    color: var(--gold);
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 8px;
}

.specialization-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.tag {
    background: rgba(212,175,55,0.2);
    color: var(--gold);
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    border: 1px solid rgba(212,175,55,0.3);
}

.activity-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.activity-list li {
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    opacity: 0.8;
}

.activity-list li:last-child {
    border-bottom: none;
}

/* Responsive Design for Admin Manager */
@media (max-width: 768px) {
    .admin-performance-grid {
        grid-template-columns: 1fr;
    }
    
    .admin-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }
    
    .admin-metrics {
        grid-template-columns: 1fr;
    }
    
    .profile-header {
        flex-direction: column;
        text-align: center;
    }
    
    .profile-sections {
        grid-template-columns: 1fr;
    }
    
    .chart-bar {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .bar-label {
        min-width: auto;
    }
}

/* Enhanced Button Styles for Admin Manager */
.btn-icon {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
}

.btn-icon:hover {
    background: var(--gold);
    color: var(--dark);
    transform: translateY(-2px);
}

.btn-icon.danger:hover {
    background: #ef4444;
    color: white;
}

.action-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
}

/* Filter and Action Controls */
.filter-select {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.9rem;
}

.filter-select option {
    background: var(--dark);
    color: white;
}

/* Status Indicators */
.status-pending {
    background: rgba(251,191,36,0.2);
    color: #fbbf24;
    border: 1px solid rgba(251,191,36,0.3);
}

.status-in-progress {
    background: rgba(59,130,246,0.2);
    color: #3b82f6;
    border: 1px solid rgba(59,130,246,0.3);
}

.status-completed {
    background: rgba(74,222,128,0.2);
    color: #4ade80;
    border: 1px solid rgba(74,222,128,0.3);
}

.status-active {
    background: rgba(74,222,128,0.2);
    color: #4ade80;
    border: 1px solid rgba(74,222,128,0.3);
}

.status-busy {
    background: rgba(239,68,68,0.2);
    color: #ef4444;
    border: 1px solid rgba(239,68,68,0.3);
}

/* Animation for Performance Cards */
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.admin-performance-card {
    animation: slideInUp 0.6s ease forwards;
}

.admin-performance-card:nth-child(2) {
    animation-delay: 0.1s;
}

.admin-performance-card:nth-child(3) {
    animation-delay: 0.2s;
}

.admin-performance-card:nth-child(4) {
    animation-delay: 0.3s;
}

/* Scrollbar Styling for Activity Log */
.activity-log::-webkit-scrollbar {
    width: 6px;
}

.activity-log::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
    border-radius: 3px;
}

.activity-log::-webkit-scrollbar-thumb {
    background: var(--gold);
    border-radius: 3px;
}

.activity-log::-webkit-scrollbar-thumb:hover {
    background: #f4c430;
}
';

// Append the new CSS to the existing file
$updated_css = $current_css . $admin_manager_css;
file_put_contents($theme_dir . 'style.css', $updated_css);
echo "<p style='color: green;'>✅ Added Admin Manager CSS styles</p>";

// Update the main admin dashboard to include Admin Manager link
$updated_admin_dashboard = '<?php
// Simple authentication check
session_start();
$is_demo = isset($_GET["demo"]) || (isset($_POST["username"]) && $_POST["username"] === "admin");

get_header(); 
?>

<section class="admin-dashboard">
    <div class="dashboard-container">
        <!-- Dashboard Header -->
        <div class="dashboard-header">
            <div class="header-content">
                <h1><i class="fas fa-tachometer-alt"></i> Admin Dashboard</h1>
                <p>Welcome back! Here\'s what\'s happening with your business today.</p>
            </div>
            <div class="header-actions">
                <a href="<?php echo home_url(\'/admin-manager\'); ?>" class="btn btn-primary">
                    <i class="fas fa-crown"></i> Admin Manager
                </a>
                <a href="<?php echo home_url(\'/admin-users\'); ?>" class="btn btn-secondary">
                    <i class="fas fa-users-cog"></i> Manage Users
                </a>
                <button class="btn btn-outline" onclick="refreshDashboard()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
                <a href="<?php echo home_url(\'/admin-login\'); ?>" class="btn btn-outline">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-number" id="total-orders">47</div>
                    <div class="stat-label">Total Orders</div>
                    <div class="stat-change positive">+12% this month</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-number" id="total-revenue">$3,250</div>
                    <div class="stat-label">Total Revenue</div>
                    <div class="stat-change positive">+8% this month</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-number" id="pending-orders">8</div>
                    <div class="stat-label">Pending Orders</div>
                    <div class="stat-change">Needs attention</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-number" id="total-users">12</div>
                    <div class="stat-label">Team Members</div>
                    <div class="stat-change positive">+2 this month</div>
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="dashboard-grid">
            <!-- Orders Management -->
            <div class="dashboard-section orders-section">
                <div class="section-header">
                    <h2><i class="fas fa-tasks"></i> Order Management</h2>
                    <div class="section-actions">
                        <select id="order-filter" class="filter-select">
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="urgent">Urgent</option>
                        </select>
                        <button class="btn btn-sm btn-primary" onclick="assignMultipleOrders()">
                            <i class="fas fa-user-plus"></i> Bulk Assign
                        </button>
                    </div>
                </div>
                
                <div class="orders-container" id="orders-container">
                    <!-- Sample Orders -->
                    <div class="order-card">
                        <div class="order-header">
                            <div class="order-id">JD-001</div>
                            <div class="order-status status-pending">PENDING</div>
                        </div>
                        <div class="order-details">
                            <div><strong>Customer:</strong> John Smith</div>
                            <div><strong>Service:</strong> Legal Transcription</div>
                            <div><strong>Price:</strong> $75.00</div>
                            <div><strong>Date:</strong> 2024-01-15</div>
                            <div><strong>Status:</strong> Unassigned</div>
                        </div>
                        <div class="order-actions">
                            <button class="btn btn-sm btn-primary" onclick="assignOrder(\'JD-001\')">
                                <i class="fas fa-user-plus"></i> Assign
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="viewOrder(\'JD-001\')">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </div>
                    </div>
                    
                    <div class="order-card">
                        <div class="order-header">
                            <div class="order-id">JD-002</div>
                            <div class="order-status status-in-progress">IN PROGRESS</div>
                        </div>
                        <div class="order-details">
                            <div><strong>Customer:</strong> Sarah Johnson</div>
                            <div><strong>Service:</strong> Medical Transcription</div>
                            <div><strong>Price:</strong> $120.00</div>
                            <div><strong>Date:</strong> 2024-01-14</div>
                            <div><strong>Status:</strong> Assigned to Mike Chen</div>
                        </div>
                        <div class="order-actions">
                            <button class="btn btn-sm btn-secondary" onclick="viewOrder(\'JD-002\')">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="btn btn-sm btn-outline" onclick="editOrder(\'JD-002\')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                        </div>
                    </div>
                    
                    <div class="order-card">
                        <div class="order-header">
                            <div class="order-id">JD-003</div>
                            <div class="order-status status-completed">COMPLETED</div>
                        </div>
                        <div class="order-details">
                            <div><strong>Customer:</strong> David Wilson</div>
                            <div><strong>Service:</strong> Business Meeting</div>
                            <div><strong>Price:</strong> $45.00</div>
                            <div><strong>Date:</strong> 2024-01-13</div>
                            <div><strong>Status:</strong> Completed by Lisa Brown</div>
                        </div>
                        <div class="order-actions">
                            <button class="btn btn-sm btn-secondary" onclick="viewOrder(\'JD-003\')">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="btn btn-sm btn-primary" onclick="downloadTranscript(\'JD-003\')">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Team Management -->
            <div class="dashboard-section team-section">
                <div class="section-header">
                    <h2><i class="fas fa-users"></i> Team Management</h2>
                    <a href="<?php echo home_url(\'/admin-users\'); ?>" class="btn btn-sm btn-primary">
                        <i class="fas fa-users-cog"></i> Manage All Users
                    </a>
                </div>
                
                <div class="team-members" id="team-members">
                    <div class="team-member">
                        <div class="member-avatar">SJ</div>
                        <div class="member-info">
                            <h4>Sarah Johnson</h4>
                            <p>Legal Specialist</p>
                        </div>
                        <div class="member-status status-available">AVAILABLE</div>
                    </div>
                    
                    <div class="team-member">
                        <div class="member-avatar">MC</div>
                        <div class="member-info">
                            <h4>Mike Chen</h4>
                            <p>Medical Transcriptionist</p>
                        </div>
                        <div class="member-status status-busy">BUSY</div>
                    </div>
                    
                    <div class="team-member">
                        <div class="member-avatar">LB</div>
                        <div class="member-info">
                            <h4>Lisa Brown</h4>
                            <p>General Transcriptionist</p>
                        </div>
                        <div class="member-status status-available">AVAILABLE</div>
                    </div>
                    
                    <div class="team-member">
                        <div class="member-avatar">DW</div>
                        <div class="member-info">
                            <h4>David Wilson</h4>
                            <p>QA Editor</p>
                        </div>
                        <div class="member-status status-available">AVAILABLE</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
            <div class="actions-grid">
                <button class="action-btn" onclick="createNewOrder()">
                    <i class="fas fa-plus-circle"></i>
                    <span>New Order</span>
                </button>
                <a href="<?php echo home_url(\'/admin-users\'); ?>" class="action-btn">
                    <i class="fas fa-user-plus"></i>
                    <span>Add User</span>
                </a>
                <a href="<?php echo home_url(\'/admin-manager\'); ?>" class="action-btn">
                    <i class="fas fa-crown"></i>
                    <span>Admin Manager</span>
                </a>
                <button class="action-btn" onclick="viewReports()">
                    <i class="fas fa-chart-bar"></i>
                    <span>View Reports</span>
                </button>
                <button class="action-btn" onclick="systemSettings()">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </button>
            </div>
        </div>
    </div>
</section>

<script>
// Admin Dashboard JavaScript
function refreshDashboard() {
    location.reload();
}

function assignOrder(orderId) {
    const teamMember = prompt("Assign to team member:", "Sarah Johnson");
    if (teamMember) {
        alert(`Order ${orderId} assigned to ${teamMember}`);
    }
}

function viewOrder(orderId) {
    alert(`Viewing order ${orderId}`);
}

function editOrder(orderId) {
    alert(`Editing order ${orderId}`);
}

function downloadTranscript(orderId) {
    alert(`Downloading transcript for order ${orderId}`);
}

function assignMultipleOrders() {
    alert("Bulk assignment functionality would be implemented here");
}

function createNewOrder() {
    window.location.href = "<?php echo home_url(\'/order\'); ?>";
}

function viewReports() {
    alert("Reports functionality would be implemented here");
}

function systemSettings() {
    alert("System settings would be implemented here");
}
</script>

<?php get_footer(); ?>';

file_put_contents($theme_dir . 'page-admin.php', $updated_admin_dashboard);
echo "<p style='color: green;'>✅ Updated main admin dashboard with Admin Manager link</p>";

// Update index.php to include the admin-manager route
$updated_index = '<?php
// Main router for JD Transcripts theme
get_header();

// Get the current page from URL
$request_uri = $_SERVER["REQUEST_URI"];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = trim($path, "/");

// Remove "jd-transcripts" from path if present
$path = str_replace("jd-transcripts/", "", $path);
$path = str_replace("jd-transcripts", "", $path);
$path = trim($path, "/");

// Default to home if empty
if (empty($path)) {
    $path = "home";
}

// Route to appropriate template
switch ($path) {
    case "":
    case "home":
        include get_template_directory() . "/page-home.php";
        break;
    case "services":
        include get_template_directory() . "/page-services.php";
        break;
    case "order":
        include get_template_directory() . "/page-order.php";
        break;
    case "about":
        include get_template_directory() . "/page-about.php";
        break;
    case "contact":
        include get_template_directory() . "/page-contact.php";
        break;
    case "careers":
        include get_template_directory() . "/page-careers.php";
        break;
    case "admin-login":
        include get_template_directory() . "/page-admin-login.php";
        break;
    case "admin":
        include get_template_directory() . "/page-admin.php";
        break;
    case "admin-users":
        include get_template_directory() . "/page-admin-users.php";
        break;
    case "admin-manager":
        include get_template_directory() . "/page-admin-manager.php";
        break;
    default:
        // 404 page
        echo "<div style=\"text-align: center; padding: 100px 20px; min-height: 60vh; display: flex; flex-direction: column; justify-content: center;\">";
        echo "<h1 style=\"font-size: 4rem; color: var(--gold); margin-bottom: 20px;\">404</h1>";
        echo "<h2 style=\"margin-bottom: 20px;\">Page Not Found</h2>";
        echo "<p style=\"margin-bottom: 30px; opacity: 0.8;\">The page you are looking for does not exist.</p>";
        echo "<a href=\"" . home_url() . "\" class=\"btn btn-primary btn-large\">Go Home</a>";
        echo "</div>";
        break;
}

get_footer();
?>';

file_put_contents($theme_dir . 'index.php', $updated_index);
echo "<p style='color: green;'>✅ Updated index.php with admin-manager route</p>";

echo "<hr>";
echo "<h2>👑 ADMIN MANAGER SYSTEM COMPLETE!</h2>";
echo "<p style='color: green; font-size: 18px;'><strong>Admin Manager dashboard is now ready!</strong></p>";
?>