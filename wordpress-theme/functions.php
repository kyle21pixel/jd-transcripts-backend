<?php
/**
 * JD Legal Transcripts Theme Functions
 * 
 * @package JD_Legal_Transcripts
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
    // Add theme support for various features
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));
    add_theme_support('custom-logo');
    add_theme_support('customize-selective-refresh-widgets');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'jd-transcripts'),
        'footer' => __('Footer Menu', 'jd-transcripts'),
    ));
    
    // Add support for responsive embeds
    add_theme_support('responsive-embeds');
    
    // Add support for editor styles
    add_theme_support('editor-styles');
    add_editor_style('style.css');
}
add_action('after_setup_theme', 'jd_transcripts_setup');

/**
 * Enqueue Scripts and Styles
 */
function jd_transcripts_scripts() {
    // Enqueue Google Fonts
    wp_enqueue_style('jd-google-fonts', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Lora:wght@400;500;600&display=swap', array(), null);
    
    // Enqueue Font Awesome
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', array(), '6.4.0');
    
    // Enqueue theme stylesheet
    wp_enqueue_style('jd-transcripts-style', get_stylesheet_uri(), array(), wp_get_theme()->get('Version'));
    
    // Enqueue theme JavaScript
    wp_enqueue_script('jd-transcripts-script', get_template_directory_uri() . '/js/theme.js', array('jquery'), wp_get_theme()->get('Version'), true);
    
    // Localize script for AJAX
    wp_localize_script('jd-transcripts-script', 'jd_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('jd_nonce'),
    ));
}
add_action('wp_enqueue_scripts', 'jd_transcripts_scripts');

/**
 * Register Widget Areas
 */
function jd_transcripts_widgets_init() {
    register_sidebar(array(
        'name'          => __('Sidebar', 'jd-transcripts'),
        'id'            => 'sidebar-1',
        'description'   => __('Add widgets here.', 'jd-transcripts'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
    
    register_sidebar(array(
        'name'          => __('Footer Widget Area', 'jd-transcripts'),
        'id'            => 'footer-widgets',
        'description'   => __('Add widgets here to appear in your footer.', 'jd-transcripts'),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'jd_transcripts_widgets_init');

/**
 * Custom Post Type for Orders
 */
function jd_create_order_post_type() {
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
            'supports' => array('title', 'editor', 'custom-fields'),
            'has_archive' => false,
            'rewrite' => false,
        )
    );
}
add_action('init', 'jd_create_order_post_type');

/**
 * Add Custom Meta Boxes for Orders
 */
function jd_add_order_meta_boxes() {
    add_meta_box(
        'jd_order_details',
        __('Order Details', 'jd-transcripts'),
        'jd_order_details_callback',
        'jd_order',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'jd_add_order_meta_boxes');

/**
 * Order Details Meta Box Callback
 */
function jd_order_details_callback($post) {
    wp_nonce_field('jd_save_order_details', 'jd_order_nonce');
    
    $client_name = get_post_meta($post->ID, '_client_name', true);
    $client_email = get_post_meta($post->ID, '_client_email', true);
    $service_type = get_post_meta($post->ID, '_service_type', true);
    $turnaround = get_post_meta($post->ID, '_turnaround', true);
    $order_status = get_post_meta($post->ID, '_order_status', true);
    $assigned_to = get_post_meta($post->ID, '_assigned_to', true);
    $file_url = get_post_meta($post->ID, '_file_url', true);
    
    ?>
    <table class="form-table">
        <tr>
            <th><label for="client_name"><?php _e('Client Name', 'jd-transcripts'); ?></label></th>
            <td><input type="text" id="client_name" name="client_name" value="<?php echo esc_attr($client_name); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="client_email"><?php _e('Client Email', 'jd-transcripts'); ?></label></th>
            <td><input type="email" id="client_email" name="client_email" value="<?php echo esc_attr($client_email); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="service_type"><?php _e('Service Type', 'jd-transcripts'); ?></label></th>
            <td>
                <select id="service_type" name="service_type">
                    <option value="legal" <?php selected($service_type, 'legal'); ?>><?php _e('Legal Transcription', 'jd-transcripts'); ?></option>
                    <option value="medical" <?php selected($service_type, 'medical'); ?>><?php _e('Medical Transcription', 'jd-transcripts'); ?></option>
                    <option value="zoom" <?php selected($service_type, 'zoom'); ?>><?php _e('Zoom Meeting', 'jd-transcripts'); ?></option>
                    <option value="academic" <?php selected($service_type, 'academic'); ?>><?php _e('Academic & Interview', 'jd-transcripts'); ?></option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="turnaround"><?php _e('Turnaround Time', 'jd-transcripts'); ?></label></th>
            <td>
                <select id="turnaround" name="turnaround">
                    <option value="same-day" <?php selected($turnaround, 'same-day'); ?>><?php _e('Same Day', 'jd-transcripts'); ?></option>
                    <option value="24h" <?php selected($turnaround, '24h'); ?>><?php _e('24 Hours', 'jd-transcripts'); ?></option>
                    <option value="48h" <?php selected($turnaround, '48h'); ?>><?php _e('48 Hours', 'jd-transcripts'); ?></option>
                    <option value="3-5" <?php selected($turnaround, '3-5'); ?>><?php _e('3-5 Days', 'jd-transcripts'); ?></option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="order_status"><?php _e('Order Status', 'jd-transcripts'); ?></label></th>
            <td>
                <select id="order_status" name="order_status">
                    <option value="pending" <?php selected($order_status, 'pending'); ?>><?php _e('Pending', 'jd-transcripts'); ?></option>
                    <option value="assigned" <?php selected($order_status, 'assigned'); ?>><?php _e('Assigned', 'jd-transcripts'); ?></option>
                    <option value="in-progress" <?php selected($order_status, 'in-progress'); ?>><?php _e('In Progress', 'jd-transcripts'); ?></option>
                    <option value="completed" <?php selected($order_status, 'completed'); ?>><?php _e('Completed', 'jd-transcripts'); ?></option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="assigned_to"><?php _e('Assigned To', 'jd-transcripts'); ?></label></th>
            <td>
                <select id="assigned_to" name="assigned_to">
                    <option value=""><?php _e('Select Transcriber', 'jd-transcripts'); ?></option>
                    <?php
                    $users = get_users(array('role' => 'transcriber'));
                    foreach ($users as $user) {
                        echo '<option value="' . $user->ID . '" ' . selected($assigned_to, $user->ID, false) . '>' . $user->display_name . '</option>';
                    }
                    ?>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="file_url"><?php _e('File URL', 'jd-transcripts'); ?></label></th>
            <td><input type="url" id="file_url" name="file_url" value="<?php echo esc_attr($file_url); ?>" class="regular-text" /></td>
        </tr>
    </table>
    <?php
}

/**
 * Save Order Meta Data
 */
function jd_save_order_details($post_id) {
    if (!isset($_POST['jd_order_nonce']) || !wp_verify_nonce($_POST['jd_order_nonce'], 'jd_save_order_details')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    $fields = array('client_name', 'client_email', 'service_type', 'turnaround', 'order_status', 'assigned_to', 'file_url');
    
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
        }
    }
}
add_action('save_post', 'jd_save_order_details');

/**
 * Add Custom User Roles
 */
function jd_add_custom_roles() {
    add_role('transcriber', __('Transcriber', 'jd-transcripts'), array(
        'read' => true,
        'edit_posts' => false,
        'delete_posts' => false,
    ));
    
    add_role('manager', __('Manager', 'jd-transcripts'), array(
        'read' => true,
        'edit_posts' => true,
        'delete_posts' => true,
        'edit_others_posts' => true,
        'publish_posts' => true,
        'manage_categories' => true,
    ));
}
add_action('init', 'jd_add_custom_roles');

/**
 * Handle Order Form Submission
 */
function jd_handle_order_submission() {
    if (!isset($_POST['jd_order_nonce']) || !wp_verify_nonce($_POST['jd_order_nonce'], 'jd_order_form')) {
        wp_die(__('Security check failed', 'jd-transcripts'));
    }
    
    $name = sanitize_text_field($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $service = sanitize_text_field($_POST['service']);
    $turnaround = sanitize_text_field($_POST['turnaround']);
    $notes = sanitize_textarea_field($_POST['notes']);
    
    // Handle file upload
    $file_url = '';
    if (!empty($_FILES['file']['name'])) {
        $uploaded_file = wp_handle_upload($_FILES['file'], array('test_form' => false));
        if ($uploaded_file && !isset($uploaded_file['error'])) {
            $file_url = $uploaded_file['url'];
        }
    }
    
    // Create order post
    $order_id = wp_insert_post(array(
        'post_title' => sprintf(__('Order from %s', 'jd-transcripts'), $name),
        'post_content' => $notes,
        'post_status' => 'publish',
        'post_type' => 'jd_order',
    ));
    
    if ($order_id) {
        // Save order meta
        update_post_meta($order_id, '_client_name', $name);
        update_post_meta($order_id, '_client_email', $email);
        update_post_meta($order_id, '_service_type', $service);
        update_post_meta($order_id, '_turnaround', $turnaround);
        update_post_meta($order_id, '_order_status', 'pending');
        update_post_meta($order_id, '_file_url', $file_url);
        
        // Send notification email to admin
        $admin_email = get_option('admin_email');
        $subject = __('New Order Received', 'jd-transcripts');
        $message = sprintf(
            __('A new order has been received from %s (%s). Service: %s. Please check the admin panel for details.', 'jd-transcripts'),
            $name,
            $email,
            $service
        );
        wp_mail($admin_email, $subject, $message);
        
        wp_redirect(add_query_arg('order_submitted', '1', wp_get_referer()));
        exit;
    }
}
add_action('wp_ajax_jd_submit_order', 'jd_handle_order_submission');
add_action('wp_ajax_nopriv_jd_submit_order', 'jd_handle_order_submission');

/**
 * Customize Admin Menu
 */
function jd_customize_admin_menu() {
    // Add custom admin page for order management
    add_menu_page(
        __('Order Management', 'jd-transcripts'),
        __('Orders', 'jd-transcripts'),
        'manage_options',
        'jd-orders',
        'jd_orders_admin_page',
        'dashicons-clipboard',
        6
    );
}
add_action('admin_menu', 'jd_customize_admin_menu');

/**
 * Order Management Admin Page
 */
function jd_orders_admin_page() {
    $orders = get_posts(array(
        'post_type' => 'jd_order',
        'posts_per_page' => -1,
        'post_status' => 'publish',
    ));
    
    ?>
    <div class="wrap">
        <h1><?php _e('Order Management', 'jd-transcripts'); ?></h1>
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th><?php _e('Order ID', 'jd-transcripts'); ?></th>
                    <th><?php _e('Client', 'jd-transcripts'); ?></th>
                    <th><?php _e('Service', 'jd-transcripts'); ?></th>
                    <th><?php _e('Status', 'jd-transcripts'); ?></th>
                    <th><?php _e('Assigned To', 'jd-transcripts'); ?></th>
                    <th><?php _e('Date', 'jd-transcripts'); ?></th>
                    <th><?php _e('Actions', 'jd-transcripts'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($orders as $order) : 
                    $client_name = get_post_meta($order->ID, '_client_name', true);
                    $client_email = get_post_meta($order->ID, '_client_email', true);
                    $service_type = get_post_meta($order->ID, '_service_type', true);
                    $order_status = get_post_meta($order->ID, '_order_status', true);
                    $assigned_to = get_post_meta($order->ID, '_assigned_to', true);
                    $assigned_user = $assigned_to ? get_user_by('ID', $assigned_to) : null;
                ?>
                <tr>
                    <td><strong>#JD<?php echo $order->ID; ?></strong></td>
                    <td>
                        <?php echo esc_html($client_name); ?><br>
                        <small><?php echo esc_html($client_email); ?></small>
                    </td>
                    <td><?php echo esc_html(ucfirst($service_type)); ?></td>
                    <td>
                        <span class="status-<?php echo esc_attr($order_status); ?>">
                            <?php echo esc_html(ucfirst(str_replace('-', ' ', $order_status))); ?>
                        </span>
                    </td>
                    <td><?php echo $assigned_user ? esc_html($assigned_user->display_name) : __('Unassigned', 'jd-transcripts'); ?></td>
                    <td><?php echo get_the_date('M j, Y', $order); ?></td>
                    <td>
                        <a href="<?php echo get_edit_post_link($order->ID); ?>" class="button button-small">
                            <?php _e('Edit', 'jd-transcripts'); ?>
                        </a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    
    <style>
        .status-pending { color: #d63384; font-weight: bold; }
        .status-assigned { color: #0d6efd; font-weight: bold; }
        .status-in-progress { color: #fd7e14; font-weight: bold; }
        .status-completed { color: #198754; font-weight: bold; }
    </style>
    <?php
}

/**
 * Add Custom CSS to Admin
 */
function jd_admin_styles() {
    echo '<style>
        .status-pending { 
            background: #fed7d7; 
            color: #c53030; 
            padding: 4px 8px; 
            border-radius: 12px; 
            font-size: 11px; 
            font-weight: bold; 
            text-transform: uppercase; 
        }
        .status-assigned { 
            background: #bee3f8; 
            color: #2b6cb0; 
            padding: 4px 8px; 
            border-radius: 12px; 
            font-size: 11px; 
            font-weight: bold; 
            text-transform: uppercase; 
        }
        .status-in-progress { 
            background: #faf089; 
            color: #975a16; 
            padding: 4px 8px; 
            border-radius: 12px; 
            font-size: 11px; 
            font-weight: bold; 
            text-transform: uppercase; 
        }
        .status-completed { 
            background: #c6f6d5; 
            color: #276749; 
            padding: 4px 8px; 
            border-radius: 12px; 
            font-size: 11px; 
            font-weight: bold; 
            text-transform: uppercase; 
        }
    </style>';
}
add_action('admin_head', 'jd_admin_styles');

/**
 * Enqueue Admin Scripts
 */
function jd_admin_scripts($hook) {
    if ('toplevel_page_jd-orders' === $hook) {
        wp_enqueue_script('jd-admin-script', get_template_directory_uri() . '/js/admin.js', array('jquery'), wp_get_theme()->get('Version'), true);
    }
}
add_action('admin_enqueue_scripts', 'jd_admin_scripts');

/**
 * Handle Career Application Submission
 */
function jd_handle_career_application() {
    if (!isset($_POST['jd_career_nonce']) || !wp_verify_nonce($_POST['jd_career_nonce'], 'jd_career_form')) {
        wp_die(__('Security check failed', 'jd-transcripts'));
    }
    
    $first_name = sanitize_text_field($_POST['first_name']);
    $last_name = sanitize_text_field($_POST['last_name']);
    $email = sanitize_email($_POST['email']);
    $phone = sanitize_text_field($_POST['phone']);
    $position = sanitize_text_field($_POST['position']);
    $experience = sanitize_text_field($_POST['experience']);
    $cover_letter = sanitize_textarea_field($_POST['cover_letter']);
    $availability = sanitize_text_field($_POST['availability']);
    
    // Handle resume upload
    $resume_url = '';
    if (!empty($_FILES['resume']['name'])) {
        $uploaded_file = wp_handle_upload($_FILES['resume'], array('test_form' => false));
        if ($uploaded_file && !isset($uploaded_file['error'])) {
            $resume_url = $uploaded_file['url'];
        }
    }
    
    // Create application post
    $application_id = wp_insert_post(array(
        'post_title' => sprintf(__('Career Application: %s %s - %s', 'jd-transcripts'), $first_name, $last_name, $position),
        'post_content' => $cover_letter,
        'post_status' => 'publish',
        'post_type' => 'jd_application',
    ));
    
    if ($application_id) {
        // Save application meta
        update_post_meta($application_id, '_first_name', $first_name);
        update_post_meta($application_id, '_last_name', $last_name);
        update_post_meta($application_id, '_email', $email);
        update_post_meta($application_id, '_phone', $phone);
        update_post_meta($application_id, '_position', $position);
        update_post_meta($application_id, '_experience', $experience);
        update_post_meta($application_id, '_availability', $availability);
        update_post_meta($application_id, '_resume_url', $resume_url);
        update_post_meta($application_id, '_application_status', 'pending');
        
        // Send notification email to HR
        $admin_email = get_option('admin_email');
        $subject = __('New Career Application Received', 'jd-transcripts');
        $message = sprintf(
            __('A new career application has been received from %s %s for the position of %s. Please check the admin panel for details.', 'jd-transcripts'),
            $first_name,
            $last_name,
            $position
        );
        wp_mail($admin_email, $subject, $message);
        
        wp_redirect(add_query_arg('application_submitted', '1', wp_get_referer()));
        exit;
    }
}
add_action('wp_ajax_jd_submit_career_application', 'jd_handle_career_application');
add_action('wp_ajax_nopriv_jd_submit_career_application', 'jd_handle_career_application');

/**
 * Create Career Applications Post Type
 */
function jd_create_application_post_type() {
    register_post_type('jd_application',
        array(
            'labels' => array(
                'name' => __('Career Applications', 'jd-transcripts'),
                'singular_name' => __('Application', 'jd-transcripts'),
                'add_new' => __('Add New Application', 'jd-transcripts'),
                'add_new_item' => __('Add New Application', 'jd-transcripts'),
                'edit_item' => __('Edit Application', 'jd-transcripts'),
                'new_item' => __('New Application', 'jd-transcripts'),
                'view_item' => __('View Application', 'jd-transcripts'),
                'search_items' => __('Search Applications', 'jd-transcripts'),
                'not_found' => __('No applications found', 'jd-transcripts'),
                'not_found_in_trash' => __('No applications found in Trash', 'jd-transcripts'),
            ),
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'menu_icon' => 'dashicons-businessman',
            'capability_type' => 'post',
            'hierarchical' => false,
            'supports' => array('title', 'editor', 'custom-fields'),
            'has_archive' => false,
            'rewrite' => false,
        )
    );
}
add_action('init', 'jd_create_application_post_type');
?>