<?php
/**
 * Template for Order Page
 *
 * @package JD_Legal_Transcripts
 */

get_header(); ?>

<section class="section order-page">
    <div class="container">
        <h1 class="section-title">Order Transcription Services</h1>
        
        <?php if (isset($_GET['order_submitted']) && $_GET['order_submitted'] == '1') : ?>
            <div class="order-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Order Submitted Successfully!</h2>
                <p>Thank you for your order. We have received your request and will contact you shortly with confirmation and next steps.</p>
                <p>You will receive an email confirmation within the next few minutes.</p>
            </div>
        <?php else : ?>
            
            <form id="order-form" class="order-form" method="post" action="<?php echo admin_url('admin-ajax.php'); ?>" enctype="multipart/form-data">
                <?php wp_nonce_field('jd_order_form', 'jd_order_nonce'); ?>
                <input type="hidden" name="action" value="jd_submit_order">
                
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
                    <label for="file">Upload Audio/Video File *</label>
                    <div class="file-upload" id="file-upload">
                        <input type="file" id="file" name="file" accept="audio/*,video/*" required>
                        <div class="file-upload-content">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Drag & drop files here or click to browse</p>
                            <span class="file-info">Max file size: 100MB. Accepted: MP3, WAV, MP4, MOV</span>
                        </div>
                    </div>
                    <div id="file-list" class="file-list"></div>
                </div>

                <div class="form-group">
                    <label for="notes">Additional Notes</label>
                    <textarea id="notes" name="notes" rows="4" placeholder="Any special instructions or requirements..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-large">Submit Order</button>
                <div id="order-status" class="form-status"></div>
            </form>
            
        <?php endif; ?>
    </div>
</section>

<style>
.order-page {
    padding-top: 120px;
    min-height: 100vh;
}

.order-success {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 3rem;
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow-heavy);
    border: 1px solid rgba(255, 255, 255, 0.2);
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
}

.order-success::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.success-icon {
    font-size: 4rem;
    color: #48bb78;
    margin-bottom: 1.5rem;
}

.order-success h2 {
    color: #48bb78;
    margin-bottom: 1rem;
}

.order-success p {
    color: var(--text-medium);
    margin-bottom: 1rem;
}

.file-list {
    margin-top: 1rem;
}

.file-item {
    background: rgba(26, 54, 93, 0.05);
    padding: 1rem;
    border-radius: var(--border-radius);
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.file-item .file-name {
    font-weight: 600;
    color: var(--navy-blue);
}

.file-item .file-size {
    color: var(--text-light);
    font-size: 0.9rem;
}

.form-status {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: var(--border-radius);
    text-align: center;
    font-weight: 600;
}

.form-status.success {
    background: #c6f6d5;
    color: #276749;
    border: 1px solid #9ae6b4;
}

.form-status.error {
    background: #fed7d7;
    color: #c53030;
    border: 1px solid #feb2b2;
}

.form-status.loading {
    background: #bee3f8;
    color: #2b6cb0;
    border: 1px solid #90cdf4;
}

/* File Upload Enhancements */
.file-upload.dragover {
    border-color: var(--gold);
    background: rgba(214, 158, 46, 0.1);
}

.file-upload input[type="file"] {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
    .order-page {
        padding-top: 100px;
    }
    
    .order-form {
        padding: 2rem;
    }
    
    .order-success {
        padding: 2rem;
        margin: 1rem;
    }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('order-form');
    const fileUpload = document.getElementById('file-upload');
    const fileInput = document.getElementById('file');
    const fileList = document.getElementById('file-list');
    const statusDiv = document.getElementById('order-status');
    
    // File upload drag and drop
    if (fileUpload && fileInput) {
        fileUpload.addEventListener('dragover', function(e) {
            e.preventDefault();
            fileUpload.classList.add('dragover');
        });
        
        fileUpload.addEventListener('dragleave', function(e) {
            e.preventDefault();
            fileUpload.classList.remove('dragover');
        });
        
        fileUpload.addEventListener('drop', function(e) {
            e.preventDefault();
            fileUpload.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                displayFiles(files);
            }
        });
        
        fileInput.addEventListener('change', function() {
            displayFiles(this.files);
        });
    }
    
    function displayFiles(files) {
        fileList.innerHTML = '';
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileName = document.createElement('span');
            fileName.className = 'file-name';
            fileName.textContent = file.name;
            
            const fileSize = document.createElement('span');
            fileSize.className = 'file-size';
            fileSize.textContent = formatFileSize(file.size);
            
            fileItem.appendChild(fileName);
            fileItem.appendChild(fileSize);
            fileList.appendChild(fileItem);
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            statusDiv.className = 'form-status loading';
            statusDiv.textContent = 'Processing your order...';
            
            // Create FormData object
            const formData = new FormData(form);
            
            // Submit form via AJAX
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    statusDiv.className = 'form-status success';
                    statusDiv.textContent = 'Order submitted successfully! Redirecting...';
                    
                    setTimeout(() => {
                        window.location.href = window.location.href + '?order_submitted=1';
                    }, 2000);
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                statusDiv.className = 'form-status error';
                statusDiv.textContent = 'There was an error submitting your order. Please try again.';
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
});
</script>

<?php get_footer(); ?>