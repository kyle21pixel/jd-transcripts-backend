<?php
// Update the header navigation to include all new pages
$dest_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';
$header_file = $dest_dir . 'header.php';

// Read current header content
$header_content = file_get_contents($header_file);

// New navigation HTML with all pages and admin login
$new_navigation = '    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <button class="logo-refresh" onclick="location.reload()" style="background:none;border:none;padding:0;cursor:pointer;">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo-placeholder.svg" alt="JD Transcripts" class="logo">
                </button>
                <div class="logo-text-container">
                    <span class="logo-text">JD Legal</span>
                    <span class="logo-text">Transcripts</span>
                </div>
            </div>
            
            <ul class="nav-menu" id="nav-menu">
                <li class="nav-item">
                    <a href="/jd-transcripts/" class="nav-link">Home</a>
                </li>
                <li class="nav-item dropdown">
                    <a href="/jd-transcripts/services" class="nav-link">Services <i class="fas fa-caret-down"></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="/jd-transcripts/services" class="dropdown-link">All Services</a></li>
                        <li><a href="/jd-transcripts/services#legal" class="dropdown-link">Legal Transcription</a></li>
                        <li><a href="/jd-transcripts/services#medical" class="dropdown-link">Medical Transcription</a></li>
                        <li><a href="/jd-transcripts/services#business" class="dropdown-link">Business Meetings</a></li>
                        <li><a href="/jd-transcripts/services#academic" class="dropdown-link">Academic & Research</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a href="/jd-transcripts/order" class="nav-link">Order</a>
                </li>
                <li class="nav-item">
                    <a href="/jd-transcripts/about" class="nav-link">About</a>
                </li>
                <li class="nav-item">
                    <a href="/jd-transcripts/contact" class="nav-link">Contact</a>
                </li>
                <li class="nav-item">
                    <a href="/jd-transcripts/careers" class="nav-link">Careers</a>
                </li>
            </ul>
            
            <div class="nav-actions">
                <a href="/jd-transcripts/order" class="btn btn-primary nav-cta">Order Now</a>
                <a href="/jd-transcripts/admin-login" class="btn btn-secondary admin-login-btn">
                    <i class="fas fa-user-shield"></i> Admin
                </a>
            </div>
            
            <div class="hamburger" id="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>';

// Replace the old navigation
$pattern = '/<nav class="navbar">.*?<\/nav>/s';
$updated_header = preg_replace($pattern, $new_navigation, $header_content);

// Add additional CSS for the new navigation
$additional_css = '
<style>
/* Enhanced Navigation Styles */
.nav-logo {
    display: flex;
    align-items: center;
    gap: 15px;
}

.logo-text-container {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 15px;
}

.admin-login-btn {
    padding: 8px 16px !important;
    font-size: 14px !important;
    background: rgba(255,255,255,0.1) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    color: var(--gold) !important;
    transition: all 0.3s ease !important;
}

.admin-login-btn:hover {
    background: var(--gold) !important;
    color: var(--dark) !important;
    border-color: var(--gold) !important;
}

.admin-login-btn i {
    margin-right: 5px;
}

.nav-cta {
    padding: 10px 20px !important;
    font-size: 14px !important;
}

/* Dropdown Menu Enhancements */
.dropdown-menu {
    min-width: 220px;
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.dropdown-link {
    padding: 12px 20px;
    transition: all 0.3s ease;
}

.dropdown-link:hover {
    background: rgba(255,215,0,0.1);
    color: var(--gold);
    padding-left: 25px;
}

/* Mobile Navigation */
@media (max-width: 768px) {
    .nav-actions {
        flex-direction: column;
        gap: 10px;
        width: 100%;
        margin-top: 20px;
    }
    
    .nav-cta, .admin-login-btn {
        width: 100%;
        text-align: center;
        justify-content: center;
    }
    
    .nav-menu.active {
        padding-bottom: 20px;
    }
}

/* Active page highlighting */
.nav-link.active {
    color: var(--gold);
    position: relative;
}

.nav-link.active::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gold);
}
</style>';

// Add the CSS before the closing </head> tag
$updated_header = str_replace('</head>', $additional_css . '</head>', $updated_header);

// Save the updated header
if (file_put_contents($header_file, $updated_header)) {
    echo "<h2>🧭 Navigation Updated Successfully!</h2>";
    echo "<p style='color: green;'>✅ Header navigation updated with all new pages!</p>";
    
    echo "<hr>";
    echo "<h3>🎯 New Navigation Features:</h3>";
    echo "<ul>";
    echo "<li>✅ <strong>Home</strong> - Main homepage</li>";
    echo "<li>✅ <strong>Services</strong> - Comprehensive services page with dropdown</li>";
    echo "<li>✅ <strong>Order</strong> - Enhanced order form</li>";
    echo "<li>✅ <strong>About</strong> - Company information</li>";
    echo "<li>✅ <strong>Contact</strong> - Contact form and info</li>";
    echo "<li>✅ <strong>Careers</strong> - Job listings and applications</li>";
    echo "<li>✅ <strong>Admin Login</strong> - Secure admin access (top right)</li>";
    echo "</ul>";
    
    echo "<hr>";
    echo "<h3>🎨 Navigation Enhancements:</h3>";
    echo "<ul>";
    echo "<li>✅ Professional admin login button in top right</li>";
    echo "<li>✅ Enhanced dropdown menu for services</li>";
    echo "<li>✅ Mobile-responsive design</li>";
    echo "<li>✅ Active page highlighting</li>";
    echo "<li>✅ Smooth hover animations</li>";
    echo "</ul>";
    
} else {
    echo "<p style='color: red;'>❌ Failed to update header navigation</p>";
}

echo "<style>body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }</style>";
?>