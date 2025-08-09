<?php
// Create a simple router system that works without complex WordPress setup
echo "<h1>🚀 Creating Simple Router System...</h1>";

$theme_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';

// Create a simple index.php that handles routing
$router_content = '<?php
// Simple router for JD Transcripts
get_header();

// Get the current page from URL
$request_uri = $_SERVER["REQUEST_URI"];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = trim($path, "/");

// Remove "jd-transcripts" from path if present
$path = str_replace("jd-transcripts/", "", $path);
$path = str_replace("jd-transcripts", "", $path);
$path = trim($path, "/");

// Default to home if empty
if (empty($path)) {
    $path = "home";
}

// Route to appropriate template
switch ($path) {
    case "":
    case "home":
        include get_template_directory() . "/page-home.php";
        break;
    case "services":
        include get_template_directory() . "/page-services.php";
        break;
    case "order":
        include get_template_directory() . "/page-order.php";
        break;
    case "about":
        include get_template_directory() . "/page-about.php";
        break;
    case "contact":
        include get_template_directory() . "/page-contact.php";
        break;
    case "careers":
        include get_template_directory() . "/page-careers.php";
        break;
    case "admin-login":
        include get_template_directory() . "/page-admin-login.php";
        break;
    case "admin":
        include get_template_directory() . "/page-admin.php";
        break;
    default:
        // 404 page
        echo "<div style=\"text-align: center; padding: 100px 20px;\">";
        echo "<h1>404 - Page Not Found</h1>";
        echo "<p>The page you are looking for does not exist.</p>";
        echo "<a href=\"" . home_url() . "\" class=\"btn btn-primary\">Go Home</a>";
        echo "</div>";
        break;
}

get_footer();
?>';

// Save the router
if (file_put_contents($theme_dir . 'index.php', $router_content)) {
    echo "<p style='color: green;'>✅ Created simple router system!</p>";
} else {
    echo "<p style='color: red;'>❌ Failed to create router</p>";
}

// Create a homepage template
$homepage_content = '<!-- Homepage Content -->
<section id="home" class="hero">
    <div class="hero-container">
        <div class="hero-content">
            <h1 class="hero-title">Precision Transcription for Law, Medicine, and Meetings</h1>
            <p class="hero-subtitle">
                Secure, fast, and trusted transcription services that transform your audio into accurate, professional text.
            </p>
            <div class="hero-buttons">
                <a href="<?php echo home_url(\'/order/\'); ?>" class="btn btn-primary btn-large">Order Now</a>
                <a href="<?php echo home_url(\'/services/\'); ?>" class="btn btn-secondary btn-large">Explore Services</a>
            </div>
        </div>
        <div class="hero-visual">
            <div class="hero-graphic">
                <div class="graphic-item">
                    <i class="fas fa-microphone"></i>
                    <span>Audio</span>
                </div>
                <i class="fas fa-arrow-right"></i>
                <div class="graphic-item">
                    <i class="fas fa-file-alt"></i>
                    <span>Transcript</span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="features">
    <div class="container">
        <h2 class="section-title">Why Choose JD Transcripts?</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Secure & Confidential</h3>
                <p>HIPAA compliant with strict confidentiality agreements and secure file handling.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-bolt"></i>
                </div>
                <h3>Fast Turnaround</h3>
                <p>Same-day to 3-5 day delivery options to meet your urgent deadlines.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>99%+ Accuracy</h3>
                <p>Professional transcriptionists with expertise in legal and medical terminology.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-user-tie"></i>
                </div>
                <h3>Expert Team</h3>
                <p>Certified transcriptionists with years of experience in specialized fields.</p>
            </div>
        </div>
    </div>
</section>';

if (file_put_contents($theme_dir . 'page-home.php', $homepage_content)) {
    echo "<p style='color: green;'>✅ Created homepage template!</p>";
} else {
    echo "<p style='color: red;'>❌ Failed to create homepage template</p>";
}

// Create a simple .htaccess for clean URLs
$htaccess_content = "# JD Transcripts URL Rewriting
RewriteEngine On
RewriteBase /jd-transcripts/

# Handle WordPress admin
RewriteRule ^wp-admin/(.*) wp-admin/$1 [L]
RewriteRule ^wp-includes/(.*) wp-includes/$1 [L]
RewriteRule ^wp-content/(.*) wp-content/$1 [L]

# Handle static files
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^.*$ - [L]

# Handle directories
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^.*$ - [L]

# Route everything else to index.php
RewriteRule ^(.*)$ index.php [L]";

$htaccess_file = 'C:/xampp/htdocs/jd-transcripts/.htaccess';
if (file_put_contents($htaccess_file, $htaccess_content)) {
    echo "<p style='color: green;'>✅ Created .htaccess file for clean URLs!</p>";
} else {
    echo "<p style='color: red;'>❌ Failed to create .htaccess file</p>";
}

echo "<hr>";
echo "<h2>🎯 Simple Router System Created!</h2>";
echo "<p>This system bypasses complex WordPress routing and uses a simple PHP router.</p>";

echo "<div style='background: #d4edda; padding: 20px; border-radius: 8px; border: 1px solid #c3e6cb; margin: 20px 0;'>";
echo "<h3>✅ Test Your Pages Now:</h3>";
echo "<ul>";
echo "<li><a href='http://localhost/jd-transcripts/' target='_blank'>🏠 Homepage</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/services' target='_blank'>🛠️ Services</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/order' target='_blank'>📝 Order</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/about' target='_blank'>ℹ️ About</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/contact' target='_blank'>📞 Contact</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/careers' target='_blank'>💼 Careers</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/admin-login' target='_blank'>🔐 Admin Login</a></li>";
echo "<li><a href='http://localhost/jd-transcripts/admin' target='_blank'>🎛️ Admin Dashboard</a></li>";
echo "</ul>";
echo "</div>";

echo "<div style='background: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 20px 0;'>";
echo "<h3>⚠️ If Still Not Working:</h3>";
echo "<ol>";
echo "<li><strong>Restart XAMPP:</strong> Stop and start Apache in XAMPP Control Panel</li>";
echo "<li><strong>Check mod_rewrite:</strong> Make sure mod_rewrite is enabled in Apache</li>";
echo "<li><strong>Clear browser cache:</strong> Hard refresh with Ctrl+F5</li>";
echo "<li><strong>Try direct access:</strong> Go to http://localhost/jd-transcripts/index.php</li>";
echo "</ol>";
echo "</div>";

echo "<style>
body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; }
h1 { color: #d4af37; text-align: center; }
h2 { color: #2c3e50; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
a { color: #d4af37; text-decoration: none; }
a:hover { text-decoration: underline; }
ul { padding-left: 20px; }
li { margin: 8px 0; }
</style>";
?>