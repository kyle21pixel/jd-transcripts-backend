<?php
// Fix template assignment for Admin Dashboard page
define('WP_USE_THEMES', false);
require_once('C:/xampp/htdocs/jd-transcripts/wp-config.php');
require_once('C:/xampp/htdocs/jd-transcripts/wp-load.php');

echo "<h2>🔧 Fixing Admin Dashboard Template...</h2>";

// Find the admin page
$admin_page = get_page_by_path('admin');

if ($admin_page) {
    echo "<p style='color: green;'>✅ Found Admin Dashboard page (ID: {$admin_page->ID})</p>";
    
    // Set the correct template
    $template_updated = update_post_meta($admin_page->ID, '_wp_page_template', 'page-admin.php');
    
    if ($template_updated) {
        echo "<p style='color: green;'>✅ Template successfully assigned!</p>";
    } else {
        echo "<p style='color: green;'>✅ Template already correctly assigned!</p>";
    }
    
    // Verify template
    $current_template = get_post_meta($admin_page->ID, '_wp_page_template', true);
    echo "<p><strong>Current Template:</strong> $current_template</p>";
    
    echo "<hr>";
    echo "<h3>🎉 ADMIN DASHBOARD IS READY!</h3>";
    echo "<p><a href='http://localhost/jd-transcripts/admin' target='_blank' style='background: #0073aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 18px;'>🎛️ OPEN ADMIN DASHBOARD</a></p>";
    
} else {
    echo "<p style='color: red;'>❌ Admin page not found. Creating it now...</p>";
    
    // Create the page
    $page_data = array(
        'post_title'    => 'Admin Dashboard',
        'post_content'  => '',
        'post_status'   => 'publish',
        'post_type'     => 'page',
        'post_name'     => 'admin'
    );
    
    $page_id = wp_insert_post($page_data);
    
    if ($page_id) {
        update_post_meta($page_id, '_wp_page_template', 'page-admin.php');
        echo "<p style='color: green;'>✅ Admin Dashboard page created with template!</p>";
        echo "<p><a href='http://localhost/jd-transcripts/admin' target='_blank' style='background: #0073aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 18px;'>🎛️ OPEN ADMIN DASHBOARD</a></p>";
    }
}

echo "<style>body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }</style>";
?>