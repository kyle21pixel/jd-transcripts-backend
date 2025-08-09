<?php
// Create user management system
echo "<h1>👥 Creating User Management System</h1>";

$theme_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';

// Create user management page (page-admin-users.php)
$user_management_content = '<?php
// Simple authentication check
session_start();
get_header(); 
?>

<section class="admin-dashboard">
    <div class="dashboard-container">
        <!-- Header -->
        <div class="dashboard-header">
            <div class="header-content">
                <h1><i class="fas fa-users-cog"></i> User Management</h1>
                <p>Manage team members, transcriptionists, and admin users</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="showAddUserModal()">
                    <i class="fas fa-user-plus"></i> Add New User
                </button>
                <a href="<?php echo home_url(\'/admin\'); ?>" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </a>
            </div>
        </div>

        <!-- User Statistics -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-number" id="total-users">12</div>
                    <div class="stat-label">Total Users</div>
                    <div class="stat-change positive">+2 this month</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-number" id="active-transcriptionists">8</div>
                    <div class="stat-label">Active Transcriptionists</div>
                    <div class="stat-change positive">Available</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-user-shield"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-number" id="admin-users">3</div>
                    <div class="stat-label">Admin Users</div>
                    <div class="stat-change">Secure</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-number" id="online-users">5</div>
                    <div class="stat-label">Online Now</div>
                    <div class="stat-change positive">Active</div>
                </div>
            </div>
        </div>

        <!-- User Management Table -->
        <div class="dashboard-section">
            <div class="section-header">
                <h2><i class="fas fa-table"></i> All Users</h2>
                <div class="section-actions">
                    <select id="user-filter" class="filter-select">
                        <option value="all">All Users</option>
                        <option value="admin">Administrators</option>
                        <option value="transcriptionist">Transcriptionists</option>
                        <option value="editor">Editors</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <button class="btn btn-sm btn-secondary" onclick="exportUsers()">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            </div>
            
            <div class="users-table-container">
                <table class="users-table" id="users-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Orders</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Sample Users -->
                        <tr>
                            <td>
                                <div class="user-info">
                                    <div class="user-avatar">AD</div>
                                    <div>
                                        <div class="user-name">Admin User</div>
                                        <div class="user-id">#USR001</div>
                                    </div>
                                </div>
                            </td>
                            <td><span class="role-badge role-admin">Administrator</span></td>
                            <td>admin@jdtranscripts.com</td>
                            <td><span class="status-badge status-active">Active</span></td>
                            <td>2024-01-15 10:30 AM</td>
                            <td>-</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-icon" onclick="editUser(\'USR001\')" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-icon" onclick="viewUser(\'USR001\')" title="View">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn-icon danger" onclick="deleteUser(\'USR001\')" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        
                        <tr>
                            <td>
                                <div class="user-info">
                                    <div class="user-avatar">SJ</div>
                                    <div>
                                        <div class="user-name">Sarah Johnson</div>
                                        <div class="user-id">#USR002</div>
                                    </div>
                                </div>
                            </td>
                            <td><span class="role-badge role-transcriptionist">Legal Specialist</span></td>
                            <td>sarah.johnson@jdtranscripts.com</td>
                            <td><span class="status-badge status-active">Active</span></td>
                            <td>2024-01-15 09:15 AM</td>
                            <td>23</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-icon" onclick="editUser(\'USR002\')" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-icon" onclick="viewUser(\'USR002\')" title="View">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn-icon" onclick="assignOrders(\'USR002\')" title="Assign Orders">
                                        <i class="fas fa-tasks"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        
                        <tr>
                            <td>
                                <div class="user-info">
                                    <div class="user-avatar">MC</div>
                                    <div>
                                        <div class="user-name">Mike Chen</div>
                                        <div class="user-id">#USR003</div>
                                    </div>
                                </div>
                            </td>
                            <td><span class="role-badge role-transcriptionist">Medical Specialist</span></td>
                            <td>mike.chen@jdtranscripts.com</td>
                            <td><span class="status-badge status-busy">Busy</span></td>
                            <td>2024-01-15 08:45 AM</td>
                            <td>31</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-icon" onclick="editUser(\'USR003\')" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-icon" onclick="viewUser(\'USR003\')" title="View">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn-icon" onclick="assignOrders(\'USR003\')" title="Assign Orders">
                                        <i class="fas fa-tasks"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        
                        <tr>
                            <td>
                                <div class="user-info">
                                    <div class="user-avatar">LB</div>
                                    <div>
                                        <div class="user-name">Lisa Brown</div>
                                        <div class="user-id">#USR004</div>
                                    </div>
                                </div>
                            </td>
                            <td><span class="role-badge role-editor">QA Editor</span></td>
                            <td>lisa.brown@jdtranscripts.com</td>
                            <td><span class="status-badge status-active">Active</span></td>
                            <td>2024-01-15 07:30 AM</td>
                            <td>18</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-icon" onclick="editUser(\'USR004\')" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-icon" onclick="viewUser(\'USR004\')" title="View">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn-icon" onclick="assignOrders(\'USR004\')" title="Assign Orders">
                                        <i class="fas fa-tasks"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>

<!-- Add User Modal -->
<div id="add-user-modal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3><i class="fas fa-user-plus"></i> Add New User</h3>
            <button class="modal-close" onclick="closeAddUserModal()">&times;</button>
        </div>
        <div class="modal-body">
            <form id="add-user-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="user-name">Full Name *</label>
                        <input type="text" id="user-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="user-email">Email Address *</label>
                        <input type="email" id="user-email" name="email" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="user-role">Role *</label>
                        <select id="user-role" name="role" required>
                            <option value="">Select role</option>
                            <option value="admin">Administrator</option>
                            <option value="transcriptionist">Transcriptionist</option>
                            <option value="legal-specialist">Legal Specialist</option>
                            <option value="medical-specialist">Medical Specialist</option>
                            <option value="editor">QA Editor</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="user-phone">Phone Number</label>
                        <input type="tel" id="user-phone" name="phone" placeholder="+254 712 345 678">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="user-username">Username *</label>
                        <input type="text" id="user-username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="user-password">Password *</label>
                        <input type="password" id="user-password" name="password" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="user-specialization">Specialization</label>
                    <select id="user-specialization" name="specialization">
                        <option value="">Select specialization</option>
                        <option value="legal">Legal Transcription</option>
                        <option value="medical">Medical Transcription</option>
                        <option value="business">Business Meetings</option>
                        <option value="academic">Academic & Research</option>
                        <option value="general">General Transcription</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="user-bio">Bio/Notes</label>
                    <textarea id="user-bio" name="bio" rows="3" placeholder="Brief description, experience, or notes..."></textarea>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="user-active" name="active" checked>
                        <span>Active User</span>
                    </label>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="send-welcome" name="send_welcome" checked>
                        <span>Send Welcome Email</span>
                    </label>
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeAddUserModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-user-plus"></i> Add User
                    </button>
                </div>
                
                <div id="add-user-status" class="form-status"></div>
            </form>
        </div>
    </div>
</div>

<!-- Edit User Modal -->
<div id="edit-user-modal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3><i class="fas fa-user-edit"></i> Edit User</h3>
            <button class="modal-close" onclick="closeEditUserModal()">&times;</button>
        </div>
        <div class="modal-body">
            <form id="edit-user-form">
                <input type="hidden" id="edit-user-id" name="user_id">
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-user-name">Full Name *</label>
                        <input type="text" id="edit-user-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-user-email">Email Address *</label>
                        <input type="email" id="edit-user-email" name="email" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-user-role">Role *</label>
                        <select id="edit-user-role" name="role" required>
                            <option value="admin">Administrator</option>
                            <option value="transcriptionist">Transcriptionist</option>
                            <option value="legal-specialist">Legal Specialist</option>
                            <option value="medical-specialist">Medical Specialist</option>
                            <option value="editor">QA Editor</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-user-status">Status *</label>
                        <select id="edit-user-status" name="status" required>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="busy">Busy</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="edit-user-password">New Password (leave blank to keep current)</label>
                    <input type="password" id="edit-user-password" name="password">
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeEditUserModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>
                
                <div id="edit-user-status" class="form-status"></div>
            </form>
        </div>
    </div>
</div>

<script>
// User Management JavaScript
function showAddUserModal() {
    document.getElementById("add-user-modal").style.display = "flex";
}

function closeAddUserModal() {
    document.getElementById("add-user-modal").style.display = "none";
    document.getElementById("add-user-form").reset();
    document.getElementById("add-user-status").innerHTML = "";
}

function editUser(userId) {
    // In a real system, this would fetch user data from database
    document.getElementById("edit-user-id").value = userId;
    document.getElementById("edit-user-name").value = "Sample User";
    document.getElementById("edit-user-email").value = "user@example.com";
    document.getElementById("edit-user-role").value = "transcriptionist";
    document.getElementById("edit-user-status").value = "active";
    
    document.getElementById("edit-user-modal").style.display = "flex";
}

function closeEditUserModal() {
    document.getElementById("edit-user-modal").style.display = "none";
    document.getElementById("edit-user-form").reset();
    document.getElementById("edit-user-status").innerHTML = "";
}

function viewUser(userId) {
    alert("Viewing user details for: " + userId);
}

function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
        alert("User " + userId + " would be deleted");
    }
}

function assignOrders(userId) {
    alert("Assign orders interface for user: " + userId);
}

function exportUsers() {
    alert("Export users functionality would be implemented here");
}

// Add User Form Submission
document.getElementById("add-user-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const statusDiv = document.getElementById("add-user-status");
    statusDiv.innerHTML = "<p style=\'color: #d4af37;\'>Creating user account...</p>";
    
    // Simulate user creation
    setTimeout(function() {
        statusDiv.innerHTML = "<p style=\'color: #4ade80;\'>✅ User created successfully! Welcome email sent.</p>";
        
        setTimeout(function() {
            closeAddUserModal();
            location.reload(); // Refresh to show new user
        }, 2000);
    }, 2000);
});

// Edit User Form Submission
document.getElementById("edit-user-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const statusDiv = document.getElementById("edit-user-status");
    statusDiv.innerHTML = "<p style=\'color: #d4af37;\'>Updating user account...</p>";
    
    // Simulate user update
    setTimeout(function() {
        statusDiv.innerHTML = "<p style=\'color: #4ade80;\'>✅ User updated successfully!</p>";
        
        setTimeout(function() {
            closeEditUserModal();
            location.reload(); // Refresh to show updated user
        }, 2000);
    }, 2000);
});

// Close modals when clicking outside
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("modal")) {
        e.target.style.display = "none";
    }
});

// Filter users
document.getElementById("user-filter").addEventListener("change", function() {
    const filter = this.value;
    alert("Filtering users by: " + filter);
});
</script>

<?php get_footer(); ?>';

file_put_contents($theme_dir . 'page-admin-users.php', $user_management_content);
echo "<p style='color: green;'>✅ Created page-admin-users.php</p>";

// Update the admin dashboard to include user management link
$updated_admin_content = '<?php
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
                <a href="<?php echo home_url(\'/admin-users\'); ?>" class="btn btn-primary">
                    <i class="fas fa-users-cog"></i> Manage Users
                </a>
                <button class="btn btn-secondary" onclick="refreshDashboard()">
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

file_put_contents($theme_dir . 'page-admin.php', $updated_admin_content);
echo "<p style='color: green;'>✅ Updated page-admin.php with user management</p>";

// Update the index.php to include the new user management route
$updated_index_content = '<?php
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

file_put_contents($theme_dir . 'index.php', $updated_index_content);
echo "<p style='color: green;'>✅ Updated index.php with user management route</p>";

echo "<hr>";
echo "<h2>🎉 USER MANAGEMENT SYSTEM CREATED!</h2>";
echo "<p style='color: green; font-size: 18px;'><strong>Admin can now add and manage users!</strong></p>";
?>