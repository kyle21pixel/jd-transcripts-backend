<?php
// Create complete multi-page system for JD Transcripts
define('WP_USE_THEMES', false);
require_once('C:/xampp/htdocs/jd-transcripts/wp-config.php');
require_once('C:/xampp/htdocs/jd-transcripts/wp-load.php');

echo "<h2>🚀 Creating Complete Multi-Page System...</h2>";

// Array of pages to create
$pages_to_create = array(
    array(
        'title' => 'Services',
        'slug' => 'services',
        'template' => 'page-services.php',
        'content' => 'Our comprehensive transcription services for legal, medical, and business needs.'
    ),
    array(
        'title' => 'Order',
        'slug' => 'order',
        'template' => 'page-order.php',
        'content' => 'Place your transcription order with our easy-to-use form.'
    ),
    array(
        'title' => 'About',
        'slug' => 'about',
        'template' => 'page-about.php',
        'content' => 'Learn about JD Transcripts and our commitment to quality.'
    ),
    array(
        'title' => 'Contact',
        'slug' => 'contact',
        'template' => 'page-contact.php',
        'content' => 'Get in touch with our team for any questions or support.'
    ),
    array(
        'title' => 'Careers',
        'slug' => 'careers',
        'template' => 'page-careers.php',
        'content' => 'Join our team of professional transcriptionists and grow your career with us.'
    ),
    array(
        'title' => 'Admin Login',
        'slug' => 'admin-login',
        'template' => 'page-admin-login.php',
        'content' => 'Secure login portal for administrators and staff members.'
    )
);

$created_pages = array();

foreach ($pages_to_create as $page_data) {
    // Check if page already exists
    $existing_page = get_page_by_path($page_data['slug']);
    
    if ($existing_page) {
        echo "<p style='color: orange;'>⚠️ {$page_data['title']} page already exists. Updating...</p>";
        $page_id = $existing_page->ID;
        
        // Update existing page
        wp_update_post(array(
            'ID' => $page_id,
            'post_title' => $page_data['title'],
            'post_content' => $page_data['content'],
            'post_name' => $page_data['slug']
        ));
    } else {
        // Create new page
        $page_id = wp_insert_post(array(
            'post_title' => $page_data['title'],
            'post_content' => $page_data['content'],
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_name' => $page_data['slug']
        ));
        
        echo "<p style='color: green;'>✅ {$page_data['title']} page created successfully!</p>";
    }
    
    if ($page_id) {
        // Set page template
        update_post_meta($page_id, '_wp_page_template', $page_data['template']);
        $created_pages[$page_data['slug']] = $page_id;
    }
}

echo "<hr>";
echo "<h3>📄 Pages Created Successfully:</h3>";
echo "<ul>";
foreach ($created_pages as $slug => $id) {
    $title = ucfirst(str_replace('-', ' ', $slug));
    echo "<li><strong>{$title}</strong> - ID: {$id} - URL: <a href='http://localhost/jd-transcripts/{$slug}' target='_blank'>/{$slug}</a></li>";
}
echo "</ul>";

echo "<hr>";
echo "<h3>🎯 Next Steps:</h3>";
echo "<ol>";
echo "<li>✅ <strong>Pages created</strong> - All pages are now in WordPress</li>";
echo "<li>🔄 <strong>Creating page templates</strong> - Individual PHP files for each page</li>";
echo "<li>🎨 <strong>Adding navigation</strong> - Updated menu system</li>";
echo "<li>🔐 <strong>Admin login system</strong> - Secure authentication</li>";
echo "<li>👥 <strong>Job assignment system</strong> - Order delegation features</li>";
echo "</ol>";

echo "<hr>";
echo "<h3>🌐 Your New Website Structure:</h3>";
echo "<ul>";
echo "<li>🏠 <strong>Homepage:</strong> http://localhost/jd-transcripts/</li>";
echo "<li>🛠️ <strong>Services:</strong> http://localhost/jd-transcripts/services</li>";
echo "<li>📝 <strong>Order:</strong> http://localhost/jd-transcripts/order</li>";
echo "<li>ℹ️ <strong>About:</strong> http://localhost/jd-transcripts/about</li>";
echo "<li>📞 <strong>Contact:</strong> http://localhost/jd-transcripts/contact</li>";
echo "<li>💼 <strong>Careers:</strong> http://localhost/jd-transcripts/careers</li>";
echo "<li>🔐 <strong>Admin Login:</strong> http://localhost/jd-transcripts/admin-login</li>";
echo "<li>🎛️ <strong>Admin Dashboard:</strong> http://localhost/jd-transcripts/admin</li>";
echo "</ul>";

echo "<style>body { font-family: Arial, sans-serif; max-width: 900px; margin: 50px auto; padding: 20px; }</style>";
?>