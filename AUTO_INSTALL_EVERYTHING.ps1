# JD Transcripts - Automated WordPress Setup (PowerShell)
# Run as Administrator

param(
    [switch]$Force
)

# Set execution policy for this session
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   JD TRANSCRIPTS AUTO INSTALLER" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🤖 Automated WordPress setup starting..." -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "❌ This script needs Administrator privileges" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Running with Administrator privileges" -ForegroundColor Green
Write-Host ""

# Create directories
Write-Host "📁 Creating directories..." -ForegroundColor Yellow
$directories = @(
    "C:\xampp",
    "C:\xampp\htdocs",
    "C:\xampp\htdocs\jd-transcripts",
    "C:\temp"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}
Write-Host "✅ Directories created" -ForegroundColor Green
Write-Host ""

# Function to download file with progress
function Download-FileWithProgress {
    param(
        [string]$Url,
        [string]$OutputPath,
        [string]$Description
    )
    
    try {
        Write-Host "📥 Downloading $Description..." -ForegroundColor Yellow
        $webClient = New-Object System.Net.WebClient
        
        # Register progress event
        Register-ObjectEvent -InputObject $webClient -EventName DownloadProgressChanged -Action {
            $percent = $Event.SourceEventArgs.ProgressPercentage
            Write-Progress -Activity "Downloading $Description" -Status "$percent% Complete" -PercentComplete $percent
        } | Out-Null
        
        $webClient.DownloadFile($Url, $OutputPath)
        $webClient.Dispose()
        Write-Progress -Activity "Downloading $Description" -Completed
        Write-Host "✅ $Description downloaded successfully!" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Failed to download $Description" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Download XAMPP
$xamppUrl = "https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe/download"
$xamppPath = "C:\temp\xampp-installer.exe"

if (!(Test-Path "C:\xampp\xampp-control.exe")) {
    if (Download-FileWithProgress -Url $xamppUrl -OutputPath $xamppPath -Description "XAMPP") {
        Write-Host "🔧 Installing XAMPP..." -ForegroundColor Yellow
        Write-Host "Please follow the installer prompts (install to C:\xampp)" -ForegroundColor Cyan
        Start-Process -FilePath $xamppPath -ArgumentList "/S" -Wait
        Write-Host "✅ XAMPP installation completed" -ForegroundColor Green
    } else {
        Write-Host "Please download XAMPP manually from: https://www.apachefriends.org/" -ForegroundColor Yellow
        Start-Process "https://www.apachefriends.org/download.html"
        Read-Host "Press Enter after installing XAMPP"
    }
} else {
    Write-Host "✅ XAMPP already installed" -ForegroundColor Green
}
Write-Host ""

# Download WordPress
$wordpressUrl = "https://wordpress.org/latest.zip"
$wordpressPath = "C:\temp\wordpress.zip"

if (!(Test-Path "C:\xampp\htdocs\jd-transcripts\wp-config-sample.php")) {
    if (Download-FileWithProgress -Url $wordpressUrl -OutputPath $wordpressPath -Description "WordPress") {
        Write-Host "📦 Extracting WordPress..." -ForegroundColor Yellow
        Expand-Archive -Path $wordpressPath -DestinationPath "C:\temp\" -Force
        
        Write-Host "📋 Copying WordPress files..." -ForegroundColor Yellow
        Copy-Item -Path "C:\temp\wordpress\*" -Destination "C:\xampp\htdocs\jd-transcripts\" -Recurse -Force
        Write-Host "✅ WordPress files copied" -ForegroundColor Green
    } else {
        Write-Host "Please download WordPress manually from: https://wordpress.org/download/" -ForegroundColor Yellow
        Start-Process "https://wordpress.org/download/"
        Write-Host "Extract to: C:\xampp\htdocs\jd-transcripts\" -ForegroundColor Cyan
        Start-Process "C:\xampp\htdocs\jd-transcripts"
        Read-Host "Press Enter after extracting WordPress"
    }
} else {
    Write-Host "✅ WordPress already installed" -ForegroundColor Green
}
Write-Host ""

# Copy theme files
Write-Host "🎨 Installing JD Transcripts theme..." -ForegroundColor Yellow
$themeSource = "c:\Users\Kyle\jd 3\wordpress\wp-content\themes\jd-transcripts"
$themeDestination = "C:\xampp\htdocs\jd-transcripts\wp-content\themes\jd-transcripts"

if (Test-Path $themeSource) {
    if (!(Test-Path $themeDestination)) {
        Copy-Item -Path $themeSource -Destination $themeDestination -Recurse -Force
        Write-Host "✅ JD Transcripts theme installed" -ForegroundColor Green
    } else {
        Write-Host "✅ Theme already exists" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Theme source not found at: $themeSource" -ForegroundColor Red
}
Write-Host ""

# Create wp-config.php
Write-Host "⚙️ Creating WordPress configuration..." -ForegroundColor Yellow
$wpConfigSample = "C:\xampp\htdocs\jd-transcripts\wp-config-sample.php"
$wpConfig = "C:\xampp\htdocs\jd-transcripts\wp-config.php"

if ((Test-Path $wpConfigSample) -and !(Test-Path $wpConfig)) {
    $content = Get-Content $wpConfigSample
    $content = $content -replace 'database_name_here', 'jd_transcripts'
    $content = $content -replace 'username_here', 'root'
    $content = $content -replace 'password_here', ''
    $content = $content -replace 'localhost', 'localhost'
    
    # Add security keys
    $content = $content -replace "put your unique phrase here", (New-Guid).Guid
    
    Set-Content -Path $wpConfig -Value $content
    Write-Host "✅ WordPress configuration created" -ForegroundColor Green
}
Write-Host ""

# Start XAMPP services
Write-Host "🚀 Starting XAMPP services..." -ForegroundColor Yellow
if (Test-Path "C:\xampp\xampp-control.exe") {
    Start-Process "C:\xampp\xampp-control.exe"
    Write-Host "✅ XAMPP Control Panel opened" -ForegroundColor Green
    Write-Host "Please start Apache and MySQL services" -ForegroundColor Cyan
} else {
    Write-Host "❌ XAMPP Control Panel not found" -ForegroundColor Red
}
Write-Host ""

# Wait for services
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Create database
Write-Host "💾 Creating database..." -ForegroundColor Yellow
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"
if (Test-Path $mysqlPath) {
    try {
        $createDbCommand = "CREATE DATABASE IF NOT EXISTS jd_transcripts CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
        $createDbCommand | & $mysqlPath -u root 2>$null
        Write-Host "✅ Database 'jd_transcripts' created" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Please create database manually in phpMyAdmin" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ Please create database manually in phpMyAdmin" -ForegroundColor Yellow
}
Write-Host ""

# Create .htaccess
Write-Host "📝 Creating .htaccess file..." -ForegroundColor Yellow
$htaccessContent = @"
# BEGIN WordPress
RewriteEngine On
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /jd-transcripts/index.php [L]
# END WordPress
"@

Set-Content -Path "C:\xampp\htdocs\jd-transcripts\.htaccess" -Value $htaccessContent
Write-Host "✅ .htaccess created" -ForegroundColor Green
Write-Host ""

# Open browser windows
Write-Host "🌐 Opening setup URLs..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Start-Process "http://localhost/jd-transcripts"
Write-Host "✅ WordPress installation opened" -ForegroundColor Green

Start-Sleep -Seconds 2
Start-Process "http://localhost/phpmyadmin"
Write-Host "✅ phpMyAdmin opened" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   AUTOMATED SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 NEXT STEPS (Manual):" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣ WORDPRESS INSTALLATION (Browser tab 1):" -ForegroundColor Yellow
Write-Host "   - Select language: English" -ForegroundColor White
Write-Host "   - Database: jd_transcripts" -ForegroundColor White
Write-Host "   - Username: root" -ForegroundColor White
Write-Host "   - Password: (leave empty)" -ForegroundColor White
Write-Host "   - Complete installation" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣ ACTIVATE THEME:" -ForegroundColor Yellow
Write-Host "   - Login to WordPress admin" -ForegroundColor White
Write-Host "   - Go to Appearance > Themes" -ForegroundColor White
Write-Host "   - Activate 'JD Transcripts Professional'" -ForegroundColor White
Write-Host ""
Write-Host "3️⃣ CREATE ADMIN PAGE:" -ForegroundColor Yellow
Write-Host "   - Pages > Add New" -ForegroundColor White
Write-Host "   - Title: Admin Dashboard" -ForegroundColor White
Write-Host "   - Template: Admin Dashboard" -ForegroundColor White
Write-Host "   - Slug: admin" -ForegroundColor White
Write-Host "   - Publish" -ForegroundColor White
Write-Host ""
Write-Host "🌐 YOUR URLS:" -ForegroundColor Cyan
Write-Host "   Website: http://localhost/jd-transcripts" -ForegroundColor White
Write-Host "   Admin: http://localhost/jd-transcripts/wp-admin" -ForegroundColor White
Write-Host "   Dashboard: http://localhost/jd-transcripts/admin" -ForegroundColor White
Write-Host "   phpMyAdmin: http://localhost/phpmyadmin" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   READY TO TEST!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"