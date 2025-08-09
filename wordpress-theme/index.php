<?php
/**
 * The main template file
 *
 * @package JD_Legal_Transcripts
 */

get_header(); ?>

<!-- Hero Section -->
<section id="home" class="hero">
    <div class="hero-container">
        <div class="hero-content">
            <h1 class="hero-title">Precision Transcription for Law, Medicine, and Meetings</h1>
            <p class="hero-subtitle">
                Secure, fast, and trusted transcription services that transform your audio into accurate, professional text.
            </p>
            <div class="hero-buttons">
                <a href="<?php echo esc_url(get_permalink(get_page_by_path('order'))); ?>" class="btn btn-primary btn-large">Order Now</a>
                <a href="<?php echo esc_url(get_permalink(get_page_by_path('services'))); ?>" class="btn btn-secondary btn-large">Explore Services</a>
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
<section class="section features">
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
</section>

<!-- Services Section -->
<section id="services" class="section services">
    <div class="container">
        <h2 class="section-title">Our Services</h2>
        <div class="services-grid">
            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-gavel"></i>
                </div>
                <h3>Legal Transcription</h3>
                <p>Court proceedings, depositions, legal briefs, and all legal documentation needs.</p>
                <ul class="service-features">
                    <li>Court hearings and trials</li>
                    <li>Depositions and witness statements</li>
                    <li>Legal briefs and documents</li>
                    <li>Attorney-client meetings</li>
                </ul>
                <div class="service-meta">
                    <span><strong>Turnaround:</strong> 24-48 hours</span>
                    <span><strong>Pricing:</strong> From $1.50/min</span>
                </div>
                <a href="<?php echo esc_url(get_permalink(get_page_by_path('order'))); ?>" class="btn btn-primary">Place Order</a>
            </div>

            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-user-md"></i>
                </div>
                <h3>Medical Transcription</h3>
                <p>HIPAA-compliant medical transcription services for healthcare professionals.</p>
                <ul class="service-features">
                    <li>Doctor-patient consultations</li>
                    <li>Medical dictations</li>
                    <li>Clinical notes and reports</li>
                    <li>Surgical reports</li>
                </ul>
                <div class="service-meta">
                    <span><strong>Turnaround:</strong> 24-72 hours</span>
                    <span><strong>Pricing:</strong> From $1.75/min</span>
                </div>
                <a href="<?php echo esc_url(get_permalink(get_page_by_path('order'))); ?>" class="btn btn-primary">Place Order</a>
            </div>

            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-video"></i>
                </div>
                <h3>Zoom Meeting Transcription</h3>
                <p>Accurate transcription of virtual meetings, webinars, and online conferences.</p>
                <ul class="service-features">
                    <li>Business meetings</li>
                    <li>Webinars and presentations</li>
                    <li>Job interviews</li>
                    <li>Virtual conferences</li>
                </ul>
                <div class="service-meta">
                    <span><strong>Turnaround:</strong> 24 hours</span>
                    <span><strong>Pricing:</strong> From $1.25/min</span>
                </div>
                <a href="<?php echo esc_url(get_permalink(get_page_by_path('order'))); ?>" class="btn btn-primary">Place Order</a>
            </div>

            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h3>Academic & Interview</h3>
                <p>Specialized transcription services for academic research and interviews.</p>
                <ul class="service-features">
                    <li>Research interviews</li>
                    <li>Academic lectures</li>
                    <li>Focus group discussions</li>
                    <li>Oral histories</li>
                </ul>
                <div class="service-meta">
                    <span><strong>Turnaround:</strong> 3-5 days</span>
                    <span><strong>Pricing:</strong> From $1.25/min</span>
                </div>
                <a href="<?php echo esc_url(get_permalink(get_page_by_path('order'))); ?>" class="btn btn-primary">Place Order</a>
            </div>
        </div>
    </div>
</section>

<!-- About Section -->
<section id="about" class="section about">
    <div class="container">
        <div class="about-content">
            <div class="about-text">
                <h2 class="section-title">About JD Legal Transcripts</h2>
                <p>With over a decade of experience in professional transcription services, JD Legal Transcripts has become the trusted partner for law firms, medical practices, and businesses across the country.</p>
                
                <p>Our team of certified transcriptionists specializes in legal and medical terminology, ensuring accuracy and confidentiality in every project. We understand the critical nature of your documents and the importance of meeting tight deadlines.</p>
                
                <div class="about-stats">
                    <div class="stat-item">
                        <div class="stat-number">10,000+</div>
                        <div class="stat-label">Projects Completed</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">99.5%</div>
                        <div class="stat-label">Accuracy Rate</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">24/7</div>
                        <div class="stat-label">Support Available</div>
                    </div>
                </div>
            </div>
            
            <div class="about-image">
                <div class="image-placeholder">
                    <i class="fas fa-users"></i>
                    <p>Professional Team</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Contact Section -->
<section id="contact" class="section contact">
    <div class="container">
        <h2 class="section-title">Get In Touch</h2>
        <div class="contact-content">
            <div class="contact-info">
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div class="contact-details">
                        <h4>Phone</h4>
                        <p>(555) 123-4567</p>
                    </div>
                </div>
                
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="contact-details">
                        <h4>Email</h4>
                        <p>info@jdlegaltranscripts.com</p>
                    </div>
                </div>
                
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="contact-details">
                        <h4>Business Hours</h4>
                        <p>Monday - Friday: 8AM - 6PM<br>Weekend: Emergency only</p>
                    </div>
                </div>
            </div>
            
            <div class="contact-form">
                <?php echo do_shortcode('[contact-form-7 id="1" title="Contact form 1"]'); ?>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>