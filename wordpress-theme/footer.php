<!-- Footer -->
<footer class="site-footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3>JD Legal Transcripts</h3>
                <p>Professional transcription services for legal, medical, and business needs. Secure, accurate, and delivered on time.</p>
                <div class="social-links">
                    <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                    <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                    <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
            
            <div class="footer-section">
                <h3>Services</h3>
                <ul>
                    <li><a href="<?php echo home_url('/services#legal'); ?>">Legal Transcription</a></li>
                    <li><a href="<?php echo home_url('/services#medical'); ?>">Medical Transcription</a></li>
                    <li><a href="<?php echo home_url('/services#zoom'); ?>">Zoom Meeting Transcription</a></li>
                    <li><a href="<?php echo home_url('/services#academic'); ?>">Academic & Interview</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Company</h3>
                <ul>
                    <li><a href="<?php echo home_url('/about'); ?>">About Us</a></li>
                    <li><a href="<?php echo home_url('/privacy-policy'); ?>">Privacy Policy</a></li>
                    <li><a href="<?php echo home_url('/terms-of-service'); ?>">Terms of Service</a></li>
                    <li><a href="<?php echo home_url('/careers'); ?>">Careers</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Contact Info</h3>
                <div class="contact-info">
                    <p><i class="fas fa-phone"></i> (555) 123-4567</p>
                    <p><i class="fas fa-envelope"></i> info@jdlegaltranscripts.com</p>
                    <p><i class="fas fa-map-marker-alt"></i> 123 Business Ave<br>Suite 100<br>City, State 12345</p>
                </div>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved. | Designed with ❤️ for professional transcription services.</p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>

<script>
// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    
    // Add active class to current nav item
    const currentLocation = location.pathname;
    const menuItems = document.querySelectorAll('.nav-link');
    
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentLocation) {
            item.classList.add('active');
        }
    });
});
</script>

<style>
/* Additional Footer Styles */
.social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
}

.social-links a:hover {
    background: var(--gold);
    color: white;
    transform: translateY(-2px);
}

.contact-info p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.contact-info i {
    color: var(--gold);
    width: 16px;
}

/* Mobile Menu Styles */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 80px;
        left: -100%;
        width: 100%;
        height: calc(100vh - 80px);
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding-top: 2rem;
        transition: left 0.3s ease;
        z-index: 999;
    }
    
    .nav-menu.active {
        left: 0;
    }
    
    .nav-menu .nav-item {
        margin: 1rem 0;
    }
    
    .nav-menu .nav-link {
        font-size: 1.2rem;
        padding: 1rem 2rem;
    }
    
    .hamburger {
        display: flex;
        flex-direction: column;
        cursor: pointer;
        gap: 4px;
    }
    
    .hamburger .bar {
        width: 25px;
        height: 3px;
        background: var(--navy-blue);
        transition: all 0.3s ease;
        border-radius: 2px;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .nav-cta {
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;
    }
}

@media (min-width: 769px) {
    .hamburger {
        display: none;
    }
}
</style>

</body>
</html>