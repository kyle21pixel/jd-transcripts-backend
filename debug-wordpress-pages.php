<?php
// Debug WordPress pages and fix the "page not found" issue
require_once('C:/xampp/htdocs/jd-transcripts/wp-config.php');
require_once('C:/xampp/htdocs/jd-transcripts/wp-load.php');

echo "<h1>🔍 Debugging WordPress Pages...</h1>";

// Check if WordPress is working
echo "<h2>📊 WordPress Status Check:</h2>";
echo "<p><strong>WordPress Version:</strong> " . get_bloginfo('version') . "</p>";
echo "<p><strong>Site URL:</strong> " . get_site_url() . "</p>";
echo "<p><strong>Home URL:</strong> " . get_home_url() . "</p>";
echo "<p><strong>Theme:</strong> " . get_template() . "</p>";

// Check all pages in database
echo "<h2>📄 Pages in Database:</h2>";
$pages = get_pages(array('post_status' => 'publish'));

if (empty($pages)) {
    echo "<p style='color: red;'>❌ No pages found in database!</p>";
    echo "<p>Let me create the pages now...</p>";
    
    // Create pages directly
    $pages_to_create = array(
        array('title' => 'Services', 'slug' => 'services', 'template' => 'page-services.php'),
        array('title' => 'Order', 'slug' => 'order', 'template' => 'page-order.php'),
        array('title' => 'About', 'slug' => 'about', 'template' => 'page-about.php'),
        array('title' => 'Contact', 'slug' => 'contact', 'template' => 'page-contact.php'),
        array('title' => 'Careers', 'slug' => 'careers', 'template' => 'page-careers.php'),
        array('title' => 'Admin Login', 'slug' => 'admin-login', 'template' => 'page-admin-login.php'),
        array('title' => 'Admin Dashboard', 'slug' => 'admin', 'template' => 'page-admin.php')
    );
    
    foreach ($pages_to_create as $page_data) {
        $page_id = wp_insert_post(array(
            'post_title' => $page_data['title'],
            'post_name' => $page_data['slug'],
            'post_content' => 'This is the ' . $page_data['title'] . ' page.',
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_author' => 1
        ));
        
        if ($page_id && !is_wp_error($page_id)) {
            update_post_meta($page_id, '_wp_page_template', $page_data['template']);
            echo "<p style='color: green;'>✅ Created: {$page_data['title']} (ID: $page_id)</p>";
        } else {
            echo "<p style='color: red;'>❌ Failed to create: {$page_data['title']}</p>";
        }
    }
    
    // Refresh pages list
    $pages = get_pages(array('post_status' => 'publish'));
}

echo "<table border='1' style='border-collapse: collapse; width: 100%; margin: 20px 0;'>";
echo "<tr style='background: #f0f0f0;'><th>ID</th><th>Title</th><th>Slug</th><th>Template</th><th>URL</th><th>Status</th></tr>";

foreach ($pages as $page) {
    $template = get_post_meta($page->ID, '_wp_page_template', true);
    $url = get_permalink($page->ID);
    $template_file = get_template_directory() . '/' . $template;
    $template_exists = file_exists($template_file) ? '✅' : '❌';
    
    echo "<tr>";
    echo "<td>{$page->ID}</td>";
    echo "<td>{$page->post_title}</td>";
    echo "<td>{$page->post_name}</td>";
    echo "<td>{$template} {$template_exists}</td>";
    echo "<td><a href='{$url}' target='_blank'>{$url}</a></td>";
    echo "<td>{$page->post_status}</td>";
    echo "</tr>";
}
echo "</table>";

// Check permalink structure
echo "<h2>🔗 Permalink Structure:</h2>";
$permalink_structure = get_option('permalink_structure');
echo "<p><strong>Current Structure:</strong> " . ($permalink_structure ?: 'Plain (default)') . "</p>";

if (empty($permalink_structure)) {
    echo "<p style='color: orange;'>⚠️ Using plain permalinks. Let me set pretty permalinks...</p>";
    update_option('permalink_structure', '/%postname%/');
    flush_rewrite_rules();
    echo "<p style='color: green;'>✅ Updated to pretty permalinks!</p>";
}

// Check theme files
echo "<h2>📁 Theme Template Files:</h2>";
$theme_dir = get_template_directory();
$template_files = array(
    'index.php',
    'page.php', 
    'page-services.php',
    'page-order.php',
    'page-about.php',
    'page-contact.php',
    'page-careers.php',
    'page-admin-login.php',
    'page-admin.php',
    'header.php',
    'footer.php',
    'style.css'
);

echo "<ul>";
foreach ($template_files as $file) {
    $file_path = $theme_dir . '/' . $file;
    $exists = file_exists($file_path) ? '✅' : '❌';
    echo "<li>$exists $file</li>";
}
echo "</ul>";

// Flush rewrite rules
flush_rewrite_rules();
echo "<p style='color: green;'>✅ Flushed rewrite rules</p>";

// Test direct page access
echo "<h2>🧪 Direct Page Tests:</h2>";
echo "<div style='background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;'>";
echo "<h3>Try These Direct Links:</h3>";

$test_pages = array(
    'Homepage' => get_home_url(),
    'Services' => get_home_url() . '/services/',
    'Order' => get_home_url() . '/order/',
    'About' => get_home_url() . '/about/',
    'Contact' => get_home_url() . '/contact/',
    'Careers' => get_home_url() . '/careers/',
    'Admin Login' => get_home_url() . '/admin-login/',
    'Admin Dashboard' => get_home_url() . '/admin/'
);

foreach ($test_pages as $name => $url) {
    echo "<p><strong>$name:</strong> <a href='$url' target='_blank'>$url</a></p>";
}
echo "</div>";

// Check .htaccess
echo "<h2>📝 .htaccess Check:</h2>";
$htaccess_file = ABSPATH . '.htaccess';
if (file_exists($htaccess_file)) {
    echo "<p style='color: green;'>✅ .htaccess file exists</p>";
    $htaccess_content = file_get_contents($htaccess_file);
    if (strpos($htaccess_content, 'RewriteEngine On') !== false) {
        echo "<p style='color: green;'>✅ URL rewriting is enabled</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ URL rewriting may not be properly configured</p>";
    }
} else {
    echo "<p style='color: red;'>❌ .htaccess file not found</p>";
    echo "<p>Creating .htaccess file...</p>";
    
    $htaccess_content = "# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /jd-transcripts/index.php [L]
</IfModule>
# END WordPress";
    
    if (file_put_contents($htaccess_file, $htaccess_content)) {
        echo "<p style='color: green;'>✅ Created .htaccess file</p>";
    } else {
        echo "<p style='color: red;'>❌ Failed to create .htaccess file</p>";
    }
}

echo "<hr>";
echo "<h2>🎯 Troubleshooting Summary:</h2>";
echo "<div style='background: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffeaa7;'>";
echo "<h3>If pages still show 'Not Found':</h3>";
echo "<ol>";
echo "<li><strong>Check Apache mod_rewrite:</strong> Make sure mod_rewrite is enabled in XAMPP</li>";
echo "<li><strong>Restart XAMPP:</strong> Restart Apache after making changes</li>";
echo "<li><strong>Clear browser cache:</strong> Hard refresh (Ctrl+F5) or clear cache</li>";
echo "<li><strong>Check file permissions:</strong> Ensure WordPress can write to .htaccess</li>";
echo "</ol>";
echo "</div>";

echo "<style>
body { font-family: Arial, sans-serif; max-width: 1000px; margin: 20px auto; padding: 20px; }
h1 { color: #d4af37; text-align: center; }
h2 { color: #2c3e50; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
table { border-collapse: collapse; width: 100%; }
th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
th { background-color: #f2f2f2; }
a { color: #d4af37; }
</style>";
?>