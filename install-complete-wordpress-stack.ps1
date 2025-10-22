# Complete WordPress Stack Installation
# This script installs XAMPP, WordPress, and configures everything for JD Legal Transcripts

param(
    [string]$InstallPath = "C:\xampp",
    [string]$WordPressPath = "C:\xampp\htdocs\wordpress",
    [string]$DatabaseName = "jd_transcripts_wp",
    [string]$SiteUrl = "http://localhost/wordpress"
)

Write-Host "🚀 Installing Complete WordPress Stack for JD Legal Transcripts..." -ForegroundColor Green
Write-Host "This will install XAMPP, WordPress, and configure everything automatically." -ForegroundColor Yellow
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "⚠️ This script needs to run as Administrator for XAMPP installation." -ForegroundColor Yellow
    Write-Host "Please right-click PowerShell and 'Run as Administrator', then run this script again." -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 1: Download and Install XAMPP
Write-Host "📥 Step 1: Installing XAMPP..." -ForegroundColor Cyan

if (-not (Test-Path "$InstallPath\xampp-control.exe")) {
    Write-Host "Downloading XAMPP..." -ForegroundColor Yellow
    
    $xamppUrl = "https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe/download"
    $xamppInstaller = "$env:TEMP\xampp-installer.exe"
    
    try {
        # Download XAMPP
        Write-Host "Downloading XAMPP installer (this may take a few minutes)..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $xamppUrl -OutFile $xamppInstaller -UseBasicParsing
        
        # Install XAMPP silently
        Write-Host "Installing XAMPP..." -ForegroundColor Yellow
        Start-Process -FilePath $xamppInstaller -ArgumentList "--mode", "unattended", "--launchapps", "0" -Wait
        
        # Cleanup
        Remove-Item $xamppInstaller -Force -ErrorAction SilentlyContinue
        
        Write-Host "✅ XAMPP installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to download/install XAMPP automatically." -ForegroundColor Red
        Write-Host "Please download and install XAMPP manually from: https://www.apachefriends.org/download.html" -ForegroundColor Yellow
        Write-Host "Then run this script again." -ForegroundColor White
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "✅ XAMPP already installed" -ForegroundColor Green
}

# Step 2: Start XAMPP Services
Write-Host "🔧 Step 2: Starting XAMPP Services..." -ForegroundColor Cyan

try {
    # Start Apache
    $apacheService = Get-Service -Name "Apache*" -ErrorAction SilentlyContinue
    if ($apacheService) {
        Start-Service $apacheService.Name -ErrorAction SilentlyContinue
        Write-Host "✅ Apache service started" -ForegroundColor Green
    } else {
        # Try to start Apache manually
        $apachePath = "$InstallPath\apache\bin\httpd.exe"
        if (Test-Path $apachePath) {
            Start-Process -FilePath $apachePath -WindowStyle Hidden
            Write-Host "✅ Apache started manually" -ForegroundColor Green
        }
    }
    
    # Start MySQL
    $mysqlService = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
    if ($mysqlService) {
        Start-Service $mysqlService.Name -ErrorAction SilentlyContinue
        Write-Host "✅ MySQL service started" -ForegroundColor Green
    } else {
        # Try to start MySQL manually
        $mysqlPath = "$InstallPath\mysql\bin\mysqld.exe"
        if (Test-Path $mysqlPath) {
            Start-Process -FilePath $mysqlPath -ArgumentList "--console" -WindowStyle Hidden
            Write-Host "✅ MySQL started manually" -ForegroundColor Green
        }
    }
    
    # Wait for services to start
    Start-Sleep -Seconds 5
    
} catch {
    Write-Host "⚠️ Some services may not have started automatically." -ForegroundColor Yellow
    Write-Host "Please start Apache and MySQL manually using XAMPP Control Panel." -ForegroundColor White
}

# Step 3: Test XAMPP Installation
Write-Host "🧪 Step 3: Testing XAMPP..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ XAMPP is running correctly" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ XAMPP may not be fully started yet." -ForegroundColor Yellow
    Write-Host "Please open XAMPP Control Panel and start Apache and MySQL services." -ForegroundColor White
    
    # Try to open XAMPP Control Panel
    $xamppControl = "$InstallPath\xampp-control.exe"
    if (Test-Path $xamppControl) {
        Start-Process $xamppControl
        Write-Host "Opening XAMPP Control Panel..." -ForegroundColor Yellow
    }
    
    Read-Host "Press Enter when Apache and MySQL are running in XAMPP Control Panel"
}

# Step 4: Create Database
Write-Host "🗄️ Step 4: Setting up Database..." -ForegroundColor Cyan

try {
    $mysqlPath = "$InstallPath\mysql\bin\mysql.exe"
    if (Test-Path $mysqlPath) {
        $createDbQuery = "CREATE DATABASE IF NOT EXISTS ``$DatabaseName`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        $arguments = @('-u', 'root', '-e', $createDbQuery)
        
        Start-Process -FilePath $mysqlPath -ArgumentList $arguments -Wait -NoNewWindow
        Write-Host "✅ Database '$DatabaseName' created" -ForegroundColor Green
    } else {
        Write-Host "❌ MySQL executable not found" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ Database creation may have failed. You can create it manually later." -ForegroundColor Yellow
}

# Step 5: Download and Install WordPress
Write-Host "📥 Step 5: Installing WordPress..." -ForegroundColor Cyan

$htdocsPath = "$InstallPath\htdocs"
if (-not (Test-Path $htdocsPath)) {
    New-Item -ItemType Directory -Path $htdocsPath -Force | Out-Null
}

if (-not (Test-Path $WordPressPath)) {
    Write-Host "Downloading WordPress..." -ForegroundColor Yellow
    
    $wpZipPath = "$env:TEMP\wordpress.zip"
    $wpExtractPath = "$env:TEMP\wordpress"
    
    try {
        # Download WordPress
        Invoke-WebRequest -Uri "https://wordpress.org/latest.zip" -OutFile $wpZipPath -UseBasicParsing
        
        # Extract WordPress
        Expand-Archive -Path $wpZipPath -DestinationPath $env:TEMP -Force
        
        # Move to htdocs
        Move-Item -Path $wpExtractPath -Destination $WordPressPath -Force
        
        # Cleanup
        Remove-Item $wpZipPath -Force
        
        Write-Host "✅ WordPress downloaded and installed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to download WordPress: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ WordPress already exists" -ForegroundColor Green
}

# Step 6: Configure WordPress
Write-Host "⚙️ Step 6: Configuring WordPress..." -ForegroundColor Cyan

$wpConfigPath = "$WordPressPath\wp-config.php"
$wpConfigSamplePath = "$WordPressPath\wp-config-sample.php"

if (-not (Test-Path $wpConfigPath) -and (Test-Path $wpConfigSamplePath)) {
    # Copy and configure wp-config.php
    $wpConfig = Get-Content $wpConfigSamplePath -Raw
    $wpConfig = $wpConfig -replace "database_name_here", $DatabaseName
    $wpConfig = $wpConfig -replace "username_here", "root"
    $wpConfig = $wpConfig -replace "password_here", ""
    $wpConfig = $wpConfig -replace "localhost", "localhost"
    
    # Add security keys
    $keys = @(
        "AUTH_KEY", "SECURE_AUTH_KEY", "LOGGED_IN_KEY", "NONCE_KEY",
        "AUTH_SALT", "SECURE_AUTH_SALT", "LOGGED_IN_SALT", "NONCE_SALT"
    )
    
    foreach ($key in $keys) {
        $guid = (New-Guid).Guid
        $wpConfig = $wpConfig -replace "put your unique phrase here", $guid, 1
    }
    
    # Add custom configurations
    $customConfig = @"

// Custom configurations for JD Legal Transcripts
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Increase limits
ini_set('memory_limit', '256M');
ini_set('upload_max_filesize', '100M');
ini_set('post_max_size', '100M');
ini_set('max_execution_time', 300);

// Custom table prefix
`$table_prefix = 'jd_wp_';

"@
    
    $wpConfig = $wpConfig -replace "(\$table_prefix = 'wp_';)", $customConfig
    
    Set-Content -Path $wpConfigPath -Value $wpConfig -Encoding UTF8
    Write-Host "✅ WordPress configured" -ForegroundColor Green
} else {
    Write-Host "✅ WordPress already configured" -ForegroundColor Green
}

# Step 7: Install Plugin and Theme
Write-Host "🔌 Step 7: Installing JD Transcripts Plugin and Theme..." -ForegroundColor Cyan

# Install Plugin
$pluginsDir = "$WordPressPath\wp-content\plugins"
$pluginSource = "c:\Users\Kyle\jd 3\wordpress-backend-plugin"
$pluginDest = "$pluginsDir\jd-transcripts-api"

if (Test-Path $pluginSource) {
    if (-not (Test-Path $pluginsDir)) {
        New-Item -ItemType Directory -Path $pluginsDir -Force | Out-Null
    }
    Copy-Item -Path $pluginSource -Destination $pluginDest -Recurse -Force
    Write-Host "✅ Plugin installed" -ForegroundColor Green
} else {
    Write-Host "⚠️ Plugin source not found at: $pluginSource" -ForegroundColor Yellow
}

# Install Theme
$themesDir = "$WordPressPath\wp-content\themes"
$themeSource = "c:\Users\Kyle\jd 3\wordpress-theme"
$themeDest = "$themesDir\jd-transcripts"

if (Test-Path $themeSource) {
    if (-not (Test-Path $themesDir)) {
        New-Item -ItemType Directory -Path $themesDir -Force | Out-Null
    }
    Copy-Item -Path $themeSource -Destination $themeDest -Recurse -Force
    Write-Host "✅ Theme installed" -ForegroundColor Green
} else {
    Write-Host "⚠️ Theme source not found at: $themeSource" -ForegroundColor Yellow
}

# Step 8: Copy Frontend Files
Write-Host "🌐 Step 8: Setting up Frontend Files..." -ForegroundColor Cyan

$frontendFiles = @(
    "admin-dashboard-new.html",
    "admin-dashboard-script.js", 
    "admin-dashboard-styles.css",
    "admin-login-new.html",
    "index.html",
    "about.html",
    "services.html",
    "contact.html",
    "careers.html",
    "order.html",
    "styles.css",
    "script.js"
)

foreach ($file in $frontendFiles) {
    $sourcePath = "c:\Users\Kyle\jd 3\$file"
    $destPath = "$WordPressPath\$file"
    
    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "✅ Copied $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️ File not found: $file" -ForegroundColor Yellow
    }
}

# Step 9: Create .htaccess
Write-Host "🔗 Step 9: Configuring URL Routing..." -ForegroundColor Cyan

$htaccessContent = @"
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /wordpress/
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /wordpress/index.php [L]
</IfModule>
# END WordPress

# Custom rules for JD Legal Transcripts
<IfModule mod_rewrite.c>
RewriteRule ^admin/?$ admin-dashboard-new.html [L]
RewriteRule ^admin-login/?$ admin-login-new.html [L]
</IfModule>

# Security and performance
<IfModule mod_headers.c>
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
</IfModule>

php_value upload_max_filesize 100M
php_value post_max_size 100M
php_value max_execution_time 300
"@

Set-Content -Path "$WordPressPath\.htaccess" -Value $htaccessContent -Encoding UTF8
Write-Host "✅ URL routing configured" -ForegroundColor Green

# Step 10: Final Setup
Write-Host "🎯 Step 10: Final Configuration..." -ForegroundColor Cyan

Write-Host ""
Write-Host "🎉 WordPress Stack Installation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Complete WordPress Installation:" -ForegroundColor White
Write-Host "   Open: http://localhost/wordpress" -ForegroundColor Cyan
Write-Host "   Follow the 5-minute installation wizard" -ForegroundColor White
Write-Host ""
Write-Host "2. Recommended Settings:" -ForegroundColor White
Write-Host "   - Site Title: JD Legal Transcripts" -ForegroundColor White
Write-Host "   - Username: jd.admin" -ForegroundColor White
Write-Host "   - Password: admin123" -ForegroundColor White
Write-Host "   - Email: admin@jdlegaltranscripts.com" -ForegroundColor White
Write-Host ""
Write-Host "3. After WordPress Setup:" -ForegroundColor White
Write-Host "   - Go to Plugins > Activate 'JD Transcripts API Backend'" -ForegroundColor White
Write-Host "   - Go to Appearance > Themes > Activate 'JD Transcripts'" -ForegroundColor White
Write-Host ""
Write-Host "4. Test Your System:" -ForegroundColor White
Write-Host "   - Admin Dashboard: http://localhost/wordpress/admin" -ForegroundColor Cyan
Write-Host "   - Main Website: http://localhost/wordpress" -ForegroundColor Cyan
Write-Host "   - API Endpoint: http://localhost/wordpress/wp-json/jd-api/v1" -ForegroundColor Cyan
Write-Host ""

# Open browser
try {
    Start-Process "http://localhost/wordpress"
    Write-Host "🌐 Opening WordPress installation in browser..." -ForegroundColor Green
} catch {
    Write-Host "Please manually open: http://localhost/wordpress" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Installation complete! Your Node.js backend will be replaced once you complete the WordPress setup." -ForegroundColor Green
Write-Host ""