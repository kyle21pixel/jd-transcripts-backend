<?php get_header(); ?>

<!-- Order Hero Section -->
<section class="hero order-hero">
    <div class="container">
        <div class="hero-container">
            <div class="hero-content">
                <h1>Place Your Transcription Order</h1>
                <p class="hero-subtitle">Get professional, accurate transcription services with fast turnaround times. Fill out the form below to get started.</p>
            </div>
        </div>
    </div>
</section>

<!-- Order Form Section -->
<section class="section" id="order">
    <div class="container">
        <div class="order-container">
            <div class="order-info">
                <h2>Quick & Easy Ordering</h2>
                <div class="info-cards">
                    <div class="info-card">
                        <i class="fas fa-clock"></i>
                        <h4>Fast Turnaround</h4>
                        <p>Same day to 5-day delivery options</p>
                    </div>
                    <div class="info-card">
                        <i class="fas fa-shield-alt"></i>
                        <h4>Secure & Confidential</h4>
                        <p>Your files are handled with complete confidentiality</p>
                    </div>
                    <div class="info-card">
                        <i class="fas fa-check-circle"></i>
                        <h4>99%+ Accuracy</h4>
                        <p>Professional quality guaranteed</p>
                    </div>
                </div>
                
                <div class="pricing-info">
                    <h3>Pricing Guide</h3>
                    <div class="pricing-table">
                        <div class="pricing-row">
                            <span>Legal Transcription</span>
                            <span>$1.50/min</span>
                        </div>
                        <div class="pricing-row">
                            <span>Medical Transcription</span>
                            <span>$1.75/min</span>
                        </div>
                        <div class="pricing-row">
                            <span>Business/Meetings</span>
                            <span>$1.25/min</span>
                        </div>
                        <div class="pricing-row">
                            <span>Academic/Research</span>
                            <span>$1.25/min</span>
                        </div>
                    </div>
                    <p class="pricing-note">*Prices may vary based on turnaround time and complexity</p>
                </div>
            </div>
            
            <div class="order-form-container">
                <form class="order-form" id="order-form" novalidate>
                    <h3>Order Details</h3>
                    
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
                                <option value="zoom">Business/Meeting Transcription</option>
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
                        <h4>Payment Method</h4>
                        <div class="payment-method">
                            <input type="radio" id="mpesa" name="payment" value="mpesa">
                            <label for="mpesa">
                                <i class="fas fa-mobile-alt"></i>
                                <div>
                                    <h5>Pay with M-Pesa</h5>
                                    <p>Instant payment via M-Pesa</p>
                                </div>
                            </label>
                        </div>
                        <div class="payment-method">
                            <input type="radio" id="invoice" name="payment" value="invoice">
                            <label for="invoice">
                                <i class="fas fa-file-invoice"></i>
                                <div>
                                    <h5>Invoice Me Later</h5>
                                    <p>We'll send you an invoice</p>
                                </div>
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
        </div>
    </div>
</section>

<style>
.order-hero {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    padding: 120px 0 80px;
}

.order-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 60px;
    align-items: start;
}

.order-info h2 {
    margin-bottom: 30px;
}

.info-cards {
    display: grid;
    gap: 20px;
    margin-bottom: 40px;
}

.info-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
}

.info-card i {
    color: var(--gold);
    font-size: 24px;
    width: 40px;
    text-align: center;
}

.info-card h4 {
    margin: 0 0 5px 0;
    color: var(--gold);
}

.info-card p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}

.pricing-info {
    background: rgba(255,255,255,0.05);
    padding: 30px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
}

.pricing-info h3 {
    margin-bottom: 20px;
    color: var(--gold);
}

.pricing-table {
    margin-bottom: 15px;
}

.pricing-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.pricing-row:last-child {
    border-bottom: none;
}

.pricing-note {
    font-size: 12px;
    opacity: 0.7;
    margin: 0;
}

.order-form-container {
    background: rgba(255,255,255,0.05);
    padding: 40px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
}

.order-form h3 {
    margin-bottom: 30px;
    color: var(--gold);
}

.payment-method {
    margin: 15px 0;
}

.payment-method label {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    border: 2px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.payment-method label:hover {
    border-color: var(--gold);
}

.payment-method input:checked + label {
    border-color: var(--gold);
    background: rgba(255,215,0,0.1);
}

.payment-method i {
    color: var(--gold);
    font-size: 24px;
    width: 30px;
}

.payment-method h5 {
    margin: 0 0 5px 0;
    color: var(--gold);
}

.payment-method p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}

@media (max-width: 768px) {
    .order-container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    
    .order-form-container {
        padding: 30px 20px;
    }
}
</style>

<?php get_footer(); ?>