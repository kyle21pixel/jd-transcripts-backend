<?php
/**
 * JD Legal Transcripts WordPress Theme Functions
 * Premium theme with order management integration
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
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    add_theme_support('custom-logo');
    add_theme_support('customize-selective-refresh-widgets');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => esc_html__('Primary Menu', 'jd-transcripts'),
        'footer' => esc_html__('Footer Menu', 'jd-transcripts'),
    ));
}
add_action('after_setup_theme', 'jd_transcripts_setup');

/**
 * Enqueue Scripts and Styles
 */
function jd_transcripts_scripts() {
    // Main stylesheet
    wp_enqueue_style('jd-transcripts-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // Google Fonts
    wp_enqueue_style('jd-google-fonts', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Lora:wght@400;500;600&display=swap', array(), null);
    
    // Font Awesome
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', array(), '6.4.0');
    
    // Main JavaScript
    wp_enqueue_script('jd-transcripts-script', get_template_directory_uri() . '/js/main.js', array('jquery'), '1.0.0', true);
    
    // Localize script for AJAX
    wp_localize_script('jd-transcripts-script', 'jd_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('jd_transcripts_nonce')
    ));
}
add_action('wp_enqueue_scripts', 'jd_transcripts_scripts');

/**
 * Custom Post Types
 */
function jd_transcripts_post_types() {
    // Testimonials
    register_post_type('testimonial', array(
        'labels' => array(
            'name' => 'Testimonials',
            'singular_name' => 'Testimonial',
            'add_new' => 'Add New Testimonial',
            'add_new_item' => 'Add New Testimonial',
            'edit_item' => 'Edit Testimonial',
            'new_item' => 'New Testimonial',
            'view_item' => 'View Testimonial',
            'search_items' => 'Search Testimonials',
            'not_found' => 'No testimonials found',
            'not_found_in_trash' => 'No testimonials found in trash'
        ),
        'public' => true,
        'has_archive' => false,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-format-quote',
        'show_in_rest' => true
    ));
    
    // Team Members
    register_post_type('team_member', array(
        'labels' => array(
            'name' => 'Team Members',
            'singular_name' => 'Team Member',
            'add_new' => 'Add New Member',
            'add_new_item' => 'Add New Team Member',
            'edit_item' => 'Edit Team Member',
            'new_item' => 'New Team Member',
            'view_item' => 'View Team Member',
            'search_items' => 'Search Team Members',
            'not_found' => 'No team members found',
            'not_found_in_trash' => 'No team members found in trash'
        ),
        'public' => true,
        'has_archive' => false,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-groups',
        'show_in_rest' => true
    ));
}
add_action('init', 'jd_transcripts_post_types');

/**
 * Widget Areas
 */
function jd_transcripts_widgets_init() {
    register_sidebar(array(
        'name' => esc_html__('Footer Widget Area 1', 'jd-transcripts'),
        'id' => 'footer-1',
        'description' => esc_html__('Add widgets here to appear in your footer.', 'jd-transcripts'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));
    
    register_sidebar(array(
        'name' => esc_html__('Footer Widget Area 2', 'jd-transcripts'),
        'id' => 'footer-2',
        'description' => esc_html__('Add widgets here to appear in your footer.', 'jd-transcripts'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));
    
    register_sidebar(array(
        'name' => esc_html__('Footer Widget Area 3', 'jd-transcripts'),
        'id' => 'footer-3',
        'description' => esc_html__('Add widgets here to appear in your footer.', 'jd-transcripts'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));
}
add_action('widgets_init', 'jd_transcripts_widgets_init');

/**
 * Customizer Settings
 */
function jd_transcripts_customize_register($wp_customize) {
    // Company Information Section
    $wp_customize->add_section('jd_company_info', array(
        'title' => __('Company Information', 'jd-transcripts'),
        'priority' => 30,
    ));
    
    // Phone Number
    $wp_customize->add_setting('jd_phone', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('jd_phone', array(
        'label' => __('Phone Number', 'jd-transcripts'),
        'section' => 'jd_company_info',
        'type' => 'text',
    ));
    
    // Email Address
    $wp_customize->add_setting('jd_email', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_email',
    ));
    
    $wp_customize->add_control('jd_email', array(
        'label' => __('Email Address', 'jd-transcripts'),
        'section' => 'jd_company_info',
        'type' => 'email',
    ));
    
    // Business Hours
    $wp_customize->add_setting('jd_hours', array(
        'default' => 'Mon-Fri: 9AM-6PM',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('jd_hours', array(
        'label' => __('Business Hours', 'jd-transcripts'),
        'section' => 'jd_company_info',
        'type' => 'text',
    ));
    
    // Social Media Section
    $wp_customize->add_section('jd_social_media', array(
        'title' => __('Social Media', 'jd-transcripts'),
        'priority' => 35,
    ));
    
    // Facebook URL
    $wp_customize->add_setting('jd_facebook', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    
    $wp_customize->add_control('jd_facebook', array(
        'label' => __('Facebook URL', 'jd-transcripts'),
        'section' => 'jd_social_media',
        'type' => 'url',
    ));
    
    // LinkedIn URL
    $wp_customize->add_setting('jd_linkedin', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    
    $wp_customize->add_control('jd_linkedin', array(
        'label' => __('LinkedIn URL', 'jd-transcripts'),
        'section' => 'jd_social_media',
        'type' => 'url',
    ));
    
    // Twitter URL
    $wp_customize->add_setting('jd_twitter', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    
    $wp_customize->add_control('jd_twitter', array(
        'label' => __('Twitter URL', 'jd-transcripts'),
        'section' => 'jd_social_media',
        'type' => 'url',
    ));
}
add_action('customize_register', 'jd_transcripts_customize_register');

/**
 * Custom Admin Styles
 */
function jd_transcripts_admin_styles() {
    echo '<style>
        .jd-admin-header {
            background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
            color: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 10px;
        }
        .jd-admin-header h1 {
            color: white;
            margin: 0;
        }
        .jd-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .jd-stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .jd-stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #1a365d;
        }
        .jd-stat-label {
            color: #666;
            font-size: 0.9rem;
        }
    </style>';
}
add_action('admin_head', 'jd_transcripts_admin_styles');

/**
 * Dashboard Widget
 */
function jd_transcripts_dashboard_widget() {
    global $wpdb;
    
    // Get order statistics
    $pending_orders = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}jd_orders WHERE status = 'pending'");
    $total_orders = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}jd_orders");
    $completed_today = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}jd_orders WHERE status = 'completed' AND DATE(created_at) = CURDATE()");
    
    echo '<div class="jd-admin-header">';
    echo '<h1>🎯 JD Transcripts Dashboard</h1>';
    echo '<p>Welcome to your transcription management system</p>';
    echo '</div>';
    
    echo '<div class="jd-stats-grid">';
    echo '<div class="jd-stat-card">';
    echo '<div class="jd-stat-number">' . $pending_orders . '</div>';
    echo '<div class="jd-stat-label">Pending Orders</div>';
    echo '</div>';
    echo '<div class="jd-stat-card">';
    echo '<div class="jd-stat-number">' . $total_orders . '</div>';
    echo '<div class="jd-stat-label">Total Orders</div>';
    echo '</div>';
    echo '<div class="jd-stat-card">';
    echo '<div class="jd-stat-number">' . $completed_today . '</div>';
    echo '<div class="jd-stat-label">Completed Today</div>';
    echo '</div>';
    echo '</div>';
    
    echo '<p><a href="' . admin_url('admin.php?page=jd-orders') . '" class="button button-primary">Manage Orders</a></p>';
}

function jd_transcripts_add_dashboard_widget() {
    wp_add_dashboard_widget(
        'jd_transcripts_dashboard',
        '📋 JD Transcripts Overview',
        'jd_transcripts_dashboard_widget'
    );
}
add_action('wp_dashboard_setup', 'jd_transcripts_add_dashboard_widget');

/**
 * Custom Login Page Styling
 */
function jd_transcripts_login_styles() {
    echo '<style>
        body.login {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
        .login h1 a {
            background-image: none;
            background-color: #1a365d;
            color: white;
            width: auto;
            height: auto;
            padding: 20px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: bold;
        }
        .login form {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .wp-core-ui .button-primary {
            background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            font-weight: 600;
        }
        .wp-core-ui .button-primary:hover {
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
        }
    </style>';
}
add_action('login_head', 'jd_transcripts_login_styles');

/**
 * Security Enhancements
 */
function jd_transcripts_security() {
    // Remove WordPress version from head
    remove_action('wp_head', 'wp_generator');
    
    // Disable file editing in admin
    if (!defined('DISALLOW_FILE_EDIT')) {
        define('DISALLOW_FILE_EDIT', true);
    }
    
    // Hide login errors
    add_filter('login_errors', function() {
        return 'Invalid login credentials.';
    });
}
add_action('init', 'jd_transcripts_security');

/**
 * Performance Optimizations
 */
function jd_transcripts_performance() {
    // Remove unnecessary scripts and styles
    wp_deregister_script('wp-embed');
    wp_dequeue_style('wp-block-library');
    
    // Optimize images
    add_filter('jpeg_quality', function() {
        return 85;
    });
    
    // Enable Gzip compression
    if (!ob_get_level()) {
        ob_start('ob_gzhandler');
    }
}
add_action('wp_enqueue_scripts', 'jd_transcripts_performance');

/**
 * SEO Enhancements
 */
function jd_transcripts_seo() {
    // Add meta description
    if (is_home() || is_front_page()) {
        echo '<meta name="description" content="Professional transcription services for legal, medical, and business needs. Secure, fast, and trusted audio to text conversion by JD Legal Transcripts.">';
    }
    
    // Add Open Graph tags
    echo '<meta property="og:site_name" content="JD Legal Transcripts">';
    echo '<meta property="og:type" content="website">';
    
    if (is_home() || is_front_page()) {
        echo '<meta property="og:title" content="JD Legal Transcripts - Professional Transcription Services">';
        echo '<meta property="og:description" content="Secure, fast, and trusted transcription services for legal, medical, and business needs.">';
    }
}
add_action('wp_head', 'jd_transcripts_seo');

/**
 * Contact Form Handler
 */
function jd_transcripts_contact_form() {
    if (isset($_POST['contact_submit'])) {
        $name = sanitize_text_field($_POST['contact_name']);
        $email = sanitize_email($_POST['contact_email']);
        $subject = sanitize_text_field($_POST['contact_subject']);
        $message = sanitize_textarea_field($_POST['contact_message']);
        
        $to = get_option('admin_email');
        $email_subject = 'Contact Form: ' . $subject;
        $email_message = "Name: $name\nEmail: $email\n\nMessage:\n$message";
        
        if (wp_mail($to, $email_subject, $email_message)) {
            wp_redirect(add_query_arg('contact', 'success', wp_get_referer()));
            exit;
        } else {
            wp_redirect(add_query_arg('contact', 'error', wp_get_referer()));
            exit;
        }
    }
}
add_action('init', 'jd_transcripts_contact_form');

/**
 * Theme Activation Hook
 */
function jd_transcripts_activation() {
    // Create default pages
    $pages = array(
        'Home' => 'Welcome to JD Legal Transcripts',
        'Services' => 'Our transcription services',
        'Order' => '[jd_order_form]',
        'About' => 'About our company',
        'Contact' => 'Contact us for more information'
    );
    
    foreach ($pages as $title => $content) {
        if (!get_page_by_title($title)) {
            wp_insert_post(array(
                'post_title' => $title,
                'post_content' => $content,
                'post_status' => 'publish',
                'post_type' => 'page'
            ));
        }
    }
    
    // Set front page
    $front_page = get_page_by_title('Home');
    if ($front_page) {
        update_option('show_on_front', 'page');
        update_option('page_on_front', $front_page->ID);
    }
    
    // Flush rewrite rules
    flush_rewrite_rules();
}
add_action('after_switch_theme', 'jd_transcripts_activation');
?>