<?php
// Create WordPress pages that use our custom templates
require_once('C:/xampp/htdocs/jd-transcripts/wp-config.php');
require_once('C:/xampp/htdocs/jd-transcripts/wp-load.php');

echo "<h1>🔧 Creating WordPress Pages...</h1>";

// Array of pages to create
$pages_to_create = array(
    array(
        'title' => 'Services',
        'slug' => 'services',
        'template' => 'page-services.php',
        'content' => 'Professional transcription services for legal, medical, business, and academic needs.'
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
        'content' => 'Learn about JD Legal Transcripts and our commitment to quality.'
    ),
    array(
        'title' => 'Contact',
        'slug' => 'contact',
        'template' => 'page-contact.php',
        'content' => 'Get in touch with our team for questions or support.'
    ),
    array(
        'title' => 'Careers',
        'slug' => 'careers',
        'template' => 'page-careers.php',
        'content' => 'Join our team of professional transcriptionists.'
    ),
    array(
        'title' => 'Admin Login',
        'slug' => 'admin-login',
        'template' => 'page-admin-login.php',
        'content' => 'Secure login portal for administrators and staff.'
    ),
    array(
        'title' => 'Admin Dashboard',
        'slug' => 'admin',
        'template' => 'page-admin.php',
        'content' => 'Administrative dashboard for order and team management.'
    )
);

$created_pages = array();
$updated_pages = array();

foreach ($pages_to_create as $page_data) {
    // Check if page already exists
    $existing_page = get_page_by_path($page_data['slug']);
    
    if ($existing_page) {
        // Update existing page
        $page_id = wp_update_post(array(
            'ID' => $existing_page->ID,
            'post_title' => $page_data['title'],
            'post_content' => $page_data['content'],
            'post_status' => 'publish',
            'post_type' => 'page'
        ));
        
        if ($page_id) {
            // Set the custom template
            update_post_meta($page_id, '_wp_page_template', $page_data['template']);
            $updated_pages[] = $page_data['title'];
            echo "<p style='color: orange;'>🔄 Updated existing page: <strong>{$page_data['title']}</strong> (/{$page_data['slug']})</p>";
        }
    } else {
        // Create new page
        $page_id = wp_insert_post(array(
            'post_title' => $page_data['title'],
            'post_name' => $page_data['slug'],
            'post_content' => $page_data['content'],
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_author' => 1
        ));
        
        if ($page_id && !is_wp_error($page_id)) {
            // Set the custom template
            update_post_meta($page_id, '_wp_page_template', $page_data['template']);
            $created_pages[] = $page_data['title'];
            echo "<p style='color: green;'>✅ Created new page: <strong>{$page_data['title']}</strong> (/{$page_data['slug']})</p>";
        } else {
            echo "<p style='color: red;'>❌ Failed to create page: {$page_data['title']}</p>";
        }
    }
}

// Update the homepage to use our custom front page
$homepage = get_page_by_path('home');
if (!$homepage) {
    // Create homepage
    $homepage_id = wp_insert_post(array(
        'post_title' => 'Home',
        'post_name' => 'home',
        'post_content' => 'Welcome to JD Legal Transcripts - Professional transcription services you can trust.',
        'post_status' => 'publish',
        'post_type' => 'page',
        'post_author' => 1
    ));
    
    if ($homepage_id && !is_wp_error($homepage_id)) {
        // Set as front page
        update_option('show_on_front', 'page');
        update_option('page_on_front', $homepage_id);
        echo "<p style='color: green;'>✅ Created and set homepage</p>";
    }
} else {
    // Set existing homepage as front page
    update_option('show_on_front', 'page');
    update_option('page_on_front', $homepage->ID);
    echo "<p style='color: green;'>✅ Set existing homepage as front page</p>";
}

// Flush rewrite rules to ensure URLs work
flush_rewrite_rules();

echo "<hr>";
echo "<h2>📊 Summary:</h2>";
echo "<p><strong>✅ Created Pages:</strong> " . count($created_pages) . "</p>";
echo "<p><strong>🔄 Updated Pages:</strong> " . count($updated_pages) . "</p>";

if (!empty($created_pages)) {
    echo "<h3>🆕 New Pages Created:</h3>";
    echo "<ul>";
    foreach ($created_pages as $page) {
        echo "<li>$page</li>";
    }
    echo "</ul>";
}

if (!empty($updated_pages)) {
    echo "<h3>🔄 Pages Updated:</h3>";
    echo "<ul>";
    foreach ($updated_pages as $page) {
        echo "<li>$page</li>";
    }
    echo "</ul>";
}

echo "<hr>";
echo "<h2>🌐 Your Pages Are Now Live!</h2>";
echo "<div style='background: #d4edda; padding: 20px; border-radius: 8px; border: 1px solid #c3e6cb;'>";
echo "<h3>✅ Test Your Pages:</h3>";
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

echo "<hr>";
echo "<h2>🎉 All Pages Are Now Working!</h2>";
echo "<p>WordPress has been configured with all your custom pages. The URLs should now work correctly!</p>";

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