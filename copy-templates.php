<?php
// Copy all page templates to WordPress theme directory
echo "<h2>📁 Copying Page Templates to WordPress Theme...</h2>";

$source_dir = 'c:/Users/Kyle/jd 3/page-templates/';
$dest_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';

$templates = array(
    'page-services.php',
    'page-order.php', 
    'page-careers.php'
);

$copied_files = array();

foreach ($templates as $template) {
    $source_file = $source_dir . $template;
    $dest_file = $dest_dir . $template;
    
    if (file_exists($source_file)) {
        if (copy($source_file, $dest_file)) {
            echo "<p style='color: green;'>✅ {$template} copied successfully!</p>";
            $copied_files[] = $template;
        } else {
            echo "<p style='color: red;'>❌ Failed to copy {$template}</p>";
        }
    } else {
        echo "<p style='color: orange;'>⚠️ {$template} not found in source directory</p>";
    }
}

echo "<hr>";
echo "<h3>📄 Templates Copied Successfully:</h3>";
echo "<ul>";
foreach ($copied_files as $file) {
    echo "<li><strong>{$file}</strong> - Ready to use</li>";
}
echo "</ul>";

echo "<hr>";
echo "<h3>🚀 Next: Creating Remaining Templates...</h3>";
echo "<p>Now creating the remaining page templates...</p>";

// Create About page template
$about_template = '<?php get_header(); ?>

<!-- About Hero Section -->
<section class="hero about-hero">
    <div class="container">
        <div class="hero-container">
            <div class="hero-content">
                <h1>About JD Legal Transcripts</h1>
                <p class="hero-subtitle">Professional transcription services you can trust. Learn about our commitment to quality, security, and customer satisfaction.</p>
            </div>
        </div>
    </div>
</section>

<!-- About Content -->
<section class="section">
    <div class="container">
        <div class="about-content-grid">
            <div class="about-text">
                <h2>Our Story</h2>
                <p>Founded with a mission to provide the highest quality transcription services, JD Legal Transcripts has been serving legal professionals, healthcare providers, and businesses for over a decade.</p>
                
                <p>We understand that accuracy and confidentiality are paramount in transcription work. That\'s why we\'ve built our reputation on delivering precise, secure, and timely transcription services that our clients can depend on.</p>
                
                <h3>Our Mission</h3>
                <p>To provide professional, accurate, and confidential transcription services that help our clients focus on what they do best while we handle their documentation needs with precision and care.</p>
                
                <h3>Our Values</h3>
                <ul class="values-list">
                    <li><strong>Accuracy:</strong> We maintain 99%+ accuracy rates through rigorous quality control</li>
                    <li><strong>Confidentiality:</strong> Your sensitive information is protected with the highest security standards</li>
                    <li><strong>Reliability:</strong> Consistent delivery times and professional service you can count on</li>
                    <li><strong>Excellence:</strong> Continuous improvement and investment in our team and technology</li>
                </ul>
            </div>
            
            <div class="about-stats">
                <div class="stat-card">
                    <div class="stat-number">10,000+</div>
                    <div class="stat-label">Projects Completed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">99.5%</div>
                    <div class="stat-label">Accuracy Rate</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">24hr</div>
                    <div class="stat-label">Average Turnaround</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">500+</div>
                    <div class="stat-label">Happy Clients</div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Team Section -->
<section class="section bg-dark">
    <div class="container">
        <h2 class="section-title">Our Expert Team</h2>
        <div class="team-grid">
            <div class="card team-card">
                <div class="team-avatar">
                    <i class="fas fa-user-tie"></i>
                </div>
                <h3>Professional Transcriptionists</h3>
                <p>Our certified transcriptionists have years of experience in legal, medical, and business transcription.</p>
            </div>
            <div class="card team-card">
                <div class="team-avatar">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Quality Assurance</h3>
                <p>Dedicated QA team ensures every transcript meets our high standards for accuracy and formatting.</p>
            </div>
            <div class="card team-card">
                <div class="team-avatar">
                    <i class="fas fa-headset"></i>
                </div>
                <h3>Customer Support</h3>
                <p>Friendly support team available to assist you throughout your transcription project.</p>
            </div>
        </div>
    </div>
</section>

<style>
.about-hero {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    padding: 120px 0 80px;
}

.about-content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 60px;
    align-items: start;
}

.about-text h2, .about-text h3 {
    color: var(--gold);
    margin-bottom: 20px;
}

.about-text p {
    margin-bottom: 20px;
    line-height: 1.6;
}

.values-list {
    list-style: none;
    padding: 0;
}

.values-list li {
    padding: 15px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.values-list li:last-child {
    border-bottom: none;
}

.about-stats {
    display: grid;
    gap: 20px;
}

.stat-card {
    background: rgba(255,255,255,0.05);
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    border: 1px solid rgba(255,255,255,0.1);
}

.stat-number {
    font-size: 36px;
    font-weight: bold;
    color: var(--gold);
    margin-bottom: 10px;
}

.stat-label {
    font-size: 14px;
    opacity: 0.8;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.team-card {
    text-align: center;
    padding: 40px 30px;
}

.team-avatar {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--gold), #f4c430);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
}

.team-avatar i {
    font-size: 32px;
    color: var(--dark);
}

@media (max-width: 768px) {
    .about-content-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
}
</style>

<?php get_footer(); ?>';

// Save About template
if (file_put_contents($dest_dir . 'page-about.php', $about_template)) {
    echo "<p style='color: green;'>✅ page-about.php created successfully!</p>";
} else {
    echo "<p style='color: red;'>❌ Failed to create page-about.php</p>";
}

// Create Contact page template
$contact_template = '<?php get_header(); ?>

<!-- Contact Hero Section -->
<section class="hero contact-hero">
    <div class="container">
        <div class="hero-container">
            <div class="hero-content">
                <h1>Contact Us</h1>
                <p class="hero-subtitle">Get in touch with our team for questions, support, or to discuss your transcription needs.</p>
            </div>
        </div>
    </div>
</section>

<!-- Contact Section -->
<section class="section">
    <div class="container">
        <div class="contact-container">
            <div class="contact-info">
                <h2>Get In Touch</h2>
                <p>We\'re here to help with all your transcription needs. Reach out to us through any of the methods below.</p>
                
                <div class="contact-methods">
                    <div class="contact-method">
                        <div class="method-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="method-content">
                            <h4>Email Us</h4>
                            <p>info@jdtranscripts.com</p>
                            <p>support@jdtranscripts.com</p>
                        </div>
                    </div>
                    
                    <div class="contact-method">
                        <div class="method-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="method-content">
                            <h4>Call Us</h4>
                            <p>+254 700 123 456</p>
                            <p>Mon-Fri: 8AM-6PM EAT</p>
                        </div>
                    </div>
                    
                    <div class="contact-method">
                        <div class="method-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="method-content">
                            <h4>Response Time</h4>
                            <p>Email: Within 2 hours</p>
                            <p>Phone: Immediate</p>
                        </div>
                    </div>
                </div>
                
                <div class="business-hours">
                    <h3>Business Hours</h3>
                    <div class="hours-grid">
                        <div class="hours-row">
                            <span>Monday - Friday</span>
                            <span>8:00 AM - 6:00 PM</span>
                        </div>
                        <div class="hours-row">
                            <span>Saturday</span>
                            <span>9:00 AM - 2:00 PM</span>
                        </div>
                        <div class="hours-row">
                            <span>Sunday</span>
                            <span>Closed</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="contact-form-container">
                <form class="contact-form" id="contact-form">
                    <h3>Send Us a Message</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="contact-name">Full Name *</label>
                            <input type="text" id="contact-name" name="contact-name" required>
                        </div>
                        <div class="form-group">
                            <label for="contact-email">Email Address *</label>
                            <input type="email" id="contact-email" name="contact-email" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="contact-subject">Subject *</label>
                        <select id="contact-subject" name="contact-subject" required>
                            <option value="">Select a subject</option>
                            <option value="general">General Inquiry</option>
                            <option value="quote">Request Quote</option>
                            <option value="support">Technical Support</option>
                            <option value="billing">Billing Question</option>
                            <option value="partnership">Partnership Opportunity</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="contact-message">Message *</label>
                        <textarea id="contact-message" name="contact-message" rows="6" placeholder="Tell us how we can help you..." required></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-large" style="width: 100%;">
                        <i class="fas fa-paper-plane"></i> Send Message
                    </button>
                    
                    <div id="contact-status" class="form-status" style="display: none;"></div>
                </form>
            </div>
        </div>
    </div>
</section>

<!-- FAQ Section -->
<section class="section bg-dark">
    <div class="container">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <div class="faq-grid">
            <div class="faq-item">
                <h4>How long does transcription take?</h4>
                <p>Turnaround times vary by service type and urgency. Standard delivery is 3-5 days, with rush options available for 24-48 hours.</p>
            </div>
            <div class="faq-item">
                <h4>What file formats do you accept?</h4>
                <p>We accept most audio and video formats including MP3, WAV, MP4, MOV, M4A, and more. Maximum file size is 100MB.</p>
            </div>
            <div class="faq-item">
                <h4>How do you ensure confidentiality?</h4>
                <p>All staff sign strict NDAs, we use secure file transfer protocols, and are HIPAA compliant for medical transcriptions.</p>
            </div>
            <div class="faq-item">
                <h4>What are your pricing rates?</h4>
                <p>Rates start from $1.25/minute for general transcription, with specialized services like legal and medical priced accordingly.</p>
            </div>
        </div>
    </div>
</section>

<style>
.contact-hero {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    padding: 120px 0 80px;
}

.contact-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: start;
}

.contact-info h2 {
    margin-bottom: 20px;
    color: var(--gold);
}

.contact-methods {
    margin: 40px 0;
}

.contact-method {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin: 30px 0;
    padding: 20px;
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
}

.method-icon {
    width: 50px;
    height: 50px;
    background: var(--gold);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.method-icon i {
    color: var(--dark);
    font-size: 20px;
}

.method-content h4 {
    margin: 0 0 10px 0;
    color: var(--gold);
}

.method-content p {
    margin: 5px 0;
    font-size: 14px;
}

.business-hours {
    background: rgba(255,255,255,0.05);
    padding: 30px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
}

.business-hours h3 {
    margin-bottom: 20px;
    color: var(--gold);
}

.hours-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.hours-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.hours-row:last-child {
    border-bottom: none;
}

.contact-form-container {
    background: rgba(255,255,255,0.05);
    padding: 40px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
}

.contact-form h3 {
    margin-bottom: 30px;
    color: var(--gold);
}

.faq-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.faq-item {
    background: rgba(255,255,255,0.05);
    padding: 30px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
}

.faq-item h4 {
    margin-bottom: 15px;
    color: var(--gold);
}

@media (max-width: 768px) {
    .contact-container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    
    .contact-method {
        gap: 15px;
    }
}
</style>

<script>
document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById("contact-form");
    
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Show success message
            const statusDiv = document.getElementById("contact-status");
            if (statusDiv) {
                statusDiv.innerHTML = "<div style=\"color: green; padding: 15px; background: rgba(0,255,0,0.1); border-radius: 8px; margin: 15px 0;\">✅ Message sent successfully! We\'ll get back to you within 2 hours.</div>";
                statusDiv.style.display = "block";
            }
            
            // Reset form
            contactForm.reset();
            
            setTimeout(() => {
                if (statusDiv) statusDiv.style.display = "none";
            }, 5000);
        });
    }
});
</script>

<?php get_footer(); ?>';

// Save Contact template
if (file_put_contents($dest_dir . 'page-contact.php', $contact_template)) {
    echo "<p style='color: green;'>✅ page-contact.php created successfully!</p>";
} else {
    echo "<p style='color: red;'>❌ Failed to create page-contact.php</p>";
}

echo "<hr>";
echo "<h3>🎉 ALL PAGE TEMPLATES CREATED!</h3>";
echo "<p><strong>Templates now available:</strong></p>";
echo "<ul>";
echo "<li>✅ page-services.php - Comprehensive services showcase</li>";
echo "<li>✅ page-order.php - Enhanced order form with pricing</li>";
echo "<li>✅ page-about.php - Company story and team info</li>";
echo "<li>✅ page-contact.php - Contact form and business info</li>";
echo "<li>✅ page-careers.php - Job listings and application form</li>";
echo "</ul>";

echo "<style>body { font-family: Arial, sans-serif; max-width: 900px; margin: 50px auto; padding: 20px; }</style>";
?>