<?php get_header(); ?>

<!-- Hero Section -->
<section class="hero" id="home">
    <div class="container">
        <div class="hero-container">
            <div class="hero-content">
                <h1>Precision Transcription for Law, Medicine, and Meetings</h1>
                <p class="hero-subtitle">Secure, fast, and trusted transcription services that transform your audio into accurate, professional text.</p>
                <div class="hero-buttons">
                    <a href="#order" class="btn btn-primary btn-large">Place Order Now</a>
                    <a href="#services" class="btn btn-secondary btn-large">View Services</a>
                </div>
            </div>
            <div class="hero-visual">
                <div class="hero-graphic">
                    <div class="graphic-item">
                        <i class="fas fa-microphone"></i>
                        <span>Audio Input</span>
                    </div>
                    <div class="graphic-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="graphic-item">
                        <i class="fas fa-file-alt"></i>
                        <span>Professional Transcript</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="section" id="features">
    <div class="container">
        <h2 class="section-title">Why Choose JD Transcripts?</h2>
        <div class="features-grid">
            <div class="card feature-card">
                <div class="feature-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Secure & Confidential</h3>
                <p>HIPAA compliant with strict confidentiality agreements and secure file handling.</p>
            </div>
            <div class="card feature-card">
                <div class="feature-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <h3>Fast Turnaround</h3>
                <p>Same-day to 3-5 day delivery options to meet your urgent deadlines.</p>
            </div>
            <div class="card feature-card">
                <div class="feature-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>99%+ Accuracy</h3>
                <p>Professional transcriptionists with expertise in legal and medical terminology.</p>
            </div>
            <div class="card feature-card">
                <div class="feature-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>Expert Team</h3>
                <p>Certified transcriptionists with years of experience in specialized fields.</p>
            </div>
        </div>
    </div>
</section>

<!-- Services Section -->
<section class="section" id="services">
    <div class="container">
        <h2 class="section-title">Our Services</h2>
        <div class="services-grid">
            <div class="card service-card">
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
                    <span class="price">From $1.50/min</span>
                </div>
                <a href="#order" class="btn btn-gold">Place Order</a>
            </div>
            
            <div class="card service-card">
                <div class="service-icon">
                    <i class="fas fa-stethoscope"></i>
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
                    <span class="price">From $1.75/min</span>
                </div>
                <a href="#order" class="btn btn-gold">Place Order</a>
            </div>
            
            <div class="card service-card">
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
                    <span class="price">From $1.25/min</span>
                </div>
                <a href="#order" class="btn btn-gold">Place Order</a>
            </div>
            
            <div class="card service-card">
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
                    <span class="price">From $1.25/min</span>
                </div>
                <a href="#order" class="btn btn-gold">Place Order</a>
            </div>
        </div>
    </div>
</section>

<!-- Order Section -->
<section class="section" id="order">
    <div class="container">
        <h2 class="section-title">Order Transcription</h2>
        <p class="section-subtitle">Get started with your transcription order. Fill out the form below and we'll get back to you quickly.</p>
        
        <form class="order-form" id="order-form" novalidate>
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
                    <label for="service">Service Type *</label>
                    <select id="service" name="service" required>
                        <option value="">Select a service</option>
                        <option value="legal">Legal Transcription</option>
                        <option value="medical">Medical Transcription</option>
                        <option value="zoom">Zoom Meeting Transcription</option>
                        <option value="academic">Academic & Interview</option>
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
            
            <div class="form-group">
                <label for="duration">Audio Duration (minutes) *</label>
                <input type="number" id="duration" name="duration" min="1" placeholder="e.g., 30" required>
            </div>
            
            <div class="form-group">
                <label for="file">Upload Audio File (Optional)</label>
                <div class="file-upload" id="file-upload">
                    <input type="file" id="file" name="file" accept="audio/*,video/*,.mp3,.mp4,.wav,.m4a,.mov">
                    <div class="file-upload-content">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Click to upload or drag and drop</p>
                        <p class="file-info">Supported formats: MP3, MP4, WAV, M4A, MOV (Max 100MB)</p>
                    </div>
                </div>
                <div id="file-list" class="file-list"></div>
            </div>
            
            <div class="form-group">
                <label for="notes">Additional Notes</label>
                <textarea id="notes" name="notes" rows="4" placeholder="Any special instructions or requirements..."></textarea>
            </div>
            
            <!-- Pricing Display -->
            <div id="pricing-display" class="pricing-display" style="display: none;">
                <h4>Order Summary</h4>
                <div class="pricing-row">
                    <span>Service:</span>
                    <span id="price-service">-</span>
                </div>
                <div class="pricing-row">
                    <span>Duration:</span>
                    <span id="price-duration">-</span>
                </div>
                <div class="pricing-row">
                    <span>Rate:</span>
                    <span id="price-rate" class="price">-</span>
                </div>
                <div class="pricing-row">
                    <span>Turnaround:</span>
                    <span id="price-turnaround">-</span>
                </div>
                <div class="pricing-row">
                    <span><strong>Total Price:</strong></span>
                    <span id="total-price" class="price"><strong>$0.00</strong></span>
                </div>
            </div>
            
            <!-- Payment Options -->
            <div id="payment-options" class="payment-options" style="display: none;">
                <div class="payment-method">
                    <input type="radio" id="mpesa" name="payment" value="mpesa">
                    <label for="mpesa">
                        <i class="fas fa-mobile-alt"></i>
                        <h4>Pay with M-Pesa</h4>
                        <p>Instant payment via M-Pesa</p>
                    </label>
                </div>
                <div class="payment-method">
                    <input type="radio" id="invoice" name="payment" value="invoice">
                    <label for="invoice">
                        <i class="fas fa-file-invoice"></i>
                        <h4>Invoice Me Later</h4>
                        <p>We'll send you an invoice</p>
                    </label>
                </div>
            </div>
            
            <!-- M-Pesa Details -->
            <div id="mpesa-details" class="mpesa-details" style="display: none;">
                <div class="form-group">
                    <label for="mpesa-phone">M-Pesa Phone Number *</label>
                    <input type="tel" id="mpesa-phone" name="mpesa-phone" placeholder="254712345678" pattern="254[0-9]{9}">
                    <small>Format: 254XXXXXXXXX (include country code)</small>
                </div>
            </div>
            
            <button type="submit" class="btn btn-primary btn-large" style="width: 100%;">
                <i class="fas fa-paper-plane"></i> Submit Order
            </button>
            
            <div id="order-status" class="form-status" style="display: none;"></div>
        </form>
    </div>
</section>

<!-- About Section -->
<section class="section" id="about">
    <div class="container">
        <h2 class="section-title">About JD Legal Transcripts</h2>
        <div class="hero-container">
            <div class="hero-content">
                <h3>Our Mission</h3>
                <p>JD Legal Transcripts is dedicated to providing fast, accurate, and confidential transcription services for legal, medical, and professional clients. Our mission is to empower professionals with reliable documentation, delivered securely and on time.</p>
                
                <h3>Our Vision</h3>
                <p>To be the most trusted transcription partner for attorneys, doctors, and organizations worldwide.</p>
                
                <h3>What Sets Us Apart</h3>
                <ul class="service-features">
                    <li>HIPAA Compliant</li>
                    <li>NDA & Confidentiality Agreements</li>
                    <li>Certified Transcriptionists</li>
                    <li>Fast Turnaround Times</li>
                </ul>
            </div>
            <div class="hero-visual">
                <div class="card">
                    <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&q=80" alt="JD Transcripts Team" style="width: 100%; border-radius: 12px; margin-bottom: 1rem;">
                    <h4>Meet the Founder</h4>
                    <p>Jane Doe, M.A. in Linguistics, 15+ years in legal and medical transcription.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Contact Section -->
<section class="section" id="contact">
    <div class="container">
        <h2 class="section-title">Contact Us</h2>
        <div class="hero-container">
            <div class="hero-content">
                <form class="order-form" id="contact-form">
                    <h3>Send us a Message</h3>
                    <div class="form-group">
                        <label for="contact-name">Your Name *</label>
                        <input type="text" id="contact-name" name="contact-name" required>
                    </div>
                    <div class="form-group">
                        <label for="contact-email">Your Email *</label>
                        <input type="email" id="contact-email" name="contact-email" required>
                    </div>
                    <div class="form-group">
                        <label for="contact-message">Your Message *</label>
                        <textarea id="contact-message" name="contact-message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        <i class="fas fa-paper-plane"></i> Send Message
                    </button>
                    <div id="contact-status" class="form-status" style="display: none;"></div>
                </form>
            </div>
            <div class="hero-visual">
                <div class="card">
                    <h3>Get in Touch</h3>
                    <div style="margin: 2rem 0;">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                            <div style="width: 40px; height: 40px; background: var(--gradient-gold); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-envelope" style="color: var(--primary-dark);"></i>
                            </div>
                            <div>
                                <strong>Email</strong><br>
                                <a href="mailto:info@jdtranscripts.com" style="color: var(--text-secondary);">info@jdtranscripts.com</a>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                            <div style="width: 40px; height: 40px; background: var(--gradient-gold); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-phone" style="color: var(--primary-dark);"></i>
                            </div>
                            <div>
                                <strong>Phone</strong><br>
                                <span style="color: var(--text-secondary);">+254 712 345 678</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                            <div style="width: 40px; height: 40px; background: var(--gradient-gold); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-clock" style="color: var(--primary-dark);"></i>
                            </div>
                            <div>
                                <strong>Business Hours</strong><br>
                                <span style="color: var(--text-secondary);">Mon-Fri: 8AM-6PM EAT</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <a href="#" style="width: 50px; height: 50px; background: var(--gradient-gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: var(--transition-fast);">
                            <i class="fab fa-linkedin" style="color: var(--primary-dark);"></i>
                        </a>
                        <a href="#" style="width: 50px; height: 50px; background: var(--gradient-gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: var(--transition-fast);">
                            <i class="fab fa-twitter" style="color: var(--primary-dark);"></i>
                        </a>
                        <a href="#" style="width: 50px; height: 50px; background: var(--gradient-gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: var(--transition-fast);">
                            <i class="fab fa-facebook" style="color: var(--primary-dark);"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>