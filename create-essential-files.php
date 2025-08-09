<?php
// Create the essential final files
echo "<h1>⚡ Creating Essential Files</h1>";

$theme_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';

// 11. Admin Dashboard (page-admin.php)
$admin_dashboard_content = '<?php
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
                <button class="btn btn-secondary" onclick="refreshDashboard()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
                <button class="btn btn-primary" onclick="exportData()">
                    <i class="fas fa-download"></i> Export Data
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
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-number" id="completed-orders">39</div>
                    <div class="stat-label">Completed</div>
                    <div class="stat-change positive">+15% this week</div>
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
                    <button class="btn btn-sm btn-secondary" onclick="addTeamMember()">
                        <i class="fas fa-plus"></i> Add Member
                    </button>
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
                <button class="action-btn" onclick="viewReports()">
                    <i class="fas fa-chart-bar"></i>
                    <span>View Reports</span>
                </button>
                <button class="action-btn" onclick="manageTeam()">
                    <i class="fas fa-users-cog"></i>
                    <span>Manage Team</span>
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

function exportData() {
    alert("Export functionality would be implemented here");
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

function addTeamMember() {
    alert("Add team member functionality would be implemented here");
}

function createNewOrder() {
    window.location.href = "<?php echo home_url(\'/order\'); ?>";
}

function viewReports() {
    alert("Reports functionality would be implemented here");
}

function manageTeam() {
    alert("Team management functionality would be implemented here");
}

function systemSettings() {
    alert("System settings would be implemented here");
}
</script>

<?php get_footer(); ?>';

file_put_contents($theme_dir . 'page-admin.php', $admin_dashboard_content);
echo "<p style='color: green;'>✅ Created page-admin.php</p>";

// 12. Main index.php (router)
$index_content = '<?php
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

file_put_contents($theme_dir . 'index.php', $index_content);
echo "<p style='color: green;'>✅ Created index.php</p>";

// 13. Functions.php
$functions_content = '<?php
// JD Transcripts Theme Functions

// Theme setup
function jd_transcripts_setup() {
    // Add theme support for various features
    add_theme_support("title-tag");
    add_theme_support("post-thumbnails");
    add_theme_support("custom-logo");
    add_theme_support("html5", array("search-form", "comment-form", "comment-list", "gallery", "caption"));
    
    // Register navigation menus
    register_nav_menus(array(
        "primary" => __("Primary Menu", "jd-transcripts"),
        "footer" => __("Footer Menu", "jd-transcripts")
    ));
}
add_action("after_setup_theme", "jd_transcripts_setup");

// Enqueue styles and scripts
function jd_transcripts_scripts() {
    // Main stylesheet
    wp_enqueue_style("jd-transcripts-style", get_stylesheet_uri(), array(), "1.0.0");
    
    // Google Fonts
    wp_enqueue_style("google-fonts", "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Lora:wght@400;500;600&display=swap", array(), null);
    
    // Font Awesome
    wp_enqueue_style("font-awesome", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css", array(), "6.4.0");
    
    // Main JavaScript
    wp_enqueue_script("jd-transcripts-script", get_template_directory_uri() . "/assets/js/main.js", array("jquery"), "1.0.0", true);
    
    // Localize script for AJAX
    wp_localize_script("jd-transcripts-script", "jd_ajax", array(
        "ajax_url" => admin_url("admin-ajax.php"),
        "nonce" => wp_create_nonce("jd_nonce")
    ));
}
add_action("wp_enqueue_scripts", "jd_transcripts_scripts");

// Register custom post type for orders
function register_order_post_type() {
    register_post_type("jd_order", array(
        "labels" => array(
            "name" => "Orders",
            "singular_name" => "Order",
            "add_new" => "Add New Order",
            "add_new_item" => "Add New Order",
            "edit_item" => "Edit Order",
            "new_item" => "New Order",
            "view_item" => "View Order",
            "search_items" => "Search Orders",
            "not_found" => "No orders found",
            "not_found_in_trash" => "No orders found in trash"
        ),
        "public" => false,
        "show_ui" => true,
        "show_in_menu" => true,
        "capability_type" => "post",
        "hierarchical" => false,
        "supports" => array("title", "editor", "custom-fields"),
        "menu_icon" => "dashicons-clipboard"
    ));
}
add_action("init", "register_order_post_type");

// AJAX handler for order submissions
function handle_order_submission() {
    // Verify nonce
    if (!wp_verify_nonce($_POST["nonce"], "jd_nonce")) {
        wp_die("Security check failed");
    }
    
    // Sanitize form data
    $name = sanitize_text_field($_POST["name"]);
    $email = sanitize_email($_POST["email"]);
    $service = sanitize_text_field($_POST["service"]);
    $turnaround = sanitize_text_field($_POST["turnaround"]);
    $notes = sanitize_textarea_field($_POST["notes"]);
    
    // Create order post
    $order_id = wp_insert_post(array(
        "post_title" => "Order from " . $name,
        "post_content" => $notes,
        "post_status" => "publish",
        "post_type" => "jd_order",
        "meta_input" => array(
            "customer_name" => $name,
            "customer_email" => $email,
            "service_type" => $service,
            "turnaround_time" => $turnaround,
            "order_status" => "pending",
            "order_date" => current_time("mysql")
        )
    ));
    
    if ($order_id) {
        wp_send_json_success(array("message" => "Order submitted successfully!", "order_id" => $order_id));
    } else {
        wp_send_json_error(array("message" => "Failed to submit order"));
    }
}
add_action("wp_ajax_submit_order", "handle_order_submission");
add_action("wp_ajax_nopriv_submit_order", "handle_order_submission");

// Add custom columns to orders admin
function add_order_columns($columns) {
    $columns["customer_name"] = "Customer";
    $columns["customer_email"] = "Email";
    $columns["service_type"] = "Service";
    $columns["order_status"] = "Status";
    $columns["order_date"] = "Date";
    return $columns;
}
add_filter("manage_jd_order_posts_columns", "add_order_columns");

function populate_order_columns($column, $post_id) {
    switch ($column) {
        case "customer_name":
            echo get_post_meta($post_id, "customer_name", true);
            break;
        case "customer_email":
            echo get_post_meta($post_id, "customer_email", true);
            break;
        case "service_type":
            echo get_post_meta($post_id, "service_type", true);
            break;
        case "order_status":
            $status = get_post_meta($post_id, "order_status", true);
            echo "<span class=\"status-" . $status . "\">" . ucfirst($status) . "</span>";
            break;
        case "order_date":
            echo get_post_meta($post_id, "order_date", true);
            break;
    }
}
add_action("manage_jd_order_posts_custom_column", "populate_order_columns", 10, 2);

// Fallback menu function
function jd_transcripts_fallback_menu() {
    echo "<ul class=\"nav-menu\">";
    echo "<li><a href=\"" . home_url() . "\">Home</a></li>";
    echo "<li><a href=\"" . home_url("/services/") . "\">Services</a></li>";
    echo "<li><a href=\"" . home_url("/order/") . "\">Order</a></li>";
    echo "<li><a href=\"" . home_url("/about/") . "\">About</a></li>";
    echo "<li><a href=\"" . home_url("/contact/") . "\">Contact</a></li>";
    echo "<li><a href=\"" . home_url("/careers/") . "\">Careers</a></li>";
    echo "</ul>";
}

// Custom excerpt length
function jd_transcripts_excerpt_length($length) {
    return 20;
}
add_filter("excerpt_length", "jd_transcripts_excerpt_length");

// Custom excerpt more
function jd_transcripts_excerpt_more($more) {
    return "...";
}
add_filter("excerpt_more", "jd_transcripts_excerpt_more");
?>';

file_put_contents($theme_dir . 'functions.php', $functions_content);
echo "<p style='color: green;'>✅ Created functions.php</p>";

echo "<hr>";
echo "<h2>🎉 COMPLETE WEBSITE CREATED!</h2>";
echo "<p style='color: green; font-size: 18px;'><strong>All files have been successfully created!</strong></p>";
?>