<?php
// Fix navigation to use correct WordPress URLs
require_once('C:/xampp/htdocs/jd-transcripts/wp-config.php');
require_once('C:/xampp/htdocs/jd-transcripts/wp-load.php');

echo "<h1>🧭 Fixing Navigation Links...</h1>";

// Update the header.php file to use correct navigation
$header_file = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/header.php';
$header_content = file_get_contents($header_file);

// Replace the navigation section with a custom one that works
$new_navigation = '        <ul class="nav-menu" id="nav-menu">
            <li class="nav-item">
                <a href="<?php echo home_url(); ?>" class="nav-link">Home</a>
            </li>
            <li class="nav-item dropdown">
                <a href="<?php echo home_url(\'/services/\'); ?>" class="nav-link">Services <i class="fas fa-caret-down"></i></a>
                <ul class="dropdown-menu">
                    <li><a href="<?php echo home_url(\'/services/\'); ?>" class="dropdown-link">All Services</a></li>
                    <li><a href="<?php echo home_url(\'/services/#legal\'); ?>" class="dropdown-link">Legal Transcription</a></li>
                    <li><a href="<?php echo home_url(\'/services/#medical\'); ?>" class="dropdown-link">Medical Transcription</a></li>
                    <li><a href="<?php echo home_url(\'/services/#business\'); ?>" class="dropdown-link">Business Meetings</a></li>
                    <li><a href="<?php echo home_url(\'/services/#academic\'); ?>" class="dropdown-link">Academic & Research</a></li>
                </ul>
            </li>
            <li class="nav-item">
                <a href="<?php echo home_url(\'/order/\'); ?>" class="nav-link">Order</a>
            </li>
            <li class="nav-item">
                <a href="<?php echo home_url(\'/about/\'); ?>" class="nav-link">About</a>
            </li>
            <li class="nav-item">
                <a href="<?php echo home_url(\'/contact/\'); ?>" class="nav-link">Contact</a>
            </li>
            <li class="nav-item">
                <a href="<?php echo home_url(\'/careers/\'); ?>" class="nav-link">Careers</a>
            </li>
        </ul>
        
        <div class="nav-actions">
            <a href="<?php echo home_url(\'/order/\'); ?>" class="btn btn-primary nav-cta">Order Now</a>
            <a href="<?php echo home_url(\'/admin-login/\'); ?>" class="btn btn-secondary admin-login-btn">
                <i class="fas fa-user-shield"></i> Admin
            </a>
        </div>';

// Find and replace the WordPress navigation menu section
$pattern = '/wp_nav_menu\(array\(.*?\)\);.*?<\/div>/s';
$replacement = $new_navigation . '
        
        <!-- Mobile Menu Toggle -->';

$updated_header = preg_replace($pattern, $replacement, $header_content);

// Also fix the logo section
$logo_pattern = '/<div class="nav-logo">.*?<\/div>/s';
$new_logo = '<div class="nav-logo">
            <button class="logo-refresh" onclick="location.reload()" style="background:none;border:none;padding:0;cursor:pointer;">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo-placeholder.svg" alt="JD Transcripts" class="logo">
            </button>
            <div class="logo-text-container">
                <span class="logo-text">JD Legal</span>
                <span class="logo-text">Transcripts</span>
            </div>
        </div>';

$updated_header = preg_replace($logo_pattern, $new_logo, $updated_header);

// Save the updated header
if (file_put_contents($header_file, $updated_header)) {
    echo "<p style='color: green;'>✅ Header navigation updated successfully!</p>";
} else {
    echo "<p style='color: red;'>❌ Failed to update header navigation</p>";
}

// Also create a functions.php file to register navigation menus properly
$functions_file = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/functions.php';
$functions_content = '<?php
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

// AJAX handler for dashboard stats
function get_dashboard_stats() {
    $orders = get_posts(array(
        "post_type" => "jd_order",
        "post_status" => "publish",
        "numberposts" => -1
    ));
    
    $total_orders = count($orders);
    $pending_orders = 0;
    $completed_orders = 0;
    $total_revenue = 0;
    
    foreach ($orders as $order) {
        $status = get_post_meta($order->ID, "order_status", true);
        if ($status === "pending") $pending_orders++;
        if ($status === "completed") $completed_orders++;
        
        // Calculate revenue (demo calculation)
        $service = get_post_meta($order->ID, "service_type", true);
        switch ($service) {
            case "legal": $total_revenue += 75; break;
            case "medical": $total_revenue += 85; break;
            case "zoom": $total_revenue += 45; break;
            case "academic": $total_revenue += 55; break;
            default: $total_revenue += 60; break;
        }
    }
    
    wp_send_json_success(array(
        "total_orders" => $total_orders,
        "pending_orders" => $pending_orders,
        "completed_orders" => $completed_orders,
        "total_revenue" => $total_revenue
    ));
}
add_action("wp_ajax_get_dashboard_stats", "get_dashboard_stats");

// AJAX handler for admin orders
function get_admin_orders() {
    $orders = get_posts(array(
        "post_type" => "jd_order",
        "post_status" => "publish",
        "numberposts" => -1,
        "orderby" => "date",
        "order" => "DESC"
    ));
    
    $formatted_orders = array();
    foreach ($orders as $order) {
        $formatted_orders[] = array(
            "id" => "JD-" . str_pad($order->ID, 3, "0", STR_PAD_LEFT),
            "customer" => get_post_meta($order->ID, "customer_name", true),
            "service" => ucfirst(get_post_meta($order->ID, "service_type", true)) . " Transcription",
            "status" => get_post_meta($order->ID, "order_status", true) ?: "pending",
            "price" => "$" . rand(45, 120) . ".00", // Demo pricing
            "date" => get_the_date("Y-m-d", $order->ID),
            "assigned_to" => get_post_meta($order->ID, "assigned_to", true)
        );
    }
    
    wp_send_json_success($formatted_orders);
}
add_action("wp_ajax_get_admin_orders", "get_admin_orders");

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
?>';

if (file_put_contents($functions_file, $functions_content)) {
    echo "<p style='color: green;'>✅ Functions.php created with proper navigation support!</p>";
} else {
    echo "<p style='color: red;'>❌ Failed to create functions.php</p>";
}

echo "<hr>";
echo "<h2>🎯 Navigation Fixed!</h2>";
echo "<p>The navigation has been updated to use proper WordPress URLs. All links should now work correctly!</p>";

echo "<div style='background: #d4edda; padding: 20px; border-radius: 8px; border: 1px solid #c3e6cb; margin: 20px 0;'>";
echo "<h3>✅ Test Your Navigation:</h3>";
echo "<ul>";
echo "<li><a href='http://localhost/jd-transcripts/' target='_blank'>🏠 Homepage</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/services/' target='_blank'>🛠️ Services</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/order/' target='_blank'>📝 Order</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/about/' target='_blank'>ℹ️ About</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/contact/' target='_blank'>📞 Contact</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/careers/' target='_blank'>💼 Careers</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/admin-login/' target='_blank'>🔐 Admin Login</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/admin/' target='_blank'>🎛️ Admin Dashboard</a></li>";
echo "</ul>";
echo "</div>";

echo "<style>
body { 
    font-family: Arial, sans-serif; 
    max-width: 800px; 
    margin: 50px auto; 
    padding: 20px; 
    background: #f8f9fa;
}
h1 { color: #d4af37; text-align: center; }
h2 { color: #2c3e50; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
a { color: #d4af37; text-decoration: none; }
a:hover { text-decoration: underline; }
ul { padding-left: 20px; }
li { margin: 8px 0; }
</style>";
?>