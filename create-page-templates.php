<?php
// Create all remaining page templates
echo "<h1>📋 Creating Page Templates</h1>";

$theme_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';

// 5. Services page (page-services.php)
$services_content = '<?php get_header(); ?>

<section class="hero" style="min-height: 60vh; padding-top: 120px;">
    <div class="container text-center">
        <h1 class="hero-title" style="font-size: 3rem;">Our Services</h1>
        <p class="hero-subtitle">Professional transcription services tailored to your industry needs</p>
    </div>
</section>

<section class="services" id="services">
    <div class="container">
        <div class="services-grid">
            <div class="service-card" id="legal">
                <div class="service-icon">
                    <i class="fas fa-gavel"></i>
                </div>
                <div class="content">
                    <h3>Legal Transcription</h3>
                    <p>Court proceedings, depositions, legal briefs, and all legal documentation needs.</p>
                    <ul class="service-features">
                        <li>Court hearings and trials</li>
                        <li>Depositions and witness statements</li>
                        <li>Legal briefs and documents</li>
                        <li>Attorney-client meetings</li>
                        <li>Legal dictations</li>
                        <li>Case file documentation</li>
                    </ul>
                    <div class="service-meta">
                        <span><strong>Turnaround:</strong> 24-48 hours</span>
                        <span><strong>Pricing:</strong> From $1.50/min</span>
                        <span><strong>Accuracy:</strong> 99%+</span>
                    </div>
                    <a href="<?php echo home_url(\'/order\'); ?>" class="btn btn-primary">Place Order</a>
                </div>
            </div>

            <div class="service-card" id="medical">
                <div class="service-icon">
                    <i class="fas fa-user-md"></i>
                </div>
                <div class="content">
                    <h3>Medical Transcription</h3>
                    <p>HIPAA-compliant medical transcription services for healthcare professionals.</p>
                    <ul class="service-features">
                        <li>Doctor-patient consultations</li>
                        <li>Medical dictations</li>
                        <li>Clinical notes and reports</li>
                        <li>Surgical reports</li>
                        <li>Medical conferences</li>
                        <li>Patient interviews</li>
                    </ul>
                    <div class="service-meta">
                        <span><strong>Turnaround:</strong> 24-72 hours</span>
                        <span><strong>Pricing:</strong> From $1.75/min</span>
                        <span><strong>Compliance:</strong> HIPAA</span>
                    </div>
                    <a href="<?php echo home_url(\'/order\'); ?>" class="btn btn-primary">Place Order</a>
                </div>
            </div>

            <div class="service-card" id="business">
                <div class="service-icon">
                    <i class="fas fa-video"></i>
                </div>
                <div class="content">
                    <h3>Business Meeting Transcription</h3>
                    <p>Accurate transcription of virtual meetings, webinars, and online conferences.</p>
                    <ul class="service-features">
                        <li>Zoom/Teams meetings</li>
                        <li>Webinars and presentations</li>
                        <li>Board meetings</li>
                        <li>Training sessions</li>
                        <li>Conference calls</li>
                        <li>Client presentations</li>
                    </ul>
                    <div class="service-meta">
                        <span><strong>Turnaround:</strong> 24 hours</span>
                        <span><strong>Pricing:</strong> From $1.25/min</span>
                        <span><strong>Format:</strong> Multiple speakers</span>
                    </div>
                    <a href="<?php echo home_url(\'/order\'); ?>" class="btn btn-primary">Place Order</a>
                </div>
            </div>

            <div class="service-card" id="academic">
                <div class="service-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="content">
                    <h3>Academic & Research</h3>
                    <p>Specialized transcription services for academic research and interviews.</p>
                    <ul class="service-features">
                        <li>Research interviews</li>
                        <li>Academic lectures</li>
                        <li>Focus group discussions</li>
                        <li>Oral histories</li>
                        <li>Thesis interviews</li>
                        <li>Student projects</li>
                    </ul>
                    <div class="service-meta">
                        <span><strong>Turnaround:</strong> 3-5 days</span>
                        <span><strong>Pricing:</strong> From $1.25/min</span>
                        <span><strong>Special:</strong> Student discounts</span>
                    </div>
                    <a href="<?php echo home_url(\'/order\'); ?>" class="btn btn-primary">Place Order</a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Additional Services -->
<section style="background: rgba(255,255,255,0.02); padding: 80px 0;">
    <div class="container">
        <h2 class="section-title">Additional Services</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-language"></i>
                </div>
                <h3>Multi-Language Support</h3>
                <p>Transcription services in English, Swahili, and other local languages.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <h3>Rush Orders</h3>
                <p>Same-day and express delivery options for urgent transcription needs.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-edit"></i>
                </div>
                <h3>Editing & Proofreading</h3>
                <p>Professional editing and proofreading services for existing transcripts.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-file-export"></i>
                </div>
                <h3>Multiple Formats</h3>
                <p>Delivery in Word, PDF, TXT, or any format you prefer.</p>
            </div>
        </div>
    </div>
</section>

<!-- Pricing Section -->
<section style="padding: 80px 0;">
    <div class="container">
        <h2 class="section-title">Transparent Pricing</h2>
        <div style="max-width: 800px; margin: 0 auto;">
            <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
                <h3 style="color: var(--gold); margin-bottom: 20px; text-align: center;">Per-Minute Pricing</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <div style="text-align: center; padding: 20px;">
                        <h4 style="color: var(--gold);">Legal</h4>
                        <p style="font-size: 1.5rem; font-weight: bold;">$1.50/min</p>
                    </div>
                    <div style="text-align: center; padding: 20px;">
                        <h4 style="color: var(--gold);">Medical</h4>
                        <p style="font-size: 1.5rem; font-weight: bold;">$1.75/min</p>
                    </div>
                    <div style="text-align: center; padding: 20px;">
                        <h4 style="color: var(--gold);">Business</h4>
                        <p style="font-size: 1.5rem; font-weight: bold;">$1.25/min</p>
                    </div>
                    <div style="text-align: center; padding: 20px;">
                        <h4 style="color: var(--gold);">Academic</h4>
                        <p style="font-size: 1.5rem; font-weight: bold;">$1.25/min</p>
                    </div>
                </div>
                
                <h4 style="color: var(--gold); margin-bottom: 15px;">Turnaround Options:</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <strong>Same Day:</strong> +50% surcharge
                    </li>
                    <li style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <strong>24 Hours:</strong> +25% surcharge
                    </li>
                    <li style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <strong>48 Hours:</strong> +10% surcharge
                    </li>
                    <li style="padding: 8px 0;">
                        <strong>3-5 Days:</strong> Standard pricing
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="text-center" style="margin-top: 40px;">
            <a href="<?php echo home_url(\'/order\'); ?>" class="btn btn-primary btn-large">Get Started Now</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>';

file_put_contents($theme_dir . 'page-services.php', $services_content);
echo "<p style='color: green;'>✅ Created page-services.php</p>";

// 6. Order page (page-order.php)
$order_content = '<?php get_header(); ?>

<section class="hero" style="min-height: 40vh; padding-top: 120px;">
    <div class="container text-center">
        <h1 class="hero-title" style="font-size: 3rem;">Place Your Order</h1>
        <p class="hero-subtitle">Get professional transcription services in just a few clicks</p>
    </div>
</section>

<section id="order" class="order" style="padding: 80px 0;">
    <div class="container">
        <div style="max-width: 800px; margin: 0 auto;">
            <form id="order-form" class="order-form" enctype="multipart/form-data" style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
                <div class="form-row">
                    <div class="form-group">
                        <label for="name">Full Name *</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" placeholder="+254 712 345 678">
                    </div>
                    <div class="form-group">
                        <label for="company">Company/Organization</label>
                        <input type="text" id="company" name="company">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="service">Service Type *</label>
                        <select id="service" name="service" required>
                            <option value="">Select a service</option>
                            <option value="legal">Legal Transcription</option>
                            <option value="medical">Medical Transcription</option>
                            <option value="business">Business Meeting Transcription</option>
                            <option value="academic">Academic & Research</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="turnaround">Turnaround Time *</label>
                        <select id="turnaround" name="turnaround" required>
                            <option value="">Select turnaround</option>
                            <option value="same-day">Same Day (+50%)</option>
                            <option value="24h">24 Hours (+25%)</option>
                            <option value="48h">48 Hours (+10%)</option>
                            <option value="3-5">3-5 Days (Standard)</option>
                        </select>
                    </div>
                </div>

                <div id="price-display" style="text-align: center; margin: 20px 0; font-size: 18px; color: var(--gold);"></div>

                <div class="form-group">
                    <label for="file">Upload Audio/Video File *</label>
                    <div class="file-upload" id="file-upload">
                        <input type="file" id="file" name="file" accept="audio/*,video/*" required>
                        <div class="file-upload-content">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Drag & drop files here or click to browse</p>
                            <span class="file-info">Max file size: 100MB. Accepted: MP3, WAV, MP4, MOV, M4A</span>
                        </div>
                    </div>
                    <div id="file-list" class="file-list" style="margin-top: 15px;"></div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="speakers">Number of Speakers</label>
                        <select id="speakers" name="speakers">
                            <option value="1">1 Speaker</option>
                            <option value="2">2 Speakers</option>
                            <option value="3-5">3-5 Speakers</option>
                            <option value="6+">6+ Speakers</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="format">Preferred Format</label>
                        <select id="format" name="format">
                            <option value="word">Microsoft Word (.docx)</option>
                            <option value="pdf">PDF Document</option>
                            <option value="txt">Plain Text (.txt)</option>
                            <option value="custom">Custom Format</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="notes">Additional Notes & Special Instructions</label>
                    <textarea id="notes" name="notes" rows="4" placeholder="Please include any special instructions, speaker names, technical terms, or formatting requirements..."></textarea>
                </div>

                <div style="background: rgba(212,175,55,0.1); padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid rgba(212,175,55,0.2);">
                    <h4 style="color: var(--gold); margin-bottom: 10px;">Payment Options:</h4>
                    <p style="margin: 0;">We accept M-Pesa, bank transfers, and invoicing for corporate clients. Payment details will be provided after order confirmation.</p>
                </div>

                <button type="submit" class="btn btn-primary btn-large" style="width: 100%; justify-content: center;">
                    <i class="fas fa-paper-plane"></i> Submit Order
                </button>
                <div id="order-status" class="form-status" style="margin-top: 20px; text-align: center;"></div>
            </form>
        </div>
    </div>
</section>

<!-- Order Process -->
<section style="background: rgba(255,255,255,0.02); padding: 80px 0;">
    <div class="container">
        <h2 class="section-title">How It Works</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-upload"></i>
                </div>
                <h3>1. Upload Your File</h3>
                <p>Upload your audio or video file through our secure form. We accept all major formats.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-cogs"></i>
                </div>
                <h3>2. We Process</h3>
                <p>Our expert transcriptionists work on your file with precision and attention to detail.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>3. Quality Check</h3>
                <p>Every transcript goes through our rigorous quality assurance process.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-download"></i>
                </div>
                <h3>4. Delivery</h3>
                <p>Receive your completed transcript in your preferred format within the agreed timeframe.</p>
            </div>
        </div>
    </div>
</section>

<script>
document.getElementById("order-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const statusDiv = document.getElementById("order-status");
    
    statusDiv.innerHTML = "<p style=\'color: #d4af37;\'>Processing your order...</p>";
    
    // Simulate form submission (replace with actual AJAX call)
    setTimeout(function() {
        statusDiv.innerHTML = "<p style=\'color: #4ade80;\'>✅ Order submitted successfully! We will contact you within 1 hour with payment details and confirmation.</p>";
        document.getElementById("order-form").reset();
        document.getElementById("file-list").innerHTML = "";
        document.getElementById("price-display").innerHTML = "";
    }, 2000);
});
</script>

<?php get_footer(); ?>';

file_put_contents($theme_dir . 'page-order.php', $order_content);
echo "<p style='color: green;'>✅ Created page-order.php</p>";

echo "<p>Page templates created! Creating more...</p>";
?>