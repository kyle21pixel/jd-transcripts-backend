<?php
// Create all template files for the website
echo "<h1>📄 Creating All Template Files</h1>";

$theme_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';

// 2. Header template (header.php)
$header_content = '<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo(\'charset\'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title(\'|\', true, \'right\'); ?><?php bloginfo(\'name\'); ?></title>
    <meta name="description" content="Professional transcription services for legal, medical, and business needs. Fast, accurate, and confidential.">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Lora:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Theme Stylesheet -->
    <link rel="stylesheet" href="<?php echo get_stylesheet_uri(); ?>">
    
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Navigation -->
<nav class="navbar" id="navbar">
    <div class="nav-container">
        <div class="nav-logo">
            <button class="logo-refresh" onclick="location.reload()" style="background:none;border:none;padding:0;cursor:pointer;">
                <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=80&h=80&q=80" alt="JD Transcripts" class="logo">
            </button>
            <div class="logo-text-container">
                <span class="logo-text">JD Legal</span>
                <span class="logo-text">Transcripts</span>
            </div>
        </div>
        
        <ul class="nav-menu" id="nav-menu">
            <li class="nav-item">
                <a href="<?php echo home_url(); ?>" class="nav-link">Home</a>
            </li>
            <li class="nav-item dropdown">
                <a href="<?php echo home_url(\'/services\'); ?>" class="nav-link">Services <i class="fas fa-caret-down"></i></a>
                <ul class="dropdown-menu">
                    <li><a href="<?php echo home_url(\'/services\'); ?>" class="dropdown-link">All Services</a></li>
                    <li><a href="<?php echo home_url(\'/services#legal\'); ?>" class="dropdown-link">Legal Transcription</a></li>
                    <li><a href="<?php echo home_url(\'/services#medical\'); ?>" class="dropdown-link">Medical Transcription</a></li>
                    <li><a href="<?php echo home_url(\'/services#business\'); ?>" class="dropdown-link">Business Meetings</a></li>
                    <li><a href="<?php echo home_url(\'/services#academic\'); ?>" class="dropdown-link">Academic & Research</a></li>
                </ul>
            </li>
            <li class="nav-item">
                <a href="<?php echo home_url(\'/order\'); ?>" class="nav-link">Order</a>
            </li>
            <li class="nav-item">
                <a href="<?php echo home_url(\'/about\'); ?>" class="nav-link">About</a>
            </li>
            <li class="nav-item">
                <a href="<?php echo home_url(\'/contact\'); ?>" class="nav-link">Contact</a>
            </li>
            <li class="nav-item">
                <a href="<?php echo home_url(\'/careers\'); ?>" class="nav-link">Careers</a>
            </li>
        </ul>
        
        <div class="nav-actions">
            <a href="<?php echo home_url(\'/order\'); ?>" class="btn btn-primary nav-cta">Order Now</a>
            <a href="<?php echo home_url(\'/admin-login\'); ?>" class="btn btn-secondary admin-login-btn">
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

file_put_contents($theme_dir . 'header.php', $header_content);
echo "<p style='color: green;'>✅ Created header.php</p>";

// 3. Footer template (footer.php)
$footer_content = '<!-- Footer -->
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3>JD Legal Transcripts</h3>
                <p>Professional transcription services for legal, medical, and business needs. Fast, accurate, and confidential.</p>
                <div style="margin-top: 20px;">
                    <a href="#" style="margin-right: 15px; font-size: 1.5rem;"><i class="fab fa-facebook"></i></a>
                    <a href="#" style="margin-right: 15px; font-size: 1.5rem;"><i class="fab fa-twitter"></i></a>
                    <a href="#" style="margin-right: 15px; font-size: 1.5rem;"><i class="fab fa-linkedin"></i></a>
                    <a href="#" style="font-size: 1.5rem;"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
            
            <div class="footer-section">
                <h3>Services</h3>
                <ul>
                    <li><a href="<?php echo home_url(\'/services#legal\'); ?>">Legal Transcription</a></li>
                    <li><a href="<?php echo home_url(\'/services#medical\'); ?>">Medical Transcription</a></li>
                    <li><a href="<?php echo home_url(\'/services#business\'); ?>">Business Meetings</a></li>
                    <li><a href="<?php echo home_url(\'/services#academic\'); ?>">Academic & Research</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Company</h3>
                <ul>
                    <li><a href="<?php echo home_url(\'/about\'); ?>">About Us</a></li>
                    <li><a href="<?php echo home_url(\'/careers\'); ?>">Careers</a></li>
                    <li><a href="<?php echo home_url(\'/contact\'); ?>">Contact</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Contact Info</h3>
                <p><i class="fas fa-envelope"></i> info@jdtranscripts.com</p>
                <p><i class="fas fa-phone"></i> +254 712 345 678</p>
                <p><i class="fas fa-map-marker-alt"></i> Nairobi, Kenya</p>
                <p><i class="fas fa-clock"></i> Mon-Fri: 8AM-6PM EAT</p>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; <?php echo date(\'Y\'); ?> JD Legal Transcripts. All rights reserved.</p>
        </div>
    </div>
</footer>

<!-- JavaScript -->
<script>
// Mobile menu toggle
document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", function() {
            navMenu.classList.toggle("active");
        });
    }
    
    // File upload handling
    const fileUpload = document.getElementById("file-upload");
    const fileInput = document.getElementById("file");
    const fileList = document.getElementById("file-list");
    
    if (fileUpload && fileInput) {
        fileUpload.addEventListener("click", function() {
            fileInput.click();
        });
        
        fileUpload.addEventListener("dragover", function(e) {
            e.preventDefault();
            fileUpload.style.borderColor = "#d4af37";
            fileUpload.style.background = "rgba(212,175,55,0.1)";
        });
        
        fileUpload.addEventListener("dragleave", function(e) {
            e.preventDefault();
            fileUpload.style.borderColor = "rgba(255,255,255,0.1)";
            fileUpload.style.background = "transparent";
        });
        
        fileUpload.addEventListener("drop", function(e) {
            e.preventDefault();
            fileUpload.style.borderColor = "rgba(255,255,255,0.1)";
            fileUpload.style.background = "transparent";
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                displayFiles(files);
            }
        });
        
        fileInput.addEventListener("change", function() {
            displayFiles(this.files);
        });
    }
    
    function displayFiles(files) {
        if (!fileList) return;
        
        fileList.innerHTML = "";
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileItem = document.createElement("div");
            fileItem.className = "file-item";
            fileItem.innerHTML = `
                <i class="fas fa-file"></i>
                <span>${file.name}</span>
                <span class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
            `;
            fileList.appendChild(fileItem);
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll(\'a[href^="#"]\').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
});

// Pricing calculator
function calculatePrice() {
    const service = document.getElementById("service")?.value;
    const turnaround = document.getElementById("turnaround")?.value;
    
    if (!service || !turnaround) return;
    
    let basePrice = 0;
    switch(service) {
        case "legal": basePrice = 1.50; break;
        case "medical": basePrice = 1.75; break;
        case "zoom": basePrice = 1.25; break;
        case "academic": basePrice = 1.25; break;
        default: basePrice = 1.50;
    }
    
    let multiplier = 1;
    switch(turnaround) {
        case "same-day": multiplier = 1.5; break;
        case "24h": multiplier = 1.25; break;
        case "48h": multiplier = 1.1; break;
        case "3-5": multiplier = 1; break;
    }
    
    const finalPrice = (basePrice * multiplier).toFixed(2);
    const priceDisplay = document.getElementById("price-display");
    if (priceDisplay) {
        priceDisplay.innerHTML = `<strong>Estimated Price: $${finalPrice}/minute</strong>`;
        priceDisplay.style.color = "#d4af37";
        priceDisplay.style.marginTop = "15px";
        priceDisplay.style.fontSize = "18px";
    }
}

// Add event listeners for price calculation
document.addEventListener("DOMContentLoaded", function() {
    const serviceSelect = document.getElementById("service");
    const turnaroundSelect = document.getElementById("turnaround");
    
    if (serviceSelect) serviceSelect.addEventListener("change", calculatePrice);
    if (turnaroundSelect) turnaroundSelect.addEventListener("change", calculatePrice);
});
</script>

<?php wp_footer(); ?>
</body>
</html>';

file_put_contents($theme_dir . 'footer.php', $footer_content);
echo "<p style='color: green;'>✅ Created footer.php</p>";

// 4. Homepage template (page-home.php)
$homepage_content = '<?php get_header(); ?>

<!-- Hero Section -->
<section id="home" class="hero">
    <div class="hero-container">
        <div class="hero-content">
            <h1 class="hero-title">Precision Transcription for Law, Medicine, and Meetings</h1>
            <p class="hero-subtitle">
                Secure, fast, and trusted transcription services that transform your audio into accurate, professional text.
            </p>
            <div class="hero-buttons">
                <a href="<?php echo home_url(\'/order\'); ?>" class="btn btn-primary btn-large">Order Now</a>
                <a href="<?php echo home_url(\'/services\'); ?>" class="btn btn-secondary btn-large">Explore Services</a>
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
            <div class="feature-card fade-in-up">
                <div class="feature-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Secure & Confidential</h3>
                <p>HIPAA compliant with strict confidentiality agreements and secure file handling.</p>
            </div>
            <div class="feature-card fade-in-up">
                <div class="feature-icon">
                    <i class="fas fa-bolt"></i>
                </div>
                <h3>Fast Turnaround</h3>
                <p>Same-day to 3-5 day delivery options to meet your urgent deadlines.</p>
            </div>
            <div class="feature-card fade-in-up">
                <div class="feature-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>99%+ Accuracy</h3>
                <p>Professional transcriptionists with expertise in legal and medical terminology.</p>
            </div>
            <div class="feature-card fade-in-up">
                <div class="feature-icon">
                    <i class="fas fa-user-tie"></i>
                </div>
                <h3>Expert Team</h3>
                <p>Certified transcriptionists with years of experience in specialized fields.</p>
            </div>
        </div>
    </div>
</section>

<!-- Quick Services Preview -->
<section class="services" style="padding: 80px 0;">
    <div class="container">
        <h2 class="section-title">Our Services</h2>
        <div class="services-grid">
            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-gavel"></i>
                </div>
                <div class="content">
                    <h3>Legal Transcription</h3>
                    <p>Court proceedings, depositions, legal briefs, and all legal documentation needs.</p>
                    <div class="service-meta">
                        <span><strong>From:</strong> $1.50/minute</span>
                        <span><strong>Turnaround:</strong> 24-48 hours</span>
                    </div>
                    <a href="<?php echo home_url(\'/order\'); ?>" class="btn btn-primary">Order Now</a>
                </div>
            </div>
            
            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-user-md"></i>
                </div>
                <div class="content">
                    <h3>Medical Transcription</h3>
                    <p>HIPAA-compliant medical transcription services for healthcare professionals.</p>
                    <div class="service-meta">
                        <span><strong>From:</strong> $1.75/minute</span>
                        <span><strong>Turnaround:</strong> 24-72 hours</span>
                    </div>
                    <a href="<?php echo home_url(\'/order\'); ?>" class="btn btn-primary">Order Now</a>
                </div>
            </div>
            
            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-video"></i>
                </div>
                <div class="content">
                    <h3>Business Meetings</h3>
                    <p>Accurate transcription of meetings, webinars, and online conferences.</p>
                    <div class="service-meta">
                        <span><strong>From:</strong> $1.25/minute</span>
                        <span><strong>Turnaround:</strong> 24 hours</span>
                    </div>
                    <a href="<?php echo home_url(\'/order\'); ?>" class="btn btn-primary">Order Now</a>
                </div>
            </div>
        </div>
        
        <div class="text-center" style="margin-top: 40px;">
            <a href="<?php echo home_url(\'/services\'); ?>" class="btn btn-secondary btn-large">View All Services</a>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section style="background: rgba(212,175,55,0.1); padding: 80px 0;">
    <div class="container text-center">
        <h2 class="section-title">Ready to Get Started?</h2>
        <p style="font-size: 1.25rem; margin-bottom: 40px; opacity: 0.9;">
            Join thousands of satisfied clients who trust us with their transcription needs.
        </p>
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
            <a href="<?php echo home_url(\'/order\'); ?>" class="btn btn-primary btn-large">
                <i class="fas fa-play"></i> Start Your Order
            </a>
            <a href="<?php echo home_url(\'/contact\'); ?>" class="btn btn-secondary btn-large">
                <i class="fas fa-phone"></i> Get Quote
            </a>
        </div>
    </div>
</section>

<?php get_footer(); ?>';

file_put_contents($theme_dir . 'page-home.php', $homepage_content);
echo "<p style='color: green;'>✅ Created page-home.php</p>";

echo "<p>Templates created successfully! Creating more files...</p>";
?>