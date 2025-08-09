<?php
// Create Admin Manager System
echo "<h1>👑 Creating Admin Manager System</h1>";

$theme_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';

// Create Admin Manager Dashboard (page-admin-manager.php)
$admin_manager_content = '<?php
// Admin Manager authentication check
session_start();
get_header(); 
?>

<section class="admin-manager-dashboard">
    <div class="dashboard-container">
        <!-- Header -->
        <div class="dashboard-header">
            <div class="header-content">
                <h1><i class="fas fa-crown"></i> Admin Manager Dashboard</h1>
                <p>Monitor and manage all administrative staff performance and activities</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="generateAdminReport()">
                    <i class="fas fa-chart-line"></i> Generate Report
                </button>
                <button class="btn btn-secondary" onclick="exportAdminData()">
                    <i class="fas fa-download"></i> Export Data
                </button>
                <a href="<?php echo home_url(\'/admin\'); ?>" class="btn btn-outline">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </a>
            </div>
        </div>

        <!-- Admin Statistics Overview -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-user-shield"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-number" id="total-admins">8</div>
                    <div class="stat-label">Total Admins</div>
                    <div class="stat-change positive">+2 this month</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-number" id="active-admins">6</div>
                    <div class="stat-label">Active Today</div>
                    <div class="stat-change positive">75% online</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-tasks"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-number" id="orders-processed">156</div>
                    <div class="stat-label">Orders Processed</div>
                    <div class="stat-change positive">+18% this week</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-star"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-number" id="avg-performance">94%</div>
                    <div class="stat-label">Avg Performance</div>
                    <div class="stat-change positive">Excellent</div>
                </div>
            </div>
        </div>

        <!-- Admin Performance Tracking -->
        <div class="dashboard-section">
            <div class="section-header">
                <h2><i class="fas fa-chart-bar"></i> Admin Performance Tracking</h2>
                <div class="section-actions">
                    <select id="performance-filter" class="filter-select">
                        <option value="all">All Admins</option>
                        <option value="high-performers">High Performers</option>
                        <option value="needs-attention">Needs Attention</option>
                        <option value="new-admins">New Admins</option>
                    </select>
                    <select id="time-period" class="filter-select">
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                    </select>
                </div>
            </div>
            
            <div class="admin-performance-grid">
                <!-- Admin Performance Cards -->
                <div class="admin-performance-card">
                    <div class="admin-header">
                        <div class="admin-avatar">
                            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNkNGFmMzciLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzFhMWExYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkpTPC90ZXh0Pgo8L3N2Zz4K" alt="JS">
                        </div>
                        <div class="admin-info">
                            <h3>John Smith</h3>
                            <p>Senior Admin • ID: ADM001</p>
                            <span class="admin-status status-online">Online</span>
                        </div>
                        <div class="performance-score">
                            <div class="score-circle" data-score="96">
                                <span>96%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="admin-metrics">
                        <div class="metric">
                            <span class="metric-label">Orders Handled</span>
                            <span class="metric-value">42</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Response Time</span>
                            <span class="metric-value">2.3 min</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Accuracy Rate</span>
                            <span class="metric-value">98.5%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Hours Worked</span>
                            <span class="metric-value">7.5h</span>
                        </div>
                    </div>
                    
                    <div class="admin-actions">
                        <button class="btn btn-sm btn-primary" onclick="viewAdminDetails(\'ADM001\')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="sendMessage(\'ADM001\')">
                            <i class="fas fa-message"></i> Message
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="viewAdminHistory(\'ADM001\')">
                            <i class="fas fa-history"></i> History
                        </button>
                    </div>
                </div>

                <div class="admin-performance-card">
                    <div class="admin-header">
                        <div class="admin-avatar">
                            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNkNGFmMzciLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzFhMWExYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1KPC90ZXh0Pgo8L3N2Zz4K" alt="MJ">
                        </div>
                        <div class="admin-info">
                            <h3>Maria Johnson</h3>
                            <p>Admin Supervisor • ID: ADM002</p>
                            <span class="admin-status status-online">Online</span>
                        </div>
                        <div class="performance-score">
                            <div class="score-circle" data-score="92">
                                <span>92%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="admin-metrics">
                        <div class="metric">
                            <span class="metric-label">Orders Handled</span>
                            <span class="metric-value">38</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Response Time</span>
                            <span class="metric-value">3.1 min</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Accuracy Rate</span>
                            <span class="metric-value">96.2%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Hours Worked</span>
                            <span class="metric-value">8.0h</span>
                        </div>
                    </div>
                    
                    <div class="admin-actions">
                        <button class="btn btn-sm btn-primary" onclick="viewAdminDetails(\'ADM002\')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="sendMessage(\'ADM002\')">
                            <i class="fas fa-message"></i> Message
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="viewAdminHistory(\'ADM002\')">
                            <i class="fas fa-history"></i> History
                        </button>
                    </div>
                </div>

                <div class="admin-performance-card">
                    <div class="admin-header">
                        <div class="admin-avatar">
                            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNkNGFmMzciLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzFhMWExYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRXPC90ZXh0Pgo8L3N2Zz4K" alt="DW">
                        </div>
                        <div class="admin-info">
                            <h3>David Wilson</h3>
                            <p>Junior Admin • ID: ADM003</p>
                            <span class="admin-status status-away">Away</span>
                        </div>
                        <div class="performance-score">
                            <div class="score-circle" data-score="87">
                                <span>87%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="admin-metrics">
                        <div class="metric">
                            <span class="metric-label">Orders Handled</span>
                            <span class="metric-value">28</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Response Time</span>
                            <span class="metric-value">4.2 min</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Accuracy Rate</span>
                            <span class="metric-value">94.1%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Hours Worked</span>
                            <span class="metric-value">6.5h</span>
                        </div>
                    </div>
                    
                    <div class="admin-actions">
                        <button class="btn btn-sm btn-primary" onclick="viewAdminDetails(\'ADM003\')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="sendMessage(\'ADM003\')">
                            <i class="fas fa-message"></i> Message
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="viewAdminHistory(\'ADM003\')">
                            <i class="fas fa-history"></i> History
                        </button>
                    </div>
                </div>

                <div class="admin-performance-card">
                    <div class="admin-header">
                        <div class="admin-avatar">
                            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNkNGFmMzciLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzFhMWExYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVCPC90ZXh0Pgo8L3N2Zz4K" alt="EB">
                        </div>
                        <div class="admin-info">
                            <h3>Emily Brown</h3>
                            <p>Admin Assistant • ID: ADM004</p>
                            <span class="admin-status status-offline">Offline</span>
                        </div>
                        <div class="performance-score">
                            <div class="score-circle" data-score="91">
                                <span>91%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="admin-metrics">
                        <div class="metric">
                            <span class="metric-label">Orders Handled</span>
                            <span class="metric-value">35</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Response Time</span>
                            <span class="metric-value">3.8 min</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Accuracy Rate</span>
                            <span class="metric-value">95.7%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Hours Worked</span>
                            <span class="metric-value">7.2h</span>
                        </div>
                    </div>
                    
                    <div class="admin-actions">
                        <button class="btn btn-sm btn-primary" onclick="viewAdminDetails(\'ADM004\')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="sendMessage(\'ADM004\')">
                            <i class="fas fa-message"></i> Message
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="viewAdminHistory(\'ADM004\')">
                            <i class="fas fa-history"></i> History
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Admin Activity Log -->
        <div class="dashboard-section">
            <div class="section-header">
                <h2><i class="fas fa-list-alt"></i> Admin Activity Log</h2>
                <div class="section-actions">
                    <select id="activity-filter" class="filter-select">
                        <option value="all">All Activities</option>
                        <option value="logins">Login/Logout</option>
                        <option value="orders">Order Actions</option>
                        <option value="user-management">User Management</option>
                        <option value="system">System Changes</option>
                    </select>
                    <button class="btn btn-sm btn-secondary" onclick="refreshActivityLog()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>
            
            <div class="activity-log">
                <div class="activity-item">
                    <div class="activity-time">10:45 AM</div>
                    <div class="activity-avatar">JS</div>
                    <div class="activity-content">
                        <div class="activity-title">John Smith assigned order JD-156 to Sarah Johnson</div>
                        <div class="activity-meta">Order Management • Legal Transcription</div>
                    </div>
                    <div class="activity-status status-success">Completed</div>
                </div>
                
                <div class="activity-item">
                    <div class="activity-time">10:32 AM</div>
                    <div class="activity-avatar">MJ</div>
                    <div class="activity-content">
                        <div class="activity-title">Maria Johnson updated user permissions for Mike Chen</div>
                        <div class="activity-meta">User Management • Role Change</div>
                    </div>
                    <div class="activity-status status-success">Completed</div>
                </div>
                
                <div class="activity-item">
                    <div class="activity-time">10:15 AM</div>
                    <div class="activity-avatar">DW</div>
                    <div class="activity-content">
                        <div class="activity-title">David Wilson logged into the system</div>
                        <div class="activity-meta">Authentication • Login</div>
                    </div>
                    <div class="activity-status status-info">Login</div>
                </div>
                
                <div class="activity-item">
                    <div class="activity-time">09:58 AM</div>
                    <div class="activity-avatar">EB</div>
                    <div class="activity-content">
                        <div class="activity-title">Emily Brown processed payment for order JD-154</div>
                        <div class="activity-meta">Financial • Payment Processing</div>
                    </div>
                    <div class="activity-status status-success">Completed</div>
                </div>
                
                <div class="activity-item">
                    <div class="activity-time">09:45 AM</div>
                    <div class="activity-avatar">JS</div>
                    <div class="activity-content">
                        <div class="activity-title">John Smith generated monthly performance report</div>
                        <div class="activity-meta">Reports • Analytics</div>
                    </div>
                    <div class="activity-status status-success">Generated</div>
                </div>
            </div>
        </div>

        <!-- Admin Comparison Chart -->
        <div class="dashboard-section">
            <div class="section-header">
                <h2><i class="fas fa-chart-line"></i> Performance Comparison</h2>
                <div class="section-actions">
                    <select id="comparison-metric" class="filter-select">
                        <option value="orders">Orders Processed</option>
                        <option value="response-time">Response Time</option>
                        <option value="accuracy">Accuracy Rate</option>
                        <option value="hours">Hours Worked</option>
                    </select>
                </div>
            </div>
            
            <div class="comparison-chart">
                <div class="chart-container">
                    <div class="chart-bar">
                        <div class="bar-label">John Smith</div>
                        <div class="bar-container">
                            <div class="bar-fill" style="width: 96%;" data-value="42"></div>
                            <span class="bar-value">42</span>
                        </div>
                    </div>
                    
                    <div class="chart-bar">
                        <div class="bar-label">Maria Johnson</div>
                        <div class="bar-container">
                            <div class="bar-fill" style="width: 86%;" data-value="38"></div>
                            <span class="bar-value">38</span>
                        </div>
                    </div>
                    
                    <div class="chart-bar">
                        <div class="bar-label">Emily Brown</div>
                        <div class="bar-container">
                            <div class="bar-fill" style="width: 79%;" data-value="35"></div>
                            <span class="bar-value">35</span>
                        </div>
                    </div>
                    
                    <div class="chart-bar">
                        <div class="bar-label">David Wilson</div>
                        <div class="bar-container">
                            <div class="bar-fill" style="width: 64%;" data-value="28"></div>
                            <span class="bar-value">28</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Admin Actions -->
        <div class="quick-actions">
            <h3><i class="fas fa-bolt"></i> Admin Management Actions</h3>
            <div class="actions-grid">
                <button class="action-btn" onclick="addNewAdmin()">
                    <i class="fas fa-user-plus"></i>
                    <span>Add Admin</span>
                </button>
                <button class="action-btn" onclick="scheduleAdminMeeting()">
                    <i class="fas fa-calendar-plus"></i>
                    <span>Schedule Meeting</span>
                </button>
                <button class="action-btn" onclick="sendBulkMessage()">
                    <i class="fas fa-bullhorn"></i>
                    <span>Broadcast Message</span>
                </button>
                <button class="action-btn" onclick="generatePerformanceReport()">
                    <i class="fas fa-file-alt"></i>
                    <span>Performance Report</span>
                </button>
                <button class="action-btn" onclick="manageAdminRoles()">
                    <i class="fas fa-user-cog"></i>
                    <span>Manage Roles</span>
                </button>
                <button class="action-btn" onclick="viewSystemLogs()">
                    <i class="fas fa-server"></i>
                    <span>System Logs</span>
                </button>
            </div>
        </div>
    </div>
</section>

<!-- Admin Details Modal -->
<div id="admin-details-modal" class="modal" style="display: none;">
    <div class="modal-content large-modal">
        <div class="modal-header">
            <h3><i class="fas fa-user-circle"></i> Admin Details</h3>
            <button class="modal-close" onclick="closeAdminDetailsModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div id="admin-details-content">
                <!-- Content will be loaded dynamically -->
            </div>
        </div>
    </div>
</div>

<script>
// Admin Manager JavaScript Functions
function generateAdminReport() {
    alert("Generating comprehensive admin performance report...");
}

function exportAdminData() {
    alert("Exporting admin data to CSV/Excel...");
}

function viewAdminDetails(adminId) {
    // Sample admin details
    const adminDetails = {
        "ADM001": {
            name: "John Smith",
            role: "Senior Admin",
            email: "john.smith@jdtranscripts.com",
            phone: "+254 712 345 678",
            joinDate: "2023-06-15",
            totalOrders: 1247,
            avgResponseTime: "2.3 min",
            accuracyRate: "98.5%",
            hoursThisMonth: "168h",
            specializations: ["Legal Transcription", "Order Management"],
            recentActivity: [
                "Assigned order JD-156 to Sarah Johnson",
                "Updated client information for order JD-155",
                "Processed refund for order JD-152"
            ]
        }
    };
    
    const admin = adminDetails[adminId] || adminDetails["ADM001"];
    
    document.getElementById("admin-details-content").innerHTML = `
        <div class="admin-profile">
            <div class="profile-header">
                <div class="profile-avatar">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNkNGFmMzciLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyOCIgZmlsbD0iIzFhMWExYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkpTPC90ZXh0Pgo8L3N2Zz4K" alt="${admin.name}">
                </div>
                <div class="profile-info">
                    <h2>${admin.name}</h2>
                    <p>${admin.role} • ID: ${adminId}</p>
                    <p><i class="fas fa-envelope"></i> ${admin.email}</p>
                    <p><i class="fas fa-phone"></i> ${admin.phone}</p>
                    <p><i class="fas fa-calendar"></i> Joined: ${admin.joinDate}</p>
                </div>
            </div>
            
            <div class="profile-stats">
                <div class="stat-item">
                    <div class="stat-value">${admin.totalOrders}</div>
                    <div class="stat-label">Total Orders</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${admin.avgResponseTime}</div>
                    <div class="stat-label">Avg Response</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${admin.accuracyRate}</div>
                    <div class="stat-label">Accuracy Rate</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${admin.hoursThisMonth}</div>
                    <div class="stat-label">Hours This Month</div>
                </div>
            </div>
            
            <div class="profile-sections">
                <div class="profile-section">
                    <h4>Specializations</h4>
                    <div class="specialization-tags">
                        ${admin.specializations.map(spec => `<span class="tag">${spec}</span>`).join("")}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h4>Recent Activity</h4>
                    <ul class="activity-list">
                        ${admin.recentActivity.map(activity => `<li>${activity}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById("admin-details-modal").style.display = "flex";
}

function closeAdminDetailsModal() {
    document.getElementById("admin-details-modal").style.display = "none";
}

function sendMessage(adminId) {
    const message = prompt("Send message to admin:", "");
    if (message) {
        alert(`Message sent to ${adminId}: ${message}`);
    }
}

function viewAdminHistory(adminId) {
    alert(`Viewing complete history for admin: ${adminId}`);
}

function refreshActivityLog() {
    alert("Refreshing activity log...");
    location.reload();
}

function addNewAdmin() {
    window.location.href = "<?php echo home_url(\'/admin-users\'); ?>";
}

function scheduleAdminMeeting() {
    alert("Opening meeting scheduler...");
}

function sendBulkMessage() {
    const message = prompt("Send message to all admins:", "");
    if (message) {
        alert(`Bulk message sent to all admins: ${message}`);
    }
}

function generatePerformanceReport() {
    alert("Generating detailed performance report for all admins...");
}

function manageAdminRoles() {
    alert("Opening admin role management interface...");
}

function viewSystemLogs() {
    alert("Opening system logs viewer...");
}

// Close modal when clicking outside
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("modal")) {
        e.target.style.display = "none";
    }
});

// Initialize performance circles
document.addEventListener("DOMContentLoaded", function() {
    const circles = document.querySelectorAll(".score-circle");
    circles.forEach(circle => {
        const score = circle.getAttribute("data-score");
        // Add animation or styling based on score
        if (score >= 95) {
            circle.classList.add("excellent");
        } else if (score >= 90) {
            circle.classList.add("good");
        } else if (score >= 80) {
            circle.classList.add("average");
        } else {
            circle.classList.add("needs-improvement");
        }
    });
});
</script>

<?php get_footer(); ?>';

file_put_contents($theme_dir . 'page-admin-manager.php', $admin_manager_content);
echo "<p style='color: green;'>✅ Created page-admin-manager.php</p>";

echo "<p>Admin Manager system created! Now updating navigation and styles...</p>";
?>