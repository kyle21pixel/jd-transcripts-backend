</main>

<!-- Footer -->
<footer class="footer">
    <div class="footer-container">
        <div class="footer-content">
            <!-- Company Info -->
            <div class="footer-section">
                <h3 class="footer-title">
                    <i class="fas fa-building"></i>
                    <?php bloginfo('name'); ?>
                </h3>
                <p class="footer-description">
                    <?php bloginfo('description'); ?>
                </p>
                <div class="footer-contact">
                    <?php if (get_theme_mod('jd_phone')): ?>
                        <p><i class="fas fa-phone"></i> <?php echo get_theme_mod('jd_phone'); ?></p>
                    <?php endif; ?>
                    <?php if (get_theme_mod('jd_email')): ?>
                        <p><i class="fas fa-envelope"></i> <?php echo get_theme_mod('jd_email'); ?></p>
                    <?php endif; ?>
                    <?php if (get_theme_mod('jd_hours')): ?>
                        <p><i class="fas fa-clock"></i> <?php echo get_theme_mod('jd_hours'); ?></p>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Quick Links -->
            <div class="footer-section">
                <h3 class="footer-title">
                    <i class="fas fa-link"></i>
                    Quick Links
                </h3>
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'footer',
                    'menu_class' => 'footer-links',
                    'container' => false,
                    'fallback_cb' => 'jd_transcripts_footer_fallback_menu'
                ));
                ?>
            </div>

            <!-- Services -->
            <div class="footer-section">
                <h3 class="footer-title">
                    <i class="fas fa-cogs"></i>
                    Our Services
                </h3>
                <ul class="footer-links">
                    <li><a href="<?php echo home_url('/services#legal'); ?>">Legal Transcription</a></li>
                    <li><a href="<?php echo home_url('/services#medical'); ?>">Medical Transcription</a></li>
                    <li><a href="<?php echo home_url('/services#zoom'); ?>">Zoom Meeting Transcription</a></li>
                    <li><a href="<?php echo home_url('/services#academic'); ?>">Academic & Interview</a></li>
                </ul>
            </div>

            <!-- Newsletter & Social -->
            <div class="footer-section">
                <h3 class="footer-title">
                    <i class="fas fa-envelope-open"></i>
                    Stay Connected
                </h3>
                <p>Subscribe to our newsletter for updates and special offers.</p>
                
                <!-- Newsletter Signup -->
                <form class="newsletter-form" method="post" action="<?php echo admin_url('admin-ajax.php'); ?>">
                    <div class="newsletter-input-group">
                        <input type="email" name="newsletter_email" placeholder="Enter your email" required>
                        <button type="submit" name="newsletter_submit">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <?php wp_nonce_field('newsletter_signup', 'newsletter_nonce'); ?>
                </form>

                <!-- Social Media Links -->
                <div class="social-links">
                    <?php if (get_theme_mod('jd_facebook')): ?>
                        <a href="<?php echo get_theme_mod('jd_facebook'); ?>" target="_blank" rel="noopener" aria-label="Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                    <?php endif; ?>
                    <?php if (get_theme_mod('jd_linkedin')): ?>
                        <a href="<?php echo get_theme_mod('jd_linkedin'); ?>" target="_blank" rel="noopener" aria-label="LinkedIn">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                    <?php endif; ?>
                    <?php if (get_theme_mod('jd_twitter')): ?>
                        <a href="<?php echo get_theme_mod('jd_twitter'); ?>" target="_blank" rel="noopener" aria-label="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
            <div class="footer-bottom-content">
                <div class="footer-copyright">
                    <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.</p>
                </div>
                <div class="footer-legal">
                    <a href="<?php echo home_url('/privacy-policy'); ?>">Privacy Policy</a>
                    <a href="<?php echo home_url('/terms-of-service'); ?>">Terms of Service</a>
                    <a href="<?php echo home_url('/hipaa-compliance'); ?>">HIPAA Compliance</a>
                </div>
            </div>
        </div>
    </div>
</footer>

<!-- Back to Top Button -->
<button id="back-to-top" class="back-to-top" aria-label="Back to top">
    <i class="fas fa-chevron-up"></i>
</button>

<!-- WordPress Footer -->
<?php wp_footer(); ?>

<!-- Custom JavaScript -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form validation and enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });
    
    // Newsletter signup
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            formData.append('action', 'newsletter_signup');
            
            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Thank you for subscribing to our newsletter!');
                    this.reset();
                } else {
                    alert('There was an error. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error. Please try again.');
            });
        });
    }
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData.loadEventEnd - perfData.loadEventStart > 3000) {
                    console.warn('Page load time is slow. Consider optimization.');
                }
            }, 0);
        });
    }
});

// Google Analytics (replace with your tracking ID)
// gtag('config', 'GA_TRACKING_ID');
</script>

<!-- Schema.org Business Hours -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "<?php bloginfo('name'); ?>",
    "description": "<?php bloginfo('description'); ?>",
    "url": "<?php echo home_url(); ?>",
    "telephone": "<?php echo get_theme_mod('jd_phone', ''); ?>",
    "email": "<?php echo get_theme_mod('jd_email', ''); ?>",
    "openingHours": "Mo-Fr 09:00-18:00",
    "priceRange": "$1.25-$1.75 per minute",
    "serviceArea": {
        "@type": "Country",
        "name": "United States"
    }
}
</script>

</body>
</html>

<?php
// Footer fallback menu function
function jd_transcripts_footer_fallback_menu() {
    echo '<ul class="footer-links">';
    echo '<li><a href="' . home_url() . '">Home</a></li>';
    echo '<li><a href="' . home_url('/services') . '">Services</a></li>';
    echo '<li><a href="' . home_url('/order') . '">Order</a></li>';
    echo '<li><a href="' . home_url('/about') . '">About</a></li>';
    echo '<li><a href="' . home_url('/contact') . '">Contact</a></li>';
    echo '</ul>';
}

// Newsletter signup handler
add_action('wp_ajax_newsletter_signup', 'handle_newsletter_signup');
add_action('wp_ajax_nopriv_newsletter_signup', 'handle_newsletter_signup');

function handle_newsletter_signup() {
    if (!wp_verify_nonce($_POST['newsletter_nonce'], 'newsletter_signup')) {
        wp_die('Security check failed');
    }
    
    $email = sanitize_email($_POST['newsletter_email']);
    
    if (!is_email($email)) {
        wp_send_json_error('Invalid email address');
    }
    
    // Add to newsletter list (integrate with your email service)
    // For now, just send a notification to admin
    $subject = 'New Newsletter Subscription';
    $message = "New newsletter subscription from: $email";
    wp_mail(get_option('admin_email'), $subject, $message);
    
    wp_send_json_success('Subscription successful');
}
?>