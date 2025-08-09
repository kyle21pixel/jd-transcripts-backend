<?php
// Create Admin Login page template
$dest_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';

$admin_login_template = '<?php get_header(); ?>

<!-- Admin Login Section -->
<section class="admin-login-section">
    <div class="container">
        <div class="login-container">
            <div class="login-card">
                <div class="login-header">
                    <div class="login-logo">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h2>Admin Portal</h2>
                    <p>Secure access for administrators and staff</p>
                </div>
                
                <form class="login-form" id="admin-login-form">
                    <div class="form-group">
                        <label for="admin-username">Username</label>
                        <div class="input-with-icon">
                            <i class="fas fa-user"></i>
                            <input type="text" id="admin-username" name="admin-username" placeholder="Enter your username" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="admin-password">Password</label>
                        <div class="input-with-icon">
                            <i class="fas fa-lock"></i>
                            <input type="password" id="admin-password" name="admin-password" placeholder="Enter your password" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="remember-me" name="remember-me">
                            <span class="checkmark"></span>
                            Remember me
                        </label>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-large login-btn">
                        <i class="fas fa-sign-in-alt"></i> Sign In
                    </button>
                    
                    <div class="login-links">
                        <a href="#" class="forgot-password">Forgot Password?</a>
                    </div>
                    
                    <div id="login-status" class="form-status" style="display: none;"></div>
                </form>
                
                <div class="login-footer">
                    <p>Need access? Contact your administrator</p>
                    <div class="security-info">
                        <i class="fas fa-shield-alt"></i>
                        <span>Secure SSL Connection</span>
                    </div>
                </div>
            </div>
            
            <div class="login-info">
                <h3>Administrator Access</h3>
                <div class="access-features">
                    <div class="feature-item">
                        <i class="fas fa-chart-bar"></i>
                        <div>
                            <h4>Dashboard Analytics</h4>
                            <p>View real-time business metrics and performance data</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-tasks"></i>
                        <div>
                            <h4>Order Management</h4>
                            <p>Manage orders, assign tasks, and track progress</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-users"></i>
                        <div>
                            <h4>Team Management</h4>
                            <p>Assign orders to team members and monitor workload</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-file-alt"></i>
                        <div>
                            <h4>Reports & Export</h4>
                            <p>Generate detailed reports and export data</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.admin-login-section {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    display: flex;
    align-items: center;
    padding: 80px 0;
}

.login-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    max-width: 1000px;
    margin: 0 auto;
}

.login-card {
    background: rgba(255,255,255,0.05);
    padding: 50px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.login-header {
    text-align: center;
    margin-bottom: 40px;
}

.login-logo {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--gold), #f4c430);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
}

.login-logo i {
    font-size: 32px;
    color: var(--dark);
}

.login-header h2 {
    color: var(--gold);
    margin-bottom: 10px;
}

.login-header p {
    opacity: 0.8;
    margin: 0;
}

.login-form .form-group {
    margin-bottom: 25px;
}

.input-with-icon {
    position: relative;
}

.input-with-icon i {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gold);
    z-index: 2;
}

.input-with-icon input {
    padding-left: 50px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 14px;
}

.checkbox-label input[type="checkbox"] {
    display: none;
}

.checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 4px;
    position: relative;
    transition: all 0.3s ease;
}

.checkbox-label input:checked + .checkmark {
    background: var(--gold);
    border-color: var(--gold);
}

.checkbox-label input:checked + .checkmark::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--dark);
    font-weight: bold;
    font-size: 12px;
}

.login-btn {
    width: 100%;
    margin: 30px 0 20px;
    padding: 15px;
    font-size: 16px;
}

.login-links {
    text-align: center;
    margin: 20px 0;
}

.forgot-password {
    color: var(--gold);
    text-decoration: none;
    font-size: 14px;
    transition: opacity 0.3s ease;
}

.forgot-password:hover {
    opacity: 0.8;
}

.login-footer {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
}

.login-footer p {
    font-size: 14px;
    opacity: 0.7;
    margin-bottom: 15px;
}

.security-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 12px;
    color: var(--gold);
}

.login-info h3 {
    color: var(--gold);
    margin-bottom: 30px;
    font-size: 28px;
}

.access-features {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.feature-item {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding: 20px;
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
}

.feature-item i {
    color: var(--gold);
    font-size: 24px;
    width: 30px;
    flex-shrink: 0;
    margin-top: 5px;
}

.feature-item h4 {
    color: var(--gold);
    margin: 0 0 8px 0;
    font-size: 16px;
}

.feature-item p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
    line-height: 1.4;
}

@media (max-width: 768px) {
    .login-container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    
    .login-card {
        padding: 30px;
    }
    
    .login-info {
        order: -1;
    }
}
</style>

<script>
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("admin-login-form");
    
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const username = document.getElementById("admin-username").value;
            const password = document.getElementById("admin-password").value;
            const statusDiv = document.getElementById("login-status");
            
            // Simple demo authentication (replace with real authentication)
            if (username === "admin" && password === "admin123") {
                if (statusDiv) {
                    statusDiv.innerHTML = "<div style=\"color: green; padding: 15px; background: rgba(0,255,0,0.1); border-radius: 8px; margin: 15px 0;\">✅ Login successful! Redirecting to dashboard...</div>";
                    statusDiv.style.display = "block";
                }
                
                // Redirect to admin dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = "/jd-transcripts/admin";
                }, 2000);
                
            } else {
                if (statusDiv) {
                    statusDiv.innerHTML = "<div style=\"color: red; padding: 15px; background: rgba(255,0,0,0.1); border-radius: 8px; margin: 15px 0;\">❌ Invalid username or password. Try: admin / admin123</div>";
                    statusDiv.style.display = "block";
                }
                
                // Hide error after 5 seconds
                setTimeout(() => {
                    if (statusDiv) statusDiv.style.display = "none";
                }, 5000);
            }
        });
    }
});
</script>

<?php get_footer(); ?>';

// Save Admin Login template
if (file_put_contents($dest_dir . 'page-admin-login.php', $admin_login_template)) {
    echo "<h2>🔐 Admin Login Page Created!</h2>";
    echo "<p style='color: green;'>✅ page-admin-login.php created successfully!</p>";
    
    echo "<hr>";
    echo "<h3>🔑 Demo Login Credentials:</h3>";
    echo "<div style='background: rgba(255,215,0,0.1); padding: 20px; border-radius: 8px; border: 1px solid var(--gold);'>";
    echo "<p><strong>Username:</strong> admin</p>";
    echo "<p><strong>Password:</strong> admin123</p>";
    echo "</div>";
    
    echo "<hr>";
    echo "<h3>🎯 Admin Login Features:</h3>";
    echo "<ul>";
    echo "<li>✅ Professional login interface</li>";
    echo "<li>✅ Secure authentication form</li>";
    echo "<li>✅ Remember me functionality</li>";
    echo "<li>✅ Responsive design</li>";
    echo "<li>✅ Auto-redirect to dashboard</li>";
    echo "</ul>";
    
} else {
    echo "<p style='color: red;'>❌ Failed to create page-admin-login.php</p>";
}

echo "<style>body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }</style>";
?>