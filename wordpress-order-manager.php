<?php
/**
 * Plugin Name: JD Transcripts Order Manager
 * Description: Professional order management system for JD Legal Transcripts with manager distribution workflow
 * Version: 1.0.0
 * Author: JD Legal Transcripts
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class JDTranscriptsOrderManager {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_ajax_submit_order', array($this, 'handle_order_submission'));
        add_action('wp_ajax_nopriv_submit_order', array($this, 'handle_order_submission'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        register_activation_hook(__FILE__, array($this, 'create_tables'));
    }
    
    public function init() {
        // Initialize plugin
    }
    
    public function enqueue_scripts() {
        wp_enqueue_script('jd-order-manager', plugin_dir_url(__FILE__) . 'js/order-manager.js', array('jquery'), '1.0.0', true);
        wp_localize_script('jd-order-manager', 'jd_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jd_order_nonce')
        ));
    }
    
    public function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Orders table
        $orders_table = $wpdb->prefix . 'jd_orders';
        $orders_sql = "CREATE TABLE $orders_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            order_number varchar(20) NOT NULL,
            client_name varchar(100) NOT NULL,
            client_email varchar(100) NOT NULL,
            service_type varchar(50) NOT NULL,
            turnaround varchar(20) NOT NULL,
            file_path varchar(255) NOT NULL,
            notes text,
            status varchar(20) DEFAULT 'pending',
            assigned_to int(11) DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY order_number (order_number)
        ) $charset_collate;";
        
        // Transcribers table
        $transcribers_table = $wpdb->prefix . 'jd_transcribers';
        $transcribers_sql = "CREATE TABLE $transcribers_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            user_id int(11) NOT NULL,
            name varchar(100) NOT NULL,
            email varchar(100) NOT NULL,
            specialization varchar(100),
            status varchar(20) DEFAULT 'active',
            workload int(11) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY user_id (user_id)
        ) $charset_collate;";
        
        // Order assignments table
        $assignments_table = $wpdb->prefix . 'jd_order_assignments';
        $assignments_sql = "CREATE TABLE $assignments_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            order_id int(11) NOT NULL,
            transcriber_id int(11) NOT NULL,
            assigned_by int(11) NOT NULL,
            assigned_at datetime DEFAULT CURRENT_TIMESTAMP,
            deadline datetime,
            status varchar(20) DEFAULT 'assigned',
            notes text,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($orders_sql);
        dbDelta($transcribers_sql);
        dbDelta($assignments_sql);
    }
    
    public function handle_order_submission() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'jd_order_nonce')) {
            wp_die('Security check failed');
        }
        
        global $wpdb;
        
        // Generate unique order number
        $order_number = 'JD' . date('Y') . sprintf('%06d', rand(1, 999999));
        
        // Handle file upload
        $file_path = '';
        if (!empty($_FILES['file'])) {
            $upload = wp_handle_upload($_FILES['file'], array('test_form' => false));
            if ($upload && !isset($upload['error'])) {
                $file_path = $upload['file'];
            }
        }
        
        // Insert order into database
        $result = $wpdb->insert(
            $wpdb->prefix . 'jd_orders',
            array(
                'order_number' => $order_number,
                'client_name' => sanitize_text_field($_POST['name']),
                'client_email' => sanitize_email($_POST['email']),
                'service_type' => sanitize_text_field($_POST['service']),
                'turnaround' => sanitize_text_field($_POST['turnaround']),
                'file_path' => $file_path,
                'notes' => sanitize_textarea_field($_POST['notes']),
                'status' => 'pending'
            ),
            array('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')
        );
        
        if ($result) {
            // Send notification to manager
            $this->notify_manager_new_order($order_number);
            
            // Send confirmation to client
            $this->send_client_confirmation($_POST['email'], $order_number);
            
            wp_send_json_success(array(
                'message' => 'Order submitted successfully!',
                'order_number' => $order_number
            ));
        } else {
            wp_send_json_error('Failed to submit order. Please try again.');
        }
    }
    
    private function notify_manager_new_order($order_number) {
        $manager_email = get_option('jd_manager_email', get_option('admin_email'));
        $subject = 'New Order Received - ' . $order_number;
        $message = "A new transcription order has been received.\n\n";
        $message .= "Order Number: " . $order_number . "\n";
        $message .= "Please log in to the admin panel to review and assign this order.\n\n";
        $message .= "Admin Panel: " . admin_url('admin.php?page=jd-orders');
        
        wp_mail($manager_email, $subject, $message);
    }
    
    private function send_client_confirmation($email, $order_number) {
        $subject = 'Order Confirmation - ' . $order_number;
        $message = "Thank you for your order!\n\n";
        $message .= "Order Number: " . $order_number . "\n";
        $message .= "We have received your transcription request and will begin processing it shortly.\n\n";
        $message .= "You will receive updates on your order status via email.\n\n";
        $message .= "Best regards,\nJD Legal Transcripts Team";
        
        wp_mail($email, $subject, $message);
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'JD Orders',
            'JD Orders',
            'manage_options',
            'jd-orders',
            array($this, 'orders_page'),
            'dashicons-clipboard',
            30
        );
        
        add_submenu_page(
            'jd-orders',
            'Transcribers',
            'Transcribers',
            'manage_options',
            'jd-transcribers',
            array($this, 'transcribers_page')
        );
        
        add_submenu_page(
            'jd-orders',
            'Settings',
            'Settings',
            'manage_options',
            'jd-settings',
            array($this, 'settings_page')
        );
    }
    
    public function orders_page() {
        global $wpdb;
        
        // Handle order assignment
        if (isset($_POST['assign_order'])) {
            $order_id = intval($_POST['order_id']);
            $transcriber_id = intval($_POST['transcriber_id']);
            $deadline = sanitize_text_field($_POST['deadline']);
            $notes = sanitize_textarea_field($_POST['assignment_notes']);
            
            // Update order status
            $wpdb->update(
                $wpdb->prefix . 'jd_orders',
                array('status' => 'assigned', 'assigned_to' => $transcriber_id),
                array('id' => $order_id),
                array('%s', '%d'),
                array('%d')
            );
            
            // Create assignment record
            $wpdb->insert(
                $wpdb->prefix . 'jd_order_assignments',
                array(
                    'order_id' => $order_id,
                    'transcriber_id' => $transcriber_id,
                    'assigned_by' => get_current_user_id(),
                    'deadline' => $deadline,
                    'notes' => $notes
                ),
                array('%d', '%d', '%d', '%s', '%s')
            );
            
            // Notify transcriber
            $this->notify_transcriber_assignment($order_id, $transcriber_id);
            
            echo '<div class="notice notice-success"><p>Order assigned successfully!</p></div>';
        }
        
        // Get all orders
        $orders = $wpdb->get_results("
            SELECT o.*, t.name as transcriber_name 
            FROM {$wpdb->prefix}jd_orders o 
            LEFT JOIN {$wpdb->prefix}jd_transcribers t ON o.assigned_to = t.id 
            ORDER BY o.created_at DESC
        ");
        
        // Get all transcribers
        $transcribers = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}jd_transcribers WHERE status = 'active'");
        
        include plugin_dir_path(__FILE__) . 'templates/orders-page.php';
    }
    
    public function transcribers_page() {
        global $wpdb;
        
        // Handle adding new transcriber
        if (isset($_POST['add_transcriber'])) {
            $user_id = intval($_POST['user_id']);
            $name = sanitize_text_field($_POST['name']);
            $email = sanitize_email($_POST['email']);
            $specialization = sanitize_text_field($_POST['specialization']);
            
            $wpdb->insert(
                $wpdb->prefix . 'jd_transcribers',
                array(
                    'user_id' => $user_id,
                    'name' => $name,
                    'email' => $email,
                    'specialization' => $specialization
                ),
                array('%d', '%s', '%s', '%s')
            );
            
            echo '<div class="notice notice-success"><p>Transcriber added successfully!</p></div>';
        }
        
        $transcribers = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}jd_transcribers ORDER BY name");
        
        include plugin_dir_path(__FILE__) . 'templates/transcribers-page.php';
    }
    
    public function settings_page() {
        if (isset($_POST['save_settings'])) {
            update_option('jd_manager_email', sanitize_email($_POST['manager_email']));
            update_option('jd_company_name', sanitize_text_field($_POST['company_name']));
            update_option('jd_notification_settings', $_POST['notifications']);
            
            echo '<div class="notice notice-success"><p>Settings saved successfully!</p></div>';
        }
        
        include plugin_dir_path(__FILE__) . 'templates/settings-page.php';
    }
    
    private function notify_transcriber_assignment($order_id, $transcriber_id) {
        global $wpdb;
        
        $order = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$wpdb->prefix}jd_orders WHERE id = %d", $order_id));
        $transcriber = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$wpdb->prefix}jd_transcribers WHERE id = %d", $transcriber_id));
        
        if ($order && $transcriber) {
            $subject = 'New Assignment - Order ' . $order->order_number;
            $message = "Hello " . $transcriber->name . ",\n\n";
            $message .= "You have been assigned a new transcription order.\n\n";
            $message .= "Order Number: " . $order->order_number . "\n";
            $message .= "Service Type: " . $order->service_type . "\n";
            $message .= "Turnaround: " . $order->turnaround . "\n";
            $message .= "Client: " . $order->client_name . "\n\n";
            $message .= "Please log in to the system to download the files and begin work.\n\n";
            $message .= "Best regards,\nJD Legal Transcripts Management";
            
            wp_mail($transcriber->email, $subject, $message);
        }
    }
}

// Initialize the plugin
new JDTranscriptsOrderManager();

// Shortcode for order form
function jd_order_form_shortcode() {
    ob_start();
    include plugin_dir_path(__FILE__) . 'templates/order-form.php';
    return ob_get_clean();
}
add_shortcode('jd_order_form', 'jd_order_form_shortcode');
?>