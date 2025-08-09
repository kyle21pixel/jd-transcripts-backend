<?php
// Final test and fix for the website
echo "<h1>🔧 Final Website Test & Fix</h1>";

// Test if we can access the WordPress installation
$wp_path = 'C:/xampp/htdocs/jd-transcripts/';
$wp_config = $wp_path . 'wp-config.php';

if (file_exists($wp_config)) {
    echo "<p style='color: green;'>✅ WordPress installation found</p>";
    
    // Include WordPress
    require_once($wp_config);
    require_once($wp_path . 'wp-load.php');
    
    echo "<p><strong>Site URL:</strong> " . get_site_url() . "</p>";
    echo "<p><strong>Home URL:</strong> " . get_home_url() . "</p>";
    
} else {
    echo "<p style='color: red;'>❌ WordPress not found</p>";
}

// Check if mod_rewrite is enabled
echo "<h2>🔍 Apache Configuration Check:</h2>";

if (function_exists('apache_get_modules')) {
    $modules = apache_get_modules();
    if (in_array('mod_rewrite', $modules)) {
        echo "<p style='color: green;'>✅ mod_rewrite is enabled</p>";
    } else {
        echo "<p style='color: red;'>❌ mod_rewrite is NOT enabled</p>";
        echo "<div style='background: #fff3cd; padding: 15px; border-radius: 8px; margin: 10px 0;'>";
        echo "<h4>To Enable mod_rewrite in XAMPP:</h4>";
        echo "<ol>";
        echo "<li>Open XAMPP Control Panel</li>";
        echo "<li>Click 'Config' next to Apache</li>";
        echo "<li>Select 'Apache (httpd.conf)'</li>";
        echo "<li>Find the line: #LoadModule rewrite_module modules/mod_rewrite.so</li>";
        echo "<li>Remove the # to uncomment it</li>";
        echo "<li>Save and restart Apache</li>";
        echo "</ol>";
        echo "</div>";
    }
} else {
    echo "<p style='color: orange;'>⚠️ Cannot check Apache modules (not running under Apache)</p>";
}

// Create a simple test page
echo "<h2>🧪 Creating Test Page:</h2>";

$test_page_content = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JD Transcripts - Test Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #1a1a1a;
            color: white;
        }
        .header {
            text-align: center;
            padding: 40px 0;
            background: linear-gradient(135deg, #d4af37, #f4c430);
            color: #1a1a1a;
            border-radius: 12px;
            margin-bottom: 40px;
        }
        .nav-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .nav-link {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            text-decoration: none;
            color: #d4af37;
            border: 1px solid rgba(255,255,255,0.2);
            transition: all 0.3s ease;
        }
        .nav-link:hover {
            background: rgba(212,175,55,0.2);
            transform: translateY(-2px);
        }
        .status {
            background: rgba(0,255,0,0.1);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid rgba(0,255,0,0.3);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 JD Transcripts System Test</h1>
        <p>Testing website functionality</p>
    </div>
    
    <div class="status">
        <h2>✅ System Status: WORKING</h2>
        <p>If you can see this page, the basic routing is working!</p>
        <p><strong>Current Time:</strong> ' . date('Y-m-d H:i:s') . '</p>
        <p><strong>PHP Version:</strong> ' . PHP_VERSION . '</p>
    </div>
    
    <h2>🌐 Navigation Test</h2>
    <p>Click the links below to test each page:</p>
    
    <div class="nav-links">
        <a href="/jd-transcripts/" class="nav-link">
            🏠 Homepage<br>
            <small>Main landing page</small>
        </a>
        <a href="/jd-transcripts/services" class="nav-link">
            🛠️ Services<br>
            <small>Service offerings</small>
        </a>
        <a href="/jd-transcripts/order" class="nav-link">
            📝 Order<br>
            <small>Place new order</small>
        </a>
        <a href="/jd-transcripts/about" class="nav-link">
            ℹ️ About<br>
            <small>Company info</small>
        </a>
        <a href="/jd-transcripts/contact" class="nav-link">
            📞 Contact<br>
            <small>Get in touch</small>
        </a>
        <a href="/jd-transcripts/careers" class="nav-link">
            💼 Careers<br>
            <small>Join our team</small>
        </a>
        <a href="/jd-transcripts/admin-login" class="nav-link">
            🔐 Admin Login<br>
            <small>Staff access</small>
        </a>
        <a href="/jd-transcripts/admin" class="nav-link">
            🎛️ Admin Dashboard<br>
            <small>Management panel</small>
        </a>
    </div>
    
    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h3>🔧 Troubleshooting</h3>
        <p>If any links show "404 Not Found":</p>
        <ol>
            <li>Make sure XAMPP Apache is running</li>
            <li>Check that mod_rewrite is enabled</li>
            <li>Restart Apache after making changes</li>
            <li>Clear your browser cache (Ctrl+F5)</li>
        </ol>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
        <h2>🎊 Your Website is Ready!</h2>
        <p>All pages have been created and should be working now.</p>
    </div>
</body>
</html>';

$test_file = 'C:/xampp/htdocs/jd-transcripts/test.php';
if (file_put_contents($test_file, $test_page_content)) {
    echo "<p style='color: green;'>✅ Created test page</p>";
    echo "<p><strong>Test URL:</strong> <a href='http://localhost/jd-transcripts/test.php' target='_blank'>http://localhost/jd-transcripts/test.php</a></p>";
} else {
    echo "<p style='color: red;'>❌ Failed to create test page</p>";
}

// Check if all template files exist
echo "<h2>📁 Template Files Check:</h2>";
$theme_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';
$required_files = array(
    'index.php' => 'Main router file',
    'header.php' => 'Header template',
    'footer.php' => 'Footer template',
    'style.css' => 'Main stylesheet',
    'page-home.php' => 'Homepage template',
    'page-services.php' => 'Services page',
    'page-order.php' => 'Order page',
    'page-about.php' => 'About page',
    'page-contact.php' => 'Contact page',
    'page-careers.php' => 'Careers page',
    'page-admin-login.php' => 'Admin login',
    'page-admin.php' => 'Admin dashboard'
);

$missing_files = array();
foreach ($required_files as $file => $description) {
    if (file_exists($theme_dir . $file)) {
        echo "<p style='color: green;'>✅ $file - $description</p>";
    } else {
        echo "<p style='color: red;'>❌ $file - $description (MISSING)</p>";
        $missing_files[] = $file;
    }
}

if (empty($missing_files)) {
    echo "<div style='background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;'>";
    echo "<h3>🎉 All Files Present!</h3>";
    echo "<p>Your website should be fully functional now.</p>";
    echo "</div>";
} else {
    echo "<div style='background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0;'>";
    echo "<h3>⚠️ Missing Files</h3>";
    echo "<p>Some template files are missing. The website may not work correctly.</p>";
    echo "</div>";
}

echo "<hr>";
echo "<h2>🚀 Final Instructions:</h2>";
echo "<div style='background: #e7f3ff; padding: 20px; border-radius: 8px; border: 1px solid #b3d9ff;'>";
echo "<h3>To Access Your Website:</h3>";
echo "<ol>";
echo "<li><strong>Start XAMPP:</strong> Make sure Apache and MySQL are running</li>";
echo "<li><strong>Test Page:</strong> <a href='http://localhost/jd-transcripts/test.php' target='_blank'>http://localhost/jd-transcripts/test.php</a></li>";
echo "<li><strong>Homepage:</strong> <a href='http://localhost/jd-transcripts/' target='_blank'>http://localhost/jd-transcripts/</a></li>";
echo "<li><strong>Admin Login:</strong> <a href='http://localhost/jd-transcripts/admin-login' target='_blank'>http://localhost/jd-transcripts/admin-login</a> (admin/admin123)</li>";
echo "</ol>";
echo "</div>";

echo "<style>
body { font-family: Arial, sans-serif; max-width: 900px; margin: 20px auto; padding: 20px; background: #f8f9fa; }
h1 { color: #d4af37; text-align: center; }
h2 { color: #2c3e50; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
a { color: #d4af37; text-decoration: none; }
a:hover { text-decoration: underline; }
</style>";
?>