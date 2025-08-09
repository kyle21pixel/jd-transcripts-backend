<?php
/**
 * JD Transcripts Theme Functions
 * 
 * @package JD_Transcripts
 * @version 1.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function jd_transcripts_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    add_theme_support('custom-background');
    add_theme_support('customize-selective-refresh-widgets');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'jd-transcripts'),
        'footer' => __('Footer Menu', 'jd-transcripts'),
    ));
    
    // Add image sizes
    add_image_size('jd-hero', 800, 600, true);
    add_image_size('jd-service', 400, 300, true);
    add_image_size('jd-team', 300, 300, true);
}
add_action('after_setup_theme', 'jd_transcripts_setup');

/**
 * Enqueue Scripts and Styles
 */
function jd_transcripts_scripts() {
    // Theme stylesheet
    wp_enqueue_style('jd-transcripts-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // Font Awesome (already included in header, but keeping for reference)
    // wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', array(), '6.4.0');
    
    // Theme JavaScript
    wp_enqueue_script('jd-transcripts-config', get_template_directory_uri() . '/assets/js/config.js', array(), '1.0.0', true);
    wp_enqueue_script('jd-transcripts-mock-server', get_template_directory_uri() . '/assets/js/mock-server.js', array('jd-transcripts-config'), '1.0.0', true);
    wp_enqueue_script('jd-transcripts-script', get_template_directory_uri() . '/assets/js/script.js', array('jquery', 'jd-transcripts-mock-server'), '1.0.0', true);
    
    // Localize script for AJAX
    wp_localize_script('jd-transcripts-script', 'jd_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('jd_transcripts_nonce'),
        'home_url' => home_url(),
        'theme_url' => get_template_directory_uri(),
    ));
}
add_action('wp_enqueue_scripts', 'jd_transcripts_scripts');

/**
 * Fallback menu for primary navigation
 */
function jd_transcripts_fallback_menu() {
    echo '<ul class="nav-menu">';
    echo '<li><a href="#home" class="nav-link">Home</a></li>';
    echo '<li><a href="#services" class="nav-link">Services</a></li>';
    echo '<li><a href="#order" class="nav-link">Order</a></li>';
    echo '<li><a href="#about" class="nav-link">About</a></li>';
    echo '<li><a href="#contact" class="nav-link">Contact</a></li>';
    echo '</ul>';
}

/**
 * Register Widget Areas
 */
function jd_transcripts_widgets_init() {
    register_sidebar(array(
        'name'          => __('Footer Widget Area 1', 'jd-transcripts'),
        'id'            => 'footer-1',
        'description'   => __('Add widgets here to appear in the first footer column.', 'jd-transcripts'),
        'before_widget' => '<div class="footer-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
    
    register_sidebar(array(
        'name'          => __('Footer Widget Area 2', 'jd-transcripts'),
        'id'            => 'footer-2',
        'description'   => __('Add widgets here to appear in the second footer column.', 'jd-transcripts'),
        'before_widget' => '<div class="footer-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
    
    register_sidebar(array(
        'name'          => __('Footer Widget Area 3', 'jd-transcripts'),
        'id'            => 'footer-3',
        'description'   => __('Add widgets here to appear in the third footer column.', 'jd-transcripts'),
        'before_widget' => '<div class="footer-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'jd_transcripts_widgets_init');

/**
 * Custom Post Type for Orders
 */
function jd_transcripts_create_order_post_type() {
    register_post_type('jd_order',
        array(
            'labels' => array(
                'name' => __('Orders', 'jd-transcripts'),
                'singular_name' => __('Order', 'jd-transcripts'),
                'add_new' => __('Add New Order', 'jd-transcripts'),
                'add_new_item' => __('Add New Order', 'jd-transcripts'),
                'edit_item' => __('Edit Order', 'jd-transcripts'),
                'new_item' => __('New Order', 'jd-transcripts'),
                'view_item' => __('View Order', 'jd-transcripts'),
                'search_items' => __('Search Orders', 'jd-transcripts'),
                'not_found' => __('No orders found', 'jd-transcripts'),
                'not_found_in_trash' => __('No orders found in Trash', 'jd-transcripts'),
            ),
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'menu_icon' => 'dashicons-clipboard',
            'capability_type' => 'post',
            'hierarchical' => false,
            'rewrite' => false,
            'supports' => array('title', 'editor', 'custom-fields'),
            'menu_position' => 5,
        )
    );
}
add_action('init', 'jd_transcripts_create_order_post_type');

/**
 * AJAX Handler for Order Submission
 */
function jd_transcripts_submit_order() {
    // Verify nonce
    if (!wp_verify_nonce($_POST['nonce'], 'jd_transcripts_nonce')) {
        wp_die('Security check failed');
    }
    
    // Sanitize input data
    $order_data = array(
        'name' => sanitize_text_field($_POST['name']),
        'email' => sanitize_email($_POST['email']),
        'service' => sanitize_text_field($_POST['service']),
        'turnaround' => sanitize_text_field($_POST['turnaround']),
        'duration' => intval($_POST['duration']),
        'notes' => sanitize_textarea_field($_POST['notes']),
        'payment_method' => sanitize_text_field($_POST['payment_method']),
        'mpesa_phone' => sanitize_text_field($_POST['mpesa_phone']),
        'total_price' => floatval($_POST['total_price']),
    );
    
    // Create order post
    $order_id = wp_insert_post(array(
        'post_type' => 'jd_order',
        'post_title' => 'Order from ' . $order_data['name'],
        'post_content' => $order_data['notes'],
        'post_status' => 'publish',
        'meta_input' => array(
            'customer_name' => $order_data['name'],
            'customer_email' => $order_data['email'],
            'service_type' => $order_data['service'],
            'turnaround_time' => $order_data['turnaround'],
            'duration_minutes' => $order_data['duration'],
            'payment_method' => $order_data['payment_method'],
            'mpesa_phone' => $order_data['mpesa_phone'],
            'total_price' => $order_data['total_price'],
            'order_status' => 'pending',
            'order_date' => current_time('mysql'),
        )
    ));
    
    if ($order_id) {
        // Send email notification
        jd_transcripts_send_order_notification($order_id, $order_data);
        
        wp_send_json_success(array(
            'message' => 'Order submitted successfully!',
            'order_id' => $order_id
        ));
    } else {
        wp_send_json_error(array(
            'message' => 'Failed to create order. Please try again.'
        ));
    }
}
add_action('wp_ajax_submit_order', 'jd_transcripts_submit_order');
add_action('wp_ajax_nopriv_submit_order', 'jd_transcripts_submit_order');

/**
 * Send Order Notification Email
 */
function jd_transcripts_send_order_notification($order_id, $order_data) {
    $to = 'benjaminoxy21@gmail.com'; // Admin email
    $subject = '🔔 NEW ORDER: ' . ucfirst($order_data['service']) . ' - ' . $order_data['name'] . ' - $' . $order_data['total_price'];
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #1a1a2e; color: #d4af37; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .order-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .detail-row strong { color: #1a1a2e; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>🎯 New Transcription Order</h2>
        </div>
        <div class='content'>
            <h3>Order Details</h3>
            <div class='order-details'>
                <div class='detail-row'><span><strong>Order ID:</strong></span> <span>JD-{$order_id}</span></div>
                <div class='detail-row'><span><strong>Customer Name:</strong></span> <span>{$order_data['name']}</span></div>
                <div class='detail-row'><span><strong>Email:</strong></span> <span>{$order_data['email']}</span></div>
                <div class='detail-row'><span><strong>Service Type:</strong></span> <span>" . ucfirst($order_data['service']) . " Transcription</span></div>
                <div class='detail-row'><span><strong>Duration:</strong></span> <span>{$order_data['duration']} minutes</span></div>
                <div class='detail-row'><span><strong>Turnaround Time:</strong></span> <span>{$order_data['turnaround']}</span></div>
                <div class='detail-row'><span><strong>Total Price:</strong></span> <span>\${$order_data['total_price']}</span></div>
                <div class='detail-row'><span><strong>Payment Method:</strong></span> <span>" . ($order_data['payment_method'] === 'mpesa' ? '📱 M-Pesa (' . $order_data['mpesa_phone'] . ')' : '📄 Invoice Later') . "</span></div>
                <div class='detail-row'><span><strong>Order Date:</strong></span> <span>" . current_time('F j, Y g:i A') . "</span></div>
            </div>
            
            " . (!empty($order_data['notes']) ? "<h4>Additional Notes:</h4><p>{$order_data['notes']}</p>" : "") . "
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Review the order details above</li>
                <li>Contact the customer if you need clarification</li>
                <li>Process the transcription according to the turnaround time</li>
                <li>Update the order status in the admin panel</li>
            </ul>
        </div>
        <div class='footer'>
            <p>This email was sent from the JD Transcripts website order system.</p>
            <p>Order received at: " . current_time('F j, Y g:i A T') . "</p>
        </div>
    </body>
    </html>
    ";
    
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: JD Transcripts <noreply@' . $_SERVER['HTTP_HOST'] . '>',
    );
    
    wp_mail($to, $subject, $message, $headers);
}

/**
 * AJAX Handler for Contact Form
 */
function jd_transcripts_submit_contact() {
    // Verify nonce
    if (!wp_verify_nonce($_POST['nonce'], 'jd_transcripts_nonce')) {
        wp_die('Security check failed');
    }
    
    $name = sanitize_text_field($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $message = sanitize_textarea_field($_POST['message']);
    
    // Send email
    $to = 'benjaminoxy21@gmail.com';
    $subject = 'Contact Form: ' . $name;
    $email_message = "
    <html>
    <body>
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Message:</strong></p>
        <p>{$message}</p>
        <p><strong>Sent:</strong> " . current_time('F j, Y g:i A') . "</p>
    </body>
    </html>
    ";
    
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $name . ' <' . $email . '>',
        'Reply-To: ' . $email,
    );
    
    if (wp_mail($to, $subject, $email_message, $headers)) {
        wp_send_json_success(array('message' => 'Message sent successfully!'));
    } else {
        wp_send_json_error(array('message' => 'Failed to send message. Please try again.'));
    }
}
add_action('wp_ajax_submit_contact', 'jd_transcripts_submit_contact');
add_action('wp_ajax_nopriv_submit_contact', 'jd_transcripts_submit_contact');

/**
 * AJAX Handler for Order Status Update
 */
function jd_transcripts_update_order_status() {
    // Verify nonce
    if (!wp_verify_nonce($_POST['nonce'], 'jd_transcripts_nonce')) {
        wp_die('Security check failed');
    }
    
    // Check user permissions
    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => 'Insufficient permissions'));
    }
    
    $order_id = intval($_POST['order_id']);
    $new_status = sanitize_text_field($_POST['status']);
    
    // Update order status
    $updated = update_post_meta($order_id, 'order_status', $new_status);
    
    if ($updated !== false) {
        wp_send_json_success(array('message' => 'Order status updated successfully'));
    } else {
        wp_send_json_error(array('message' => 'Failed to update order status'));
    }
}
add_action('wp_ajax_update_order_status', 'jd_transcripts_update_order_status');

/**
 * Add Custom Admin Menu for Orders
 */
function jd_transcripts_admin_menu() {
    add_menu_page(
        'JD Transcripts Dashboard',
        'JD Dashboard',
        'manage_options',
        'jd-dashboard',
        'jd_transcripts_dashboard_page',
        'dashicons-analytics',
        3
    );
}
add_action('admin_menu', 'jd_transcripts_admin_menu');

/**
 * Dashboard Page Content
 */
function jd_transcripts_dashboard_page() {
    // Get orders
    $orders = get_posts(array(
        'post_type' => 'jd_order',
        'posts_per_page' => -1,
        'post_status' => 'publish'
    ));
    
    $total_orders = count($orders);
    $pending_orders = 0;
    $total_revenue = 0;
    
    foreach ($orders as $order) {
        $status = get_post_meta($order->ID, 'order_status', true);
        $price = floatval(get_post_meta($order->ID, 'total_price', true));
        
        if ($status === 'pending') {
            $pending_orders++;
        }
        $total_revenue += $price;
    }
    
    ?>
    <div class="wrap">
        <h1>JD Transcripts Dashboard</h1>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
            <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="margin: 0; color: #1a1a2e;">Total Orders</h3>
                <p style="font-size: 2rem; font-weight: bold; color: #d4af37; margin: 10px 0;"><?php echo $total_orders; ?></p>
            </div>
            <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="margin: 0; color: #1a1a2e;">Pending Orders</h3>
                <p style="font-size: 2rem; font-weight: bold; color: #e94560; margin: 10px 0;"><?php echo $pending_orders; ?></p>
            </div>
            <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="margin: 0; color: #1a1a2e;">Total Revenue</h3>
                <p style="font-size: 2rem; font-weight: bold; color: #28a745; margin: 10px 0;">$<?php echo number_format($total_revenue, 2); ?></p>
            </div>
        </div>
        
        <h2>Recent Orders</h2>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach (array_slice($orders, 0, 10) as $order) : ?>
                    <tr>
                        <td>JD-<?php echo $order->ID; ?></td>
                        <td><?php echo get_post_meta($order->ID, 'customer_name', true); ?></td>
                        <td><?php echo ucfirst(get_post_meta($order->ID, 'service_type', true)); ?></td>
                        <td><?php echo get_post_meta($order->ID, 'duration_minutes', true); ?> min</td>
                        <td>$<?php echo get_post_meta($order->ID, 'total_price', true); ?></td>
                        <td><?php echo ucfirst(get_post_meta($order->ID, 'order_status', true)); ?></td>
                        <td><?php echo get_the_date('M j, Y', $order->ID); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        
        <p><a href="<?php echo admin_url('edit.php?post_type=jd_order'); ?>" class="button button-primary">View All Orders</a></p>
    </div>
    <?php
}

/**
 * Customize Login Page
 */
function jd_transcripts_login_logo() {
    ?>
    <style type="text/css">
        #login h1 a, .login h1 a {
            background-image: url('<?php echo get_template_directory_uri(); ?>/assets/images/logo.png');
            height: 80px;
            width: 80px;
            background-size: contain;
            background-repeat: no-repeat;
            padding-bottom: 30px;
        }
        .login {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }
        .login form {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
    <?php
}
add_action('login_enqueue_scripts', 'jd_transcripts_login_logo');

/**
 * Security Enhancements
 */
// Remove WordPress version from head
remove_action('wp_head', 'wp_generator');

// Disable XML-RPC
add_filter('xmlrpc_enabled', '__return_false');

// Remove unnecessary meta tags
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');

/**
 * Performance Optimizations
 */
// Remove query strings from static resources
function jd_transcripts_remove_query_strings($src) {
    $parts = explode('?ver', $src);
    return $parts[0];
}
add_filter('script_loader_src', 'jd_transcripts_remove_query_strings', 15, 1);
add_filter('style_loader_src', 'jd_transcripts_remove_query_strings', 15, 1);

// Defer JavaScript loading
function jd_transcripts_defer_scripts($tag, $handle, $src) {
    $defer_scripts = array('jd-transcripts-script', 'jd-transcripts-mock-server');
    
    if (in_array($handle, $defer_scripts)) {
        return '<script src="' . $src . '" defer></script>' . "\n";
    }
    
    return $tag;
}
add_filter('script_loader_tag', 'jd_transcripts_defer_scripts', 10, 3);

/**
 * Theme Customizer
 */
function jd_transcripts_customize_register($wp_customize) {
    // Add section for theme options
    $wp_customize->add_section('jd_transcripts_options', array(
        'title' => __('JD Transcripts Options', 'jd-transcripts'),
        'priority' => 30,
    ));
    
    // Add setting for contact email
    $wp_customize->add_setting('jd_contact_email', array(
        'default' => 'info@jdtranscripts.com',
        'sanitize_callback' => 'sanitize_email',
    ));
    
    $wp_customize->add_control('jd_contact_email', array(
        'label' => __('Contact Email', 'jd-transcripts'),
        'section' => 'jd_transcripts_options',
        'type' => 'email',
    ));
    
    // Add setting for phone number
    $wp_customize->add_setting('jd_phone_number', array(
        'default' => '+254 712 345 678',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('jd_phone_number', array(
        'label' => __('Phone Number', 'jd-transcripts'),
        'section' => 'jd_transcripts_options',
        'type' => 'text',
    ));
}
add_action('customize_register', 'jd_transcripts_customize_register');

?>