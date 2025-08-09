<?php
// Auto-create Admin Dashboard page for JD Transcripts
// This script will create the page with correct settings

// WordPress configuration
define('WP_USE_THEMES', false);
require_once('C:/xampp/htdocs/jd-transcripts/wp-config.php');
require_once('C:/xampp/htdocs/jd-transcripts/wp-load.php');

echo "<h2>🎛️ Creating Admin Dashboard Page...</h2>";

// Check if page already exists
$existing_page = get_page_by_path('admin');
if ($existing_page) {
    echo "<p style='color: orange;'>⚠️ Admin page already exists. Updating it...</p>";
    $page_id = $existing_page->ID;
} else {
    $page_id = null;
}

// Page data
$page_data = array(
    'post_title'    => 'Admin Dashboard',
    'post_content'  => '', // Empty content - template will handle display
    'post_status'   => 'publish',
    'post_type'     => 'page',
    'post_name'     => 'admin', // This sets the URL slug
    'post_author'   => 1,
    'menu_order'    => 0
);

// If updating existing page
if ($page_id) {
    $page_data['ID'] = $page_id;
    $result = wp_update_post($page_data);
} else {
    $result = wp_insert_post($page_data);
}

if ($result && !is_wp_error($result)) {
    echo "<p style='color: green;'>✅ Admin Dashboard page created successfully!</p>";
    echo "<p><strong>Page ID:</strong> $result</p>";
    
    // Set the page template
    $template_set = update_post_meta($result, '_wp_page_template', 'page-admin.php');
    
    if ($template_set) {
        echo "<p style='color: green;'>✅ Admin Dashboard template assigned!</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Template assignment may have failed, but page is created.</p>";
    }
    
    echo "<hr>";
    echo "<h3>🎉 SUCCESS! Your Admin Dashboard is Ready!</h3>";
    echo "<p><strong>Page Title:</strong> Admin Dashboard</p>";
    echo "<p><strong>URL Slug:</strong> admin</p>";
    echo "<p><strong>Template:</strong> Admin Dashboard (page-admin.php)</p>";
    echo "<p><strong>Status:</strong> Published</p>";
    
    echo "<hr>";
    echo "<h3>🚀 Test Your Dashboard:</h3>";
    echo "<p><a href='http://localhost/jd-transcripts/admin' target='_blank' style='background: #0073aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;'>🎛️ Open Admin Dashboard</a></p>";
    
    echo "<p><a href='http://localhost/jd-transcripts' target='_blank' style='background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; margin-left: 10px;'>🏠 View Main Website</a></p>";
    
    echo "<hr>";
    echo "<h3>📋 What You Should See:</h3>";
    echo "<ul>";
    echo "<li>✅ Professional dark dashboard with gold accents</li>";
    echo "<li>✅ Statistics cards (Total Orders, Revenue, Pending Orders)</li>";
    echo "<li>✅ Recent orders section with order cards</li>";
    echo "<li>✅ Executive-style interface</li>";
    echo "<li>✅ Responsive design that works on mobile</li>";
    echo "</ul>";
    
} else {
    echo "<p style='color: red;'>❌ Failed to create page. Error details:</p>";
    if (is_wp_error($result)) {
        echo "<p style='color: red;'>" . $result->get_error_message() . "</p>";
    }
    
    echo "<hr>";
    echo "<h3>🔧 Manual Alternative:</h3>";
    echo "<p>If this didn't work, you can create it manually:</p>";
    echo "<ol>";
    echo "<li>Go to WordPress Admin: <a href='http://localhost/jd-transcripts/wp-admin' target='_blank'>wp-admin</a></li>";
    echo "<li>Pages > Add New</li>";
    echo "<li>Title: Admin Dashboard</li>";
    echo "<li>Template: Admin Dashboard</li>";
    echo "<li>Slug: admin</li>";
    echo "<li>Publish</li>";
    echo "</ol>";
}

echo "<style>";
echo "body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f1f1f1; }";
echo "h2, h3 { color: #333; }";
echo "p { margin: 10px 0; }";
echo "ul, ol { margin: 15px 0; padding-left: 30px; }";
echo "li { margin: 5px 0; }";
echo "</style>";
?>