# WordPress Backend Installation Script
# This script installs XAMPP and sets up WordPress as a headless backend

param(
    [switch]$Force
)

Write-Host "========================================" -ForegroundColor Green
Write-Host "🚀 INSTALLING WORDPRESS BACKEND" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "❌ This script needs to run as Administrator" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Function to download file with progress
function Download-File {
    param($Url, $Path, $Name)
    Write-Host "📥 Downloading $Name..." -ForegroundColor Yellow
    try {
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($Url, $Path)
        Write-Host "✅ $Name downloaded successfully" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Failed to download $Name" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Step 1: Install XAMPP
Write-Host "📦 Step 1: Installing XAMPP..." -ForegroundColor Cyan
$xamppUrl = "https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe/download"
$xamppInstaller = "$env:TEMP\xampp-installer.exe"

if (-not (Test-Path "C:\xampp\xampp-control.exe")) {
    if (Download-File $xamppUrl $xamppInstaller "XAMPP Installer") {
        Write-Host "🔧 Installing XAMPP (this may take a few minutes)..." -ForegroundColor Yellow
        try {
            Start-Process -FilePath $xamppInstaller -ArgumentList "--mode unattended --launchapps 0" -Wait
            Write-Host "✅ XAMPP installed successfully" -ForegroundColor Green
        } catch {
            Write-Host "❌ XAMPP installation failed" -ForegroundColor Red
            Write-Host "Please install XAMPP manually from: https://www.apachefriends.org/" -ForegroundColor Yellow
            Read-Host "Press Enter to continue after manual installation"
        }
        Remove-Item $xamppInstaller -Force -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "✅ XAMPP already installed" -ForegroundColor Green
}

# Step 2: Start XAMPP services
Write-Host "🚀 Step 2: Starting XAMPP services..." -ForegroundColor Cyan
try {
    Start-Process -FilePath "C:\xampp\xampp-control.exe"
    Write-Host "✅ XAMPP Control Panel opened" -ForegroundColor Green
    Write-Host "Please start Apache and MySQL services manually" -ForegroundColor Yellow
    Read-Host "Press Enter after starting Apache and MySQL"
} catch {
    Write-Host "⚠️ Please start XAMPP manually using XAMPP Control Panel" -ForegroundColor Yellow
}

# Step 3: Download and setup WordPress
Write-Host "📦 Step 3: Setting up WordPress..." -ForegroundColor Cyan
$wordpressDir = "C:\xampp\htdocs\jd-backend"
$wpUrl = "https://wordpress.org/latest.zip"
$wpZip = "$env:TEMP\wordpress.zip"

# Remove existing directory if Force is specified
if ($Force -and (Test-Path $wordpressDir)) {
    Remove-Item $wordpressDir -Recurse -Force
}

if (-not (Test-Path $wordpressDir) -or $Force) {
    if (Download-File $wpUrl $wpZip "WordPress") {
        Write-Host "📦 Extracting WordPress..." -ForegroundColor Yellow
        try {
            Expand-Archive -Path $wpZip -DestinationPath "C:\xampp\htdocs" -Force
            Move-Item "C:\xampp\htdocs\wordpress" $wordpressDir -Force
            Remove-Item $wpZip -Force
            Write-Host "✅ WordPress extracted to $wordpressDir" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to extract WordPress" -ForegroundColor Red
        }
    }
} else {
    Write-Host "✅ WordPress directory already exists" -ForegroundColor Green
}

# Step 4: Create database
Write-Host "🗄️ Step 4: Creating database..." -ForegroundColor Cyan
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"
if (Test-Path $mysqlPath) {
    try {
        $createDbScript = "CREATE DATABASE IF NOT EXISTS jd_backend; USE jd_backend; GRANT ALL PRIVILEGES ON jd_backend.* TO 'root'@'localhost'; FLUSH PRIVILEGES;"
        $createDbScript | & $mysqlPath -u root
        Write-Host "✅ Database 'jd_backend' created" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Database creation may have failed, but continuing..." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ MySQL not found, please create database manually" -ForegroundColor Yellow
}

# Step 5: Create wp-config.php
Write-Host "⚙️ Step 5: Configuring WordPress..." -ForegroundColor Cyan
$wpConfigContent = @'
<?php
// Database settings
define( 'DB_NAME', 'jd_backend' );
define( 'DB_USER', 'root' );
define( 'DB_PASSWORD', '' );
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );

// Security keys
define('AUTH_KEY',         'jd-transcripts-auth-key-2024');
define('SECURE_AUTH_KEY',  'jd-transcripts-secure-auth-key-2024');
define('LOGGED_IN_KEY',    'jd-transcripts-logged-in-key-2024');
define('NONCE_KEY',        'jd-transcripts-nonce-key-2024');
define('AUTH_SALT',        'jd-transcripts-auth-salt-2024');
define('SECURE_AUTH_SALT', 'jd-transcripts-secure-auth-salt-2024');
define('LOGGED_IN_SALT',   'jd-transcripts-logged-in-salt-2024');
define('NONCE_SALT',       'jd-transcripts-nonce-salt-2024');

// Table prefix
$table_prefix = 'wp_';

// Debug settings
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);

if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}

require_once ABSPATH . 'wp-settings.php';
'@

$wpConfigContent | Out-File -FilePath "$wordpressDir\wp-config.php" -Encoding UTF8
Write-Host "✅ WordPress configuration created" -ForegroundColor Green

# Step 6: Create .htaccess
Write-Host "🔧 Step 6: Configuring permalinks..." -ForegroundColor Cyan
$htaccessContent = @'
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /jd-backend/
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /jd-backend/index.php [L]
</IfModule>
# END WordPress

# Enable CORS
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-WP-Nonce"
    Header always set Access-Control-Max-Age "86400"
</IfModule>
'@

$htaccessContent | Out-File -FilePath "$wordpressDir\.htaccess" -Encoding UTF8
Write-Host "✅ .htaccess configured" -ForegroundColor Green

# Step 7: Create startup script
Write-Host "🚀 Step 7: Creating startup script..." -ForegroundColor Cyan
$startupScript = @'
@echo off
echo ========================================
echo 🚀 Starting JD Transcripts WordPress Backend
echo ========================================
echo.

echo Starting XAMPP Control Panel...
start "" "C:\xampp\xampp-control.exe"

echo.
echo ========================================
echo ✅ WordPress Backend Ready!
echo ========================================
echo.
echo WordPress Admin: http://localhost/jd-backend/wp-admin
echo REST API Base: http://localhost/jd-backend/wp-json/jd-api/v1
echo.
echo Next Steps:
echo 1. Start Apache and MySQL in XAMPP Control Panel
echo 2. Go to: http://localhost/jd-backend
echo 3. Complete WordPress installation
echo 4. Install and activate the JD Transcripts API plugin
echo.
echo Press any key to open WordPress...
pause > nul
start "" "http://localhost/jd-backend"
'@

$startupScript | Out-File -FilePath "c:\Users\Kyle\jd 3\start-wordpress-backend.bat" -Encoding ASCII
Write-Host "✅ Startup script created" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ WORDPRESS BACKEND SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 WordPress Location: $wordpressDir" -ForegroundColor White
Write-Host "🌐 WordPress URL: http://localhost/jd-backend" -ForegroundColor White
Write-Host "🔧 Admin Panel: http://localhost/jd-backend/wp-admin" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Run: start-wordpress-backend.bat" -ForegroundColor White
Write-Host "2. Start Apache and MySQL in XAMPP Control Panel" -ForegroundColor White
Write-Host "3. Go to: http://localhost/jd-backend" -ForegroundColor White
Write-Host "4. Complete WordPress installation" -ForegroundColor White
Write-Host "5. Install the JD Transcripts API plugin" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue"