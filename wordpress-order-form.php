<?php
/**
 * WordPress Order Form Template for JD Legal Transcripts
 * Use this as a shortcode: [jd_order_form]
 */
?>

<style>
/* Premium WordPress Order Form Styles */
.jd-order-form-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 0 20px;
}

.jd-order-form {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(26, 54, 93, 0.1);
    border: 1px solid #e2e8f0;
    position: relative;
    overflow: hidden;
}

.jd-order-form::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #1a365d 0%, #d69e2e 100%);
}

.jd-form-header {
    text-align: center;
    margin-bottom: 40px;
}

.jd-form-title {
    font-size: 2.2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 10px;
}

.jd-form-subtitle {
    color: #4a5568;
    font-size: 1.1rem;
    font-weight: 400;
}

.jd-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    margin-bottom: 25px;
}

.jd-form-group {
    margin-bottom: 25px;
}

.jd-form-group.full-width {
    grid-column: 1 / -1;
}

.jd-form-label {
    display: block;
    margin-bottom: 8px;
    color: #1a202c;
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.3px;
}

.jd-form-input,
.jd-form-select,
.jd-form-textarea {
    width: 100%;
    padding: 16px 20px;
    background: #ffffff;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    color: #1a202c;
    font-size: 1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
}

.jd-form-input:focus,
.jd-form-select:focus,
.jd-form-textarea:focus {
    outline: none;
    border-color: #1a365d;
    background: #f7fafc;
    box-shadow: 0 0 0 4px rgba(26, 54, 93, 0.1);
    transform: translateY(-1px);
}

.jd-form-input::placeholder,
.jd-form-textarea::placeholder {
    color: #a0aec0;
    font-style: italic;
}

.jd-file-upload {
    position: relative;
    border: 2px dashed #cbd5e0;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
    transition: all 0.3s ease;
    cursor: pointer;
}

.jd-file-upload:hover {
    border-color: #1a365d;
    background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
}

.jd-file-upload.dragover {
    border-color: #d69e2e;
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.jd-file-upload-icon {
    font-size: 3rem;
    color: #1a365d;
    margin-bottom: 15px;
}

.jd-file-upload-text {
    font-size: 1.1rem;
    color: #2d3748;
    font-weight: 600;
    margin-bottom: 8px;
}

.jd-file-upload-info {
    font-size: 0.9rem;
    color: #718096;
}

.jd-file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.jd-file-list {
    margin-top: 15px;
    padding: 15px;
    background: #f7fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.jd-file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
}

.jd-file-item:last-child {
    border-bottom: none;
}

.jd-submit-btn {
    background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
    color: white;
    border: none;
    padding: 18px 40px;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    width: 100%;
    margin-top: 20px;
}

.jd-submit-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
}

.jd-submit-btn:hover::before {
    left: 100%;
}

.jd-submit-btn:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(26, 54, 93, 0.3);
}

.jd-submit-btn:active {
    transform: translateY(0);
}

.jd-form-status {
    margin-top: 20px;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
}

.jd-form-status.success {
    background: #f0fff4;
    color: #38a169;
    border: 1px solid #9ae6b4;
}

.jd-form-status.error {
    background: #fed7d7;
    color: #e53e3e;
    border: 1px solid #feb2b2;
}

.jd-pricing-info {
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 30px;
    border: 1px solid #d69e2e;
}

.jd-pricing-title {
    font-weight: 700;
    color: #1a365d;
    margin-bottom: 10px;
}

.jd-pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.jd-pricing-item {
    background: rgba(255, 255, 255, 0.8);
    padding: 15px;
    border-radius: 8px;
    text-align: center;
}

.jd-service-name {
    font-weight: 600;
    color: #1a365d;
    margin-bottom: 5px;
}

.jd-service-price {
    color: #d69e2e;
    font-weight: 700;
    font-size: 1.1rem;
}

@media (max-width: 768px) {
    .jd-form-row {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .jd-order-form {
        padding: 25px;
        margin: 20px 10px;
    }
    
    .jd-form-title {
        font-size: 1.8rem;
    }
    
    .jd-pricing-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<div class="jd-order-form-container">
    <form class="jd-order-form" id="jd-order-form" enctype="multipart/form-data">
        <div class="jd-form-header">
            <h2 class="jd-form-title">Professional Transcription Order</h2>
            <p class="jd-form-subtitle">Secure, fast, and trusted transcription services</p>
        </div>

        <!-- Pricing Information -->
        <div class="jd-pricing-info">
            <h3 class="jd-pricing-title">📋 Service Pricing</h3>
            <div class="jd-pricing-grid">
                <div class="jd-pricing-item">
                    <div class="jd-service-name">Legal Transcription</div>
                    <div class="jd-service-price">From $1.50/min</div>
                </div>
                <div class="jd-pricing-item">
                    <div class="jd-service-name">Medical Transcription</div>
                    <div class="jd-service-price">From $1.75/min</div>
                </div>
                <div class="jd-pricing-item">
                    <div class="jd-service-name">Zoom Meetings</div>
                    <div class="jd-service-price">From $1.25/min</div>
                </div>
                <div class="jd-pricing-item">
                    <div class="jd-service-name">Academic & Interview</div>
                    <div class="jd-service-price">From $1.25/min</div>
                </div>
            </div>
        </div>

        <div class="jd-form-row">
            <div class="jd-form-group">
                <label for="jd-name" class="jd-form-label">Full Name *</label>
                <input type="text" id="jd-name" name="name" class="jd-form-input" required placeholder="Enter your full name">
            </div>
            <div class="jd-form-group">
                <label for="jd-email" class="jd-form-label">Email Address *</label>
                <input type="email" id="jd-email" name="email" class="jd-form-input" required placeholder="your.email@example.com">
            </div>
        </div>

        <div class="jd-form-row">
            <div class="jd-form-group">
                <label for="jd-service" class="jd-form-label">Service Type *</label>
                <select id="jd-service" name="service" class="jd-form-select" required>
                    <option value="">Select a service</option>
                    <option value="legal">Legal Transcription</option>
                    <option value="medical">Medical Transcription</option>
                    <option value="zoom">Zoom Meeting Transcription</option>
                    <option value="academic">Academic & Interview</option>
                </select>
            </div>
            <div class="jd-form-group">
                <label for="jd-turnaround" class="jd-form-label">Turnaround Time *</label>
                <select id="jd-turnaround" name="turnaround" class="jd-form-select" required>
                    <option value="">Select turnaround</option>
                    <option value="same-day">Same Day (+50%)</option>
                    <option value="24h">24 Hours (+25%)</option>
                    <option value="48h">48 Hours (+10%)</option>
                    <option value="3-5">3-5 Days (Standard)</option>
                </select>
            </div>
        </div>

        <div class="jd-form-group full-width">
            <label for="jd-file" class="jd-form-label">Upload Audio/Video File *</label>
            <div class="jd-file-upload" id="jd-file-upload">
                <input type="file" id="jd-file" name="file" class="jd-file-input" accept="audio/*,video/*" required>
                <div class="jd-file-upload-content">
                    <div class="jd-file-upload-icon">📁</div>
                    <div class="jd-file-upload-text">Drag & drop files here or click to browse</div>
                    <div class="jd-file-upload-info">Max file size: 100MB. Accepted: MP3, WAV, MP4, MOV</div>
                </div>
            </div>
            <div id="jd-file-list" class="jd-file-list" style="display: none;"></div>
        </div>

        <div class="jd-form-group full-width">
            <label for="jd-notes" class="jd-form-label">Additional Notes</label>
            <textarea id="jd-notes" name="notes" class="jd-form-textarea" rows="4" placeholder="Any special instructions, speaker names, technical terms, or requirements..."></textarea>
        </div>

        <button type="submit" class="jd-submit-btn">
            🚀 Submit Order
        </button>

        <div id="jd-order-status" class="jd-form-status" style="display: none;"></div>
    </form>
</div>

<script>
jQuery(document).ready(function($) {
    // File upload handling
    const fileUpload = $('#jd-file-upload');
    const fileInput = $('#jd-file');
    const fileList = $('#jd-file-list');

    // Drag and drop functionality
    fileUpload.on('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('dragover');
    });

    fileUpload.on('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
    });

    fileUpload.on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
        const files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            fileInput[0].files = files;
            displayFiles(files);
        }
    });

    fileInput.on('change', function() {
        displayFiles(this.files);
    });

    function displayFiles(files) {
        if (files.length > 0) {
            let html = '<h4>Selected Files:</h4>';
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const size = (file.size / 1024 / 1024).toFixed(2);
                html += `
                    <div class="jd-file-item">
                        <span>📄 ${file.name} (${size} MB)</span>
                        <span style="color: #38a169;">✓ Ready</span>
                    </div>
                `;
            }
            fileList.html(html).show();
        } else {
            fileList.hide();
        }
    }

    // Form submission
    $('#jd-order-form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        formData.append('action', 'submit_order');
        formData.append('nonce', jd_ajax.nonce);
        
        const statusDiv = $('#jd-order-status');
        const submitBtn = $('.jd-submit-btn');
        
        // Show loading state
        submitBtn.text('🔄 Processing Order...').prop('disabled', true);
        statusDiv.hide();
        
        $.ajax({
            url: jd_ajax.ajax_url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    statusDiv.removeClass('error').addClass('success')
                           .html(`✅ ${response.data.message}<br><strong>Order Number: ${response.data.order_number}</strong>`)
                           .show();
                    $('#jd-order-form')[0].reset();
                    fileList.hide();
                } else {
                    statusDiv.removeClass('success').addClass('error')
                           .html(`❌ ${response.data}`)
                           .show();
                }
            },
            error: function() {
                statusDiv.removeClass('success').addClass('error')
                       .html('❌ An error occurred. Please try again.')
                       .show();
            },
            complete: function() {
                submitBtn.text('🚀 Submit Order').prop('disabled', false);
            }
        });
    });
});
</script>