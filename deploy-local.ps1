# JD Transcripts WordPress Local Deployment Script
# Run this script as Administrator

Write-Host "========================================" -ForegroundColor Green
Write-Host "JD Transcripts WordPress Backend Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script requires Administrator privileges. Please run as Administrator." -ForegroundColor Red
    pause
    exit 1
}

$xamppPath = "C:\xampp"
$wordpressPath = "$xamppPath\htdocs\jd-transcripts"
$pluginSourcePath = "c:\Users\Kyle\jd 3\wordpress-backend-plugin"
$pluginDestPath = "$wordpressPath\wp-content\plugins\jd-transcripts-api"

Write-Host "Step 1: Checking XAMPP installation..." -ForegroundColor Yellow

if (!(Test-Path $xamppPath)) {
    Write-Host "XAMPP not found. Please install XAMPP first:" -ForegroundColor Red
    Write-Host "1. Download from https://www.apachefriends.org/download.html" -ForegroundColor White
    Write-Host "2. Install to C:\xampp" -ForegroundColor White
    Write-Host "3. Run this script again" -ForegroundColor White
    pause
    exit 1
} else {
    Write-Host "✓ XAMPP found at $xamppPath" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Starting XAMPP services..." -ForegroundColor Yellow

# Start XAMPP services
try {
    Start-Process "$xamppPath\xampp-control.exe" -WindowStyle Normal
    Write-Host "✓ XAMPP Control Panel opened. Please start Apache and MySQL services." -ForegroundColor Green
    Write-Host "Press any key after starting the services..." -ForegroundColor White
    pause
} catch {
    Write-Host "Could not start XAMPP Control Panel. Please start it manually." -ForegroundColor Red
    pause
}

Write-Host ""
Write-Host "Step 3: Downloading WordPress..." -ForegroundColor Yellow

if (!(Test-Path $wordpressPath)) {
    try {
        $wordpressUrl = "https://wordpress.org/latest.zip"
        $tempZip = "$env:TEMP\wordpress.zip"
        
        Write-Host "Downloading WordPress..." -ForegroundColor White
        Invoke-WebRequest -Uri $wordpressUrl -OutFile $tempZip
        
        Write-Host "Extracting WordPress..." -ForegroundColor White
        Expand-Archive -Path $tempZip -DestinationPath "$xamppPath\htdocs\" -Force
        
        # Rename wordpress folder to jd-transcripts
        if (Test-Path "$xamppPath\htdocs\wordpress") {
            Rename-Item "$xamppPath\htdocs\wordpress" "jd-transcripts"
        }
        
        Remove-Item $tempZip -Force
        Write-Host "✓ WordPress downloaded and extracted to $wordpressPath" -ForegroundColor Green
    } catch {
        Write-Host "Failed to download WordPress automatically. Please download manually:" -ForegroundColor Red
        Write-Host "1. Go to https://wordpress.org/download/" -ForegroundColor White
        Write-Host "2. Download and extract to $wordpressPath" -ForegroundColor White
        pause
    }
} else {
    Write-Host "✓ WordPress already exists at $wordpressPath" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 4: Creating database..." -ForegroundColor Yellow

Write-Host "Please create the database manually:" -ForegroundColor White
Write-Host "1. Open http://localhost/phpmyadmin in your browser" -ForegroundColor White
Write-Host "2. Click 'New' to create a new database" -ForegroundColor White
Write-Host "3. Name it 'jd_transcripts'" -ForegroundColor White
Write-Host "4. Click 'Create'" -ForegroundColor White
Write-Host ""
Write-Host "Press any key after creating the database..." -ForegroundColor White
pause

Write-Host ""
Write-Host "Step 5: Setting up WordPress configuration..." -ForegroundColor Yellow

# Create wp-config.php
$wpConfigContent = @"
<?php
define( 'DB_NAME', 'jd_transcripts' );
define( 'DB_USER', 'root' );
define( 'DB_PASSWORD', '' );
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );

define( 'AUTH_KEY',         'put your unique phrase here' );
define( 'SECURE_AUTH_KEY',  'put your unique phrase here' );
define( 'LOGGED_IN_KEY',    'put your unique phrase here' );
define( 'NONCE_KEY',        'put your unique phrase here' );
define( 'AUTH_SALT',        'put your unique phrase here' );
define( 'SECURE_AUTH_SALT', 'put your unique phrase here' );
define( 'LOGGED_IN_SALT',   'put your unique phrase here' );
define( 'NONCE_SALT',       'put your unique phrase here' );

`$table_prefix = 'wp_';

define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );

if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}

require_once ABSPATH . 'wp-settings.php';
"@

$wpConfigPath = "$wordpressPath\wp-config.php"
if (!(Test-Path $wpConfigPath)) {
    $wpConfigContent | Out-File -FilePath $wpConfigPath -Encoding UTF8
    Write-Host "✓ wp-config.php created" -ForegroundColor Green
} else {
    Write-Host "✓ wp-config.php already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 6: Copying plugin files..." -ForegroundColor Yellow

if (Test-Path $pluginSourcePath) {
    try {
        # Create plugins directory if it doesn't exist
        $pluginsDir = "$wordpressPath\wp-content\plugins"
        if (!(Test-Path $pluginsDir)) {
            New-Item -ItemType Directory -Path $pluginsDir -Force
        }
        
        # Copy plugin files
        Copy-Item -Path $pluginSourcePath -Destination $pluginDestPath -Recurse -Force
        Write-Host "✓ Plugin files copied to $pluginDestPath" -ForegroundColor Green
    } catch {
        Write-Host "Failed to copy plugin files. Please copy manually:" -ForegroundColor Red
        Write-Host "Copy from: $pluginSourcePath" -ForegroundColor White
        Write-Host "Copy to: $pluginDestPath" -ForegroundColor White
        pause
    }
} else {
    Write-Host "Plugin source not found at $pluginSourcePath" -ForegroundColor Red
    Write-Host "Please ensure the wordpress-backend-plugin folder exists." -ForegroundColor White
    pause
}

Write-Host ""
Write-Host "Step 7: Opening WordPress installation..." -ForegroundColor Yellow

try {
    Start-Process "http://localhost/jd-transcripts"
    Write-Host "✓ WordPress installation page opened in browser" -ForegroundColor Green
} catch {
    Write-Host "Please open http://localhost/jd-transcripts in your browser manually" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Instructions:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Complete WordPress installation at: http://localhost/jd-transcripts" -ForegroundColor White
Write-Host "   - Site Title: JD Legal Transcripts" -ForegroundColor Gray
Write-Host "   - Username: admin" -ForegroundColor Gray
Write-Host "   - Password: (choose a strong password)" -ForegroundColor Gray
Write-Host "   - Email: your-email@example.com" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Login to WordPress admin: http://localhost/jd-transcripts/wp-admin" -ForegroundColor White
Write-Host ""
Write-Host "3. Activate the plugin:" -ForegroundColor White
Write-Host "   - Go to Plugins > Installed Plugins" -ForegroundColor Gray
Write-Host "   - Find 'JD Transcripts API Backend'" -ForegroundColor Gray
Write-Host "   - Click 'Activate'" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Run the setup wizard:" -ForegroundColor White
Write-Host "   - Go to Tools > JD API Setup" -ForegroundColor Gray
Write-Host "   - Configure your settings" -ForegroundColor Gray
Write-Host "   - Click 'Run Setup'" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Your API will be available at:" -ForegroundColor White
Write-Host "   http://localhost/jd-transcripts/wp-json/jd-api/v1" -ForegroundColor Cyan
Write-Host ""
Write-Host "6. Update your frontend to use the new API URL" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to continue..." -ForegroundColor White
pause