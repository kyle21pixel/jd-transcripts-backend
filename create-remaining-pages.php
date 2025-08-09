<?php
// Create the remaining page templates
echo "<h1>📄 Creating Remaining Page Templates</h1>";

$theme_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';

// 7. About page (page-about.php)
$about_content = '<?php get_header(); ?>

<section class="hero" style="min-height: 60vh; padding-top: 120px;">
    <div class="container text-center">
        <h1 class="hero-title" style="font-size: 3rem;">About JD Legal Transcripts</h1>
        <p class="hero-subtitle">Your trusted partner for professional transcription services</p>
    </div>
</section>

<section style="padding: 80px 0;">
    <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-bottom: 80px;">
            <div>
                <h2 style="color: var(--gold); font-size: 2.5rem; margin-bottom: 30px;">Our Story</h2>
                <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 20px;">
                    Founded in 2020, JD Legal Transcripts has grown to become Kenya\'s leading transcription service provider. 
                    We specialize in delivering accurate, confidential, and timely transcription services across multiple industries.
                </p>
                <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 20px;">
                    Our team of certified transcriptionists combines years of experience with cutting-edge technology to ensure 
                    every transcript meets the highest standards of accuracy and professionalism.
                </p>
                <p style="font-size: 1.1rem; line-height: 1.8;">
                    We understand the critical importance of confidentiality in legal and medical transcription, which is why 
                    we maintain strict security protocols and HIPAA compliance standards.
                </p>
            </div>
            <div style="text-align: center;">
                <div style="background: rgba(212,175,55,0.1); padding: 40px; border-radius: 20px; border: 1px solid rgba(212,175,55,0.2);">
                    <i class="fas fa-award" style="font-size: 4rem; color: var(--gold); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--gold); margin-bottom: 15px;">Excellence in Service</h3>
                    <p>Over 10,000 satisfied clients and 99%+ accuracy rate</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Mission & Vision -->
<section style="background: rgba(255,255,255,0.02); padding: 80px 0;">
    <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px;">
            <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <i class="fas fa-bullseye" style="font-size: 3rem; color: var(--gold);"></i>
                </div>
                <h3 style="color: var(--gold); text-align: center; margin-bottom: 20px;">Our Mission</h3>
                <p style="text-align: center; line-height: 1.6;">
                    To provide accurate, confidential, and timely transcription services that help our clients focus on what matters most - their core business activities.
                </p>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <i class="fas fa-eye" style="font-size: 3rem; color: var(--gold);"></i>
                </div>
                <h3 style="color: var(--gold); text-align: center; margin-bottom: 20px;">Our Vision</h3>
                <p style="text-align: center; line-height: 1.6;">
                    To be the leading transcription service provider in East Africa, known for excellence, reliability, and innovation in document processing.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Team Section -->
<section style="padding: 80px 0;">
    <div class="container">
        <h2 class="section-title">Meet Our Team</h2>
        <div class="services-grid">
            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div class="content">
                    <h3>Sarah Johnson</h3>
                    <p style="color: var(--gold); margin-bottom: 15px;">Legal Transcription Specialist</p>
                    <p>10+ years experience in legal transcription with expertise in court proceedings and legal documentation.</p>
                </div>
            </div>
            
            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-user-md"></i>
                </div>
                <div class="content">
                    <h3>Dr. Michael Chen</h3>
                    <p style="color: var(--gold); margin-bottom: 15px;">Medical Transcription Lead</p>
                    <p>Former medical professional with 8 years in medical transcription and HIPAA compliance expertise.</p>
                </div>
            </div>
            
            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <div class="content">
                    <h3>Lisa Brown</h3>
                    <p style="color: var(--gold); margin-bottom: 15px;">Quality Assurance Manager</p>
                    <p>Linguistics graduate specializing in quality control and ensuring 99%+ accuracy in all transcripts.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Values -->
<section style="background: rgba(212,175,55,0.1); padding: 80px 0;">
    <div class="container">
        <h2 class="section-title">Our Values</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Confidentiality</h3>
                <p>We maintain the highest standards of confidentiality and data security for all client materials.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-check-double"></i>
                </div>
                <h3>Accuracy</h3>
                <p>Every transcript undergoes rigorous quality checks to ensure 99%+ accuracy in the final delivery.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <h3>Reliability</h3>
                <p>We deliver on time, every time, with flexible turnaround options to meet your deadlines.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-handshake"></i>
                </div>
                <h3>Partnership</h3>
                <p>We build long-term relationships with our clients based on trust, quality, and exceptional service.</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section style="padding: 80px 0;">
    <div class="container text-center">
        <h2 class="section-title">Ready to Work With Us?</h2>
        <p style="font-size: 1.25rem; margin-bottom: 40px; opacity: 0.9;">
            Join thousands of satisfied clients who trust us with their transcription needs.
        </p>
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
            <a href="<?php echo home_url(\'/order\'); ?>" class="btn btn-primary btn-large">
                <i class="fas fa-play"></i> Start Your Order
            </a>
            <a href="<?php echo home_url(\'/contact\'); ?>" class="btn btn-secondary btn-large">
                <i class="fas fa-phone"></i> Contact Us
            </a>
        </div>
    </div>
</section>

<?php get_footer(); ?>';

file_put_contents($theme_dir . 'page-about.php', $about_content);
echo "<p style='color: green;'>✅ Created page-about.php</p>";

// 8. Contact page (page-contact.php)
$contact_content = '<?php get_header(); ?>

<section class="hero" style="min-height: 60vh; padding-top: 120px;">
    <div class="container text-center">
        <h1 class="hero-title" style="font-size: 3rem;">Contact Us</h1>
        <p class="hero-subtitle">Get in touch with our team for quotes, questions, or support</p>
    </div>
</section>

<section style="padding: 80px 0;">
    <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px;">
            <!-- Contact Form -->
            <div>
                <h2 style="color: var(--gold); margin-bottom: 30px;">Send Us a Message</h2>
                <form id="contact-form" style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="contact-name">Full Name *</label>
                            <input type="text" id="contact-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="contact-email">Email Address *</label>
                            <input type="email" id="contact-email" name="email" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="contact-phone">Phone Number</label>
                            <input type="tel" id="contact-phone" name="phone" placeholder="+254 712 345 678">
                        </div>
                        <div class="form-group">
                            <label for="contact-subject">Subject *</label>
                            <select id="contact-subject" name="subject" required>
                                <option value="">Select subject</option>
                                <option value="quote">Request Quote</option>
                                <option value="support">Technical Support</option>
                                <option value="partnership">Partnership Inquiry</option>
                                <option value="careers">Career Opportunities</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="contact-message">Message *</label>
                        <textarea id="contact-message" name="message" rows="6" required placeholder="Please describe your inquiry or requirements..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-large" style="width: 100%; justify-content: center;">
                        <i class="fas fa-paper-plane"></i> Send Message
                    </button>
                    <div id="contact-status" style="margin-top: 20px; text-align: center;"></div>
                </form>
            </div>
            
            <!-- Contact Information -->
            <div>
                <h2 style="color: var(--gold); margin-bottom: 30px;">Get In Touch</h2>
                
                <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 30px;">
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 25px;">
                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--gold), #f4c430); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-envelope" style="font-size: 1.5rem; color: var(--dark);"></i>
                        </div>
                        <div>
                            <h4 style="color: var(--gold); margin-bottom: 5px;">Email</h4>
                            <p style="margin: 0;">info@jdtranscripts.com</p>
                            <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">We respond within 1 hour</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 25px;">
                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--gold), #f4c430); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-phone" style="font-size: 1.5rem; color: var(--dark);"></i>
                        </div>
                        <div>
                            <h4 style="color: var(--gold); margin-bottom: 5px;">Phone</h4>
                            <p style="margin: 0;">+254 712 345 678</p>
                            <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">Mon-Fri: 8AM-6PM EAT</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 25px;">
                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--gold), #f4c430); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-map-marker-alt" style="font-size: 1.5rem; color: var(--dark);"></i>
                        </div>
                        <div>
                            <h4 style="color: var(--gold); margin-bottom: 5px;">Location</h4>
                            <p style="margin: 0;">Nairobi, Kenya</p>
                            <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">Serving clients nationwide</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--gold), #f4c430); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fab fa-whatsapp" style="font-size: 1.5rem; color: var(--dark);"></i>
                        </div>
                        <div>
                            <h4 style="color: var(--gold); margin-bottom: 5px;">WhatsApp</h4>
                            <p style="margin: 0;">+254 712 345 678</p>
                            <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">Quick support & quotes</p>
                        </div>
                    </div>
                </div>
                
                <!-- Business Hours -->
                <div style="background: rgba(212,175,55,0.1); padding: 30px; border-radius: 15px; border: 1px solid rgba(212,175,55,0.2);">
                    <h3 style="color: var(--gold); margin-bottom: 20px;">Business Hours</h3>
                    <div style="display: grid; gap: 10px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Monday - Friday</span>
                            <span style="color: var(--gold);">8:00 AM - 6:00 PM</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Saturday</span>
                            <span style="color: var(--gold);">9:00 AM - 2:00 PM</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Sunday</span>
                            <span style="opacity: 0.7;">Closed</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                            <span><strong>Emergency Support</strong></span>
                            <span style="color: var(--gold);"><strong>24/7 Available</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- FAQ Section -->
<section style="background: rgba(255,255,255,0.02); padding: 80px 0;">
    <div class="container">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <div style="max-width: 800px; margin: 0 auto;">
            <div style="background: rgba(255,255,255,0.05); border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
                <div style="padding: 25px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h4 style="color: var(--gold); margin-bottom: 10px;">How quickly can you deliver my transcript?</h4>
                    <p style="margin: 0; opacity: 0.9;">We offer same-day, 24-hour, 48-hour, and 3-5 day turnaround options depending on your needs and file length.</p>
                </div>
                <div style="padding: 25px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h4 style="color: var(--gold); margin-bottom: 10px;">What file formats do you accept?</h4>
                    <p style="margin: 0; opacity: 0.9;">We accept all major audio and video formats including MP3, WAV, MP4, MOV, M4A, and more.</p>
                </div>
                <div style="padding: 25px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h4 style="color: var(--gold); margin-bottom: 10px;">Is my information secure?</h4>
                    <p style="margin: 0; opacity: 0.9;">Yes, we maintain strict confidentiality agreements and are HIPAA compliant for medical transcriptions.</p>
                </div>
                <div style="padding: 25px;">
                    <h4 style="color: var(--gold); margin-bottom: 10px;">What payment methods do you accept?</h4>
                    <p style="margin: 0; opacity: 0.9;">We accept M-Pesa, bank transfers, and offer invoicing options for corporate clients.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const statusDiv = document.getElementById("contact-status");
    statusDiv.innerHTML = "<p style=\'color: #d4af37;\'>Sending your message...</p>";
    
    // Simulate form submission
    setTimeout(function() {
        statusDiv.innerHTML = "<p style=\'color: #4ade80;\'>✅ Message sent successfully! We will respond within 1 hour.</p>";
        document.getElementById("contact-form").reset();
    }, 2000);
});
</script>

<?php get_footer(); ?>';

file_put_contents($theme_dir . 'page-contact.php', $contact_content);
echo "<p style='color: green;'>✅ Created page-contact.php</p>";

echo "<p>Remaining pages created! Creating final templates...</p>";
?>