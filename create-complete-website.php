<?php
// Create the complete JD Transcripts website
echo "<h1>🌐 Creating Complete JD Transcripts Website</h1>";

$base_dir = 'C:/xampp/htdocs/jd-transcripts/';
$theme_dir = $base_dir . 'wp-content/themes/jd-transcripts/';

// Ensure directories exist
if (!file_exists($theme_dir)) {
    mkdir($theme_dir, 0755, true);
}

// 1. Main stylesheet (style.css)
$css_content = '/*
Theme Name: JD Transcripts
Description: Professional transcription services theme
Version: 1.0
*/

:root {
    --primary: #d4af37;
    --gold: #d4af37;
    --dark: #1a1a1a;
    --darker: #0f0f0f;
    --light: #ffffff;
    --gray: #666666;
    --border: rgba(255,255,255,0.1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: "Poppins", sans-serif;
    background: var(--dark);
    color: var(--light);
    line-height: 1.6;
    overflow-x: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    padding: 15px 0;
    border-bottom: 1px solid var(--border);
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: 15px;
}

.logo {
    width: 50px;
    height: 50px;
    border-radius: 8px;
}

.logo-text-container {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}

.logo-text {
    color: var(--gold);
    font-weight: 600;
    font-size: 16px;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 30px;
    align-items: center;
}

.nav-link {
    color: var(--light);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
}

.nav-link:hover {
    color: var(--gold);
}

.dropdown {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 0;
    min-width: 220px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.dropdown:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.dropdown-link {
    display: block;
    padding: 12px 20px;
    color: var(--light);
    text-decoration: none;
    transition: all 0.3s ease;
}

.dropdown-link:hover {
    background: rgba(212,175,55,0.1);
    color: var(--gold);
    padding-left: 25px;
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 15px;
}

.btn {
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background: linear-gradient(135deg, var(--gold), #f4c430);
    color: var(--dark);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212,175,55,0.3);
}

.btn-secondary {
    background: rgba(255,255,255,0.1);
    color: var(--gold);
    border: 1px solid rgba(255,255,255,0.2);
}

.btn-secondary:hover {
    background: var(--gold);
    color: var(--dark);
}

.btn-large {
    padding: 16px 32px;
    font-size: 18px;
}

.hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
    gap: 4px;
}

.bar {
    width: 25px;
    height: 3px;
    background: var(--light);
    transition: 0.3s;
}

/* Hero Section */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, var(--dark) 0%, var(--darker) 100%);
    position: relative;
    overflow: hidden;
}

.hero::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23d4af37\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
}

.hero-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    position: relative;
    z-index: 1;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 24px;
    background: linear-gradient(135deg, var(--light), var(--gold));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    margin-bottom: 32px;
    line-height: 1.6;
}

.hero-buttons {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
}

.hero-graphic {
    display: flex;
    align-items: center;
    gap: 40px;
    padding: 40px;
    background: rgba(255,255,255,0.05);
    border-radius: 20px;
    border: 1px solid var(--border);
    backdrop-filter: blur(10px);
}

.graphic-item {
    text-align: center;
    padding: 30px;
    background: rgba(212,175,55,0.1);
    border-radius: 15px;
    border: 1px solid rgba(212,175,55,0.2);
}

.graphic-item i {
    font-size: 3rem;
    color: var(--gold);
    margin-bottom: 15px;
    display: block;
}

.graphic-item span {
    font-weight: 600;
    color: var(--light);
}

.hero-graphic .fas.fa-arrow-right {
    font-size: 2rem;
    color: var(--gold);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* Sections */
section {
    padding: 100px 0;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 60px;
    color: var(--gold);
}

/* Features */
.features {
    background: rgba(255,255,255,0.02);
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 40px;
}

.feature-card {
    background: rgba(255,255,255,0.05);
    padding: 40px 30px;
    border-radius: 15px;
    border: 1px solid var(--border);
    text-align: center;
    transition: all 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    border-color: var(--gold);
}

.feature-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--gold), #f4c430);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 25px;
}

.feature-icon i {
    font-size: 2rem;
    color: var(--dark);
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: var(--gold);
}

.feature-card p {
    opacity: 0.9;
    line-height: 1.6;
}

/* Services */
.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
}

.service-card {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    border: 1px solid var(--border);
    overflow: hidden;
    transition: all 0.3s ease;
}

.service-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
}

.service-icon {
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, var(--gold), #f4c430);
    display: flex;
    align-items: center;
    justify-content: center;
}

.service-icon i {
    font-size: 4rem;
    color: var(--dark);
}

.service-card .content {
    padding: 30px;
}

.service-card h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: var(--gold);
}

.service-features {
    list-style: none;
    margin: 20px 0;
}

.service-features li {
    padding: 8px 0;
    padding-left: 25px;
    position: relative;
    opacity: 0.9;
}

.service-features li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--gold);
    font-weight: bold;
}

.service-meta {
    margin: 20px 0;
    padding: 15px;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
}

.service-meta span {
    display: block;
    margin-bottom: 5px;
    font-size: 0.9rem;
}

/* Forms */
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 25px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--gold);
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 15px;
    background: rgba(255,255,255,0.1);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--light);
    font-size: 16px;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212,175,55,0.1);
}

.file-upload {
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
}

.file-upload:hover {
    border-color: var(--gold);
    background: rgba(212,175,55,0.05);
}

.file-upload input[type="file"] {
    display: none;
}

.file-upload-content i {
    font-size: 3rem;
    color: var(--gold);
    margin-bottom: 15px;
    display: block;
}

.file-info {
    font-size: 0.9rem;
    opacity: 0.7;
    margin-top: 10px;
}

/* Footer */
.footer {
    background: var(--darker);
    padding: 60px 0 30px;
    border-top: 1px solid var(--border);
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    margin-bottom: 40px;
}

.footer-section h3 {
    color: var(--gold);
    margin-bottom: 20px;
    font-size: 1.25rem;
}

.footer-section p,
.footer-section li {
    opacity: 0.8;
    line-height: 1.6;
}

.footer-section ul {
    list-style: none;
}

.footer-section ul li {
    margin-bottom: 8px;
}

.footer-section a {
    color: var(--light);
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-section a:hover {
    color: var(--gold);
}

.footer-bottom {
    text-align: center;
    padding-top: 30px;
    border-top: 1px solid var(--border);
    opacity: 0.7;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 80px;
        left: -100%;
        width: 100%;
        height: calc(100vh - 80px);
        background: rgba(26, 26, 26, 0.98);
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding-top: 50px;
        transition: left 0.3s ease;
    }
    
    .nav-menu.active {
        left: 0;
    }
    
    .hamburger {
        display: flex;
    }
    
    .hero-container {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 40px;
    }
    
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-buttons {
        justify-content: center;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .nav-actions {
        flex-direction: column;
        gap: 10px;
        width: 100%;
        margin-top: 20px;
    }
}

/* Admin Styles */
.admin-dashboard {
    background: var(--dark);
    min-height: 100vh;
    padding: 0;
}

.dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 30px;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    padding: 30px;
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    border: 1px solid var(--border);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
}

.stat-card {
    background: rgba(255,255,255,0.05);
    padding: 30px;
    border-radius: 15px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.stat-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--gold), #f4c430);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-icon i {
    font-size: 24px;
    color: var(--dark);
}

.stat-number {
    font-size: 32px;
    font-weight: bold;
    color: var(--gold);
    margin-bottom: 5px;
}

.stat-label {
    font-size: 14px;
    opacity: 0.8;
}

/* Utility Classes */
.text-center { text-align: center; }
.text-gold { color: var(--gold); }
.mb-20 { margin-bottom: 20px; }
.mt-20 { margin-top: 20px; }
.p-20 { padding: 20px; }

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    animation: fadeInUp 0.6s ease-out;
}';

file_put_contents($theme_dir . 'style.css', $css_content);
echo "<p style='color: green;'>✅ Created style.css</p>";

// Continue with the next part...
echo "<p>Creating remaining files...</p>";
?>