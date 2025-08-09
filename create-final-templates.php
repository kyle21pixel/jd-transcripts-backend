<?php
// Create the final templates
echo "<h1>🏁 Creating Final Templates</h1>";

$theme_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';

// 9. Careers page (page-careers.php)
$careers_content = '<?php get_header(); ?>

<section class="hero" style="min-height: 60vh; padding-top: 120px;">
    <div class="container text-center">
        <h1 class="hero-title" style="font-size: 3rem;">Join Our Team</h1>
        <p class="hero-subtitle">Build your career with Kenya\'s leading transcription service</p>
    </div>
</section>

<section style="padding: 80px 0;">
    <div class="container">
        <div style="text-align: center; margin-bottom: 60px;">
            <h2 style="color: var(--gold); font-size: 2.5rem; margin-bottom: 20px;">Why Work With Us?</h2>
            <p style="font-size: 1.2rem; max-width: 600px; margin: 0 auto; opacity: 0.9;">
                Join a dynamic team of professionals dedicated to excellence in transcription services. 
                We offer competitive compensation, flexible schedules, and growth opportunities.
            </p>
        </div>
        
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-home"></i>
                </div>
                <h3>Remote Work</h3>
                <p>Work from anywhere with flexible schedules that fit your lifestyle.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <h3>Competitive Pay</h3>
                <p>Earn competitive rates with performance bonuses and regular increases.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h3>Training & Development</h3>
                <p>Continuous learning opportunities and professional development programs.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>Great Team</h3>
                <p>Work with experienced professionals in a supportive environment.</p>
            </div>
        </div>
    </div>
</section>

<!-- Job Openings -->
<section style="background: rgba(255,255,255,0.02); padding: 80px 0;">
    <div class="container">
        <h2 class="section-title">Current Openings</h2>
        <div style="max-width: 900px; margin: 0 auto;">
            
            <!-- Job 1 -->
            <div style="background: rgba(255,255,255,0.05); border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); padding: 40px; margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                    <div>
                        <h3 style="color: var(--gold); margin-bottom: 10px;">Legal Transcriptionist</h3>
                        <p style="opacity: 0.8; margin: 0;">Full-time • Remote • Nairobi</p>
                    </div>
                    <span style="background: rgba(212,175,55,0.2); color: var(--gold); padding: 8px 16px; border-radius: 20px; font-size: 0.9rem;">Open</span>
                </div>
                <p style="margin-bottom: 20px; line-height: 1.6;">
                    We are seeking an experienced legal transcriptionist to join our team. The ideal candidate will have 
                    experience with legal terminology and court proceedings.
                </p>
                <div style="margin-bottom: 20px;">
                    <h4 style="color: var(--gold); margin-bottom: 10px;">Requirements:</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>2+ years legal transcription experience</li>
                        <li>Typing speed of 75+ WPM</li>
                        <li>Knowledge of legal terminology</li>
                        <li>Excellent attention to detail</li>
                    </ul>
                </div>
                <div style="display: flex; gap: 15px;">
                    <button onclick="applyForJob(\'Legal Transcriptionist\')" class="btn btn-primary">Apply Now</button>
                    <button onclick="viewJobDetails(\'legal-transcriptionist\')" class="btn btn-secondary">View Details</button>
                </div>
            </div>
            
            <!-- Job 2 -->
            <div style="background: rgba(255,255,255,0.05); border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); padding: 40px; margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                    <div>
                        <h3 style="color: var(--gold); margin-bottom: 10px;">Medical Transcriptionist</h3>
                        <p style="opacity: 0.8; margin: 0;">Full-time • Remote • Kenya</p>
                    </div>
                    <span style="background: rgba(212,175,55,0.2); color: var(--gold); padding: 8px 16px; border-radius: 20px; font-size: 0.9rem;">Open</span>
                </div>
                <p style="margin-bottom: 20px; line-height: 1.6;">
                    Join our medical transcription team to work on HIPAA-compliant medical documentation. 
                    Medical background preferred but not required.
                </p>
                <div style="margin-bottom: 20px;">
                    <h4 style="color: var(--gold); margin-bottom: 10px;">Requirements:</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>Medical transcription certification</li>
                        <li>Understanding of medical terminology</li>
                        <li>HIPAA compliance knowledge</li>
                        <li>High accuracy standards</li>
                    </ul>
                </div>
                <div style="display: flex; gap: 15px;">
                    <button onclick="applyForJob(\'Medical Transcriptionist\')" class="btn btn-primary">Apply Now</button>
                    <button onclick="viewJobDetails(\'medical-transcriptionist\')" class="btn btn-secondary">View Details</button>
                </div>
            </div>
            
            <!-- Job 3 -->
            <div style="background: rgba(255,255,255,0.05); border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); padding: 40px; margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                    <div>
                        <h3 style="color: var(--gold); margin-bottom: 10px;">Quality Assurance Specialist</h3>
                        <p style="opacity: 0.8; margin: 0;">Part-time • Remote • Flexible</p>
                    </div>
                    <span style="background: rgba(212,175,55,0.2); color: var(--gold); padding: 8px 16px; border-radius: 20px; font-size: 0.9rem;">Open</span>
                </div>
                <p style="margin-bottom: 20px; line-height: 1.6;">
                    We need a detail-oriented QA specialist to review and ensure the accuracy of our transcripts 
                    before delivery to clients.
                </p>
                <div style="margin-bottom: 20px;">
                    <h4 style="color: var(--gold); margin-bottom: 10px;">Requirements:</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>Excellent English proficiency</li>
                        <li>Strong attention to detail</li>
                        <li>Previous QA experience preferred</li>
                        <li>Ability to work independently</li>
                    </ul>
                </div>
                <div style="display: flex; gap: 15px;">
                    <button onclick="applyForJob(\'Quality Assurance Specialist\')" class="btn btn-primary">Apply Now</button>
                    <button onclick="viewJobDetails(\'qa-specialist\')" class="btn btn-secondary">View Details</button>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Application Form Modal -->
<div id="application-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; align-items: center; justify-content: center;">
    <div style="background: var(--dark); border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
        <div style="padding: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="color: var(--gold); margin: 0;">Apply for Position</h3>
            <button onclick="closeApplicationModal()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div style="padding: 30px;">
            <form id="application-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="app-name">Full Name *</label>
                        <input type="text" id="app-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="app-email">Email Address *</label>
                        <input type="email" id="app-email" name="email" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="app-phone">Phone Number *</label>
                        <input type="tel" id="app-phone" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="app-position">Position *</label>
                        <input type="text" id="app-position" name="position" readonly>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="app-experience">Years of Experience *</label>
                    <select id="app-experience" name="experience" required>
                        <option value="">Select experience</option>
                        <option value="0-1">0-1 years</option>
                        <option value="2-3">2-3 years</option>
                        <option value="4-5">4-5 years</option>
                        <option value="5+">5+ years</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="app-resume">Upload Resume/CV *</label>
                    <div class="file-upload" onclick="document.getElementById(\'app-resume\').click()">
                        <input type="file" id="app-resume" name="resume" accept=".pdf,.doc,.docx" required style="display: none;">
                        <div class="file-upload-content">
                            <i class="fas fa-file-upload"></i>
                            <p>Click to upload your resume</p>
                            <span class="file-info">PDF, DOC, or DOCX format</span>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="app-cover">Cover Letter</label>
                    <textarea id="app-cover" name="cover_letter" rows="4" placeholder="Tell us why you\'re interested in this position..."></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary btn-large" style="width: 100%; justify-content: center;">
                    <i class="fas fa-paper-plane"></i> Submit Application
                </button>
                <div id="application-status" style="margin-top: 20px; text-align: center;"></div>
            </form>
        </div>
    </div>
</div>

<!-- Benefits Section -->
<section style="padding: 80px 0;">
    <div class="container">
        <h2 class="section-title">Employee Benefits</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
            <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
                <h3 style="color: var(--gold); margin-bottom: 15px;">💰 Competitive Compensation</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 5px 0;">• Above-market rates</li>
                    <li style="padding: 5px 0;">• Performance bonuses</li>
                    <li style="padding: 5px 0;">• Annual salary reviews</li>
                    <li style="padding: 5px 0;">• Overtime opportunities</li>
                </ul>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
                <h3 style="color: var(--gold); margin-bottom: 15px;">🏠 Work-Life Balance</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 5px 0;">• Flexible working hours</li>
                    <li style="padding: 5px 0;">• Remote work options</li>
                    <li style="padding: 5px 0;">• Paid time off</li>
                    <li style="padding: 5px 0;">• Holiday bonuses</li>
                </ul>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
                <h3 style="color: var(--gold); margin-bottom: 15px;">📚 Professional Growth</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 5px 0;">• Training programs</li>
                    <li style="padding: 5px 0;">• Certification support</li>
                    <li style="padding: 5px 0;">• Career advancement</li>
                    <li style="padding: 5px 0;">• Mentorship programs</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<script>
function applyForJob(position) {
    document.getElementById("app-position").value = position;
    document.getElementById("application-modal").style.display = "flex";
}

function closeApplicationModal() {
    document.getElementById("application-modal").style.display = "none";
}

function viewJobDetails(jobId) {
    alert("Job details would be displayed here for: " + jobId);
}

document.getElementById("application-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const statusDiv = document.getElementById("application-status");
    statusDiv.innerHTML = "<p style=\'color: #d4af37;\'>Submitting your application...</p>";
    
    setTimeout(function() {
        statusDiv.innerHTML = "<p style=\'color: #4ade80;\'>✅ Application submitted successfully! We will review and contact you within 3-5 business days.</p>";
        setTimeout(function() {
            closeApplicationModal();
            document.getElementById("application-form").reset();
        }, 3000);
    }, 2000);
});

// Close modal when clicking outside
document.getElementById("application-modal").addEventListener("click", function(e) {
    if (e.target === this) {
        closeApplicationModal();
    }
});
</script>

<?php get_footer(); ?>';

file_put_contents($theme_dir . 'page-careers.php', $careers_content);
echo "<p style='color: green;'>✅ Created page-careers.php</p>";

// 10. Admin Login page (page-admin-login.php)
$admin_login_content = '<?php get_header(); ?>

<section class="hero" style="min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <div style="max-width: 400px; width: 100%; padding: 20px;">
        <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px);">
            <div style="text-align: center; margin-bottom: 30px;">
                <i class="fas fa-user-shield" style="font-size: 3rem; color: var(--gold); margin-bottom: 15px;"></i>
                <h2 style="color: var(--gold); margin-bottom: 10px;">Admin Login</h2>
                <p style="opacity: 0.8;">Access the administrative dashboard</p>
            </div>
            
            <form id="admin-login-form">
                <div class="form-group">
                    <label for="admin-username">Username</label>
                    <input type="text" id="admin-username" name="username" required placeholder="Enter your username">
                </div>
                
                <div class="form-group">
                    <label for="admin-password">Password</label>
                    <input type="password" id="admin-password" name="password" required placeholder="Enter your password">
                </div>
                
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="remember-me" style="margin: 0;">
                        <span style="font-size: 0.9rem;">Remember me</span>
                    </label>
                    <a href="#" style="color: var(--gold); font-size: 0.9rem; text-decoration: none;">Forgot password?</a>
                </div>
                
                <button type="submit" class="btn btn-primary btn-large" style="width: 100%; justify-content: center;">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
                
                <div id="login-status" style="margin-top: 20px; text-align: center;"></div>
            </form>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                <p style="font-size: 0.9rem; opacity: 0.7;">
                    Demo credentials:<br>
                    Username: <strong>admin</strong><br>
                    Password: <strong>admin123</strong>
                </p>
            </div>
        </div>
    </div>
</section>

<script>
document.getElementById("admin-login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const username = document.getElementById("admin-username").value;
    const password = document.getElementById("admin-password").value;
    const statusDiv = document.getElementById("login-status");
    
    statusDiv.innerHTML = "<p style=\'color: #d4af37;\'>Authenticating...</p>";
    
    // Simple demo authentication
    setTimeout(function() {
        if (username === "admin" && password === "admin123") {
            statusDiv.innerHTML = "<p style=\'color: #4ade80;\'>✅ Login successful! Redirecting...</p>";
            setTimeout(function() {
                window.location.href = "<?php echo home_url(\'/admin\'); ?>";
            }, 1500);
        } else {
            statusDiv.innerHTML = "<p style=\'color: #ef4444;\'>❌ Invalid credentials. Please try again.</p>";
        }
    }, 1500);
});
</script>

<?php get_footer(); ?>';

file_put_contents($theme_dir . 'page-admin-login.php', $admin_login_content);
echo "<p style='color: green;'>✅ Created page-admin-login.php</p>";

echo "<p>Final templates created! Creating index and functions files...</p>";
?>