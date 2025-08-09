<!-- Footer -->
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3><?php bloginfo('name'); ?></h3>
                <p>Professional transcription services for legal, medical, and business needs. Fast, accurate, and confidential.</p>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <a href="#" style="width: 40px; height: 40px; background: var(--gradient-gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none;">
                        <i class="fab fa-linkedin" style="color: var(--primary-dark);"></i>
                    </a>
                    <a href="#" style="width: 40px; height: 40px; background: var(--gradient-gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none;">
                        <i class="fab fa-twitter" style="color: var(--primary-dark);"></i>
                    </a>
                    <a href="#" style="width: 40px; height: 40px; background: var(--gradient-gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none;">
                        <i class="fab fa-facebook" style="color: var(--primary-dark);"></i>
                    </a>
                </div>
            </div>
            
            <div class="footer-section">
                <h4>Services</h4>
                <ul>
                    <li><a href="#services">Legal Transcription</a></li>
                    <li><a href="#services">Medical Transcription</a></li>
                    <li><a href="#services">Zoom Meeting Transcription</a></li>
                    <li><a href="#services">Academic & Interview</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h4>Company</h4>
                <ul>
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li><a href="<?php echo home_url('/admin'); ?>">Admin Panel</a></li>
                    <li><a href="#order">Place Order</a></li>
                </ul>
            </div>
            
            <div class="footer-section contact-info">
                <h4>Contact Info</h4>
                <ul>
                    <li><i class="fas fa-envelope"></i> info@jdtranscripts.com</li>
                    <li><i class="fas fa-phone"></i> +254 712 345 678</li>
                    <li><i class="fas fa-clock"></i> Mon-Fri: 8AM-6PM EAT</li>
                    <li><i class="fas fa-shield-alt"></i> HIPAA Compliant</li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <div>
                <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.</p>
            </div>
            <div class="footer-legal">
                <a href="<?php echo home_url('/privacy-policy'); ?>">Privacy Policy</a>
                <a href="<?php echo home_url('/terms-of-service'); ?>">Terms of Service</a>
                <a href="<?php echo home_url('/confidentiality'); ?>">Confidentiality</a>
            </div>
        </div>
    </div>
</footer>

<!-- Scripts -->
<script src="<?php echo get_template_directory_uri(); ?>/assets/js/config.js"></script>
<script src="<?php echo get_template_directory_uri(); ?>/assets/js/mock-server.js"></script>
<script src="<?php echo get_template_directory_uri(); ?>/assets/js/script.js"></script>

<?php wp_footer(); ?>

<!-- Analytics (Add your tracking code here) -->
<!-- Google Analytics, Facebook Pixel, etc. -->

</body>
</html>