# JD Transcripts - Simple Automated Setup
Write-Host "JD TRANSCRIPTS AUTO INSTALLER" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

# Create directories
Write-Host "Creating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "C:\xampp\htdocs\jd-transcripts" -Force | Out-Null
New-Item -ItemType Directory -Path "C:\temp" -Force | Out-Null
Write-Host "Directories created!" -ForegroundColor Green

# Download WordPress
Write-Host "Downloading WordPress..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://wordpress.org/latest.zip" -OutFile "C:\temp\wordpress.zip" -UseBasicParsing
    Write-Host "WordPress downloaded!" -ForegroundColor Green
    
    # Extract WordPress
    Write-Host "Extracting WordPress..." -ForegroundColor Yellow
    Expand-Archive -Path "C:\temp\wordpress.zip" -DestinationPath "C:\temp\" -Force
    
    # Copy WordPress files
    Write-Host "Copying WordPress files..." -ForegroundColor Yellow
    Copy-Item -Path "C:\temp\wordpress\*" -Destination "C:\xampp\htdocs\jd-transcripts\" -Recurse -Force
    Write-Host "WordPress installed!" -ForegroundColor Green
}
catch {
    Write-Host "WordPress download failed. Please download manually." -ForegroundColor Red
    Start-Process "https://wordpress.org/download/"
}

# Copy theme files
Write-Host "Installing JD Transcripts theme..." -ForegroundColor Yellow
$themeSource = "c:\Users\Kyle\jd 3\wordpress\wp-content\themes\jd-transcripts"
$themeDestination = "C:\xampp\htdocs\jd-transcripts\wp-content\themes\jd-transcripts"

if (Test-Path $themeSource) {
    Copy-Item -Path $themeSource -Destination $themeDestination -Recurse -Force
    Write-Host "Theme installed!" -ForegroundColor Green
} else {
    Write-Host "Theme source not found!" -ForegroundColor Red
}

# Create wp-config.php
Write-Host "Creating WordPress configuration..." -ForegroundColor Yellow
$wpConfigSample = "C:\xampp\htdocs\jd-transcripts\wp-config-sample.php"
$wpConfig = "C:\xampp\htdocs\jd-transcripts\wp-config.php"

if (Test-Path $wpConfigSample) {
    $content = Get-Content $wpConfigSample
    $content = $content -replace 'database_name_here', 'jd_transcripts'
    $content = $content -replace 'username_here', 'root'
    $content = $content -replace 'password_here', ''
    Set-Content -Path $wpConfig -Value $content
    Write-Host "Configuration created!" -ForegroundColor Green
}

# Open download pages
Write-Host "Opening XAMPP download page..." -ForegroundColor Yellow
Start-Process "https://www.apachefriends.org/download.html"

Write-Host ""
Write-Host "SETUP COMPLETE!" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Download and install XAMPP from the opened page"
Write-Host "2. Start Apache and MySQL in XAMPP Control Panel"
Write-Host "3. Go to: http://localhost/jd-transcripts"
Write-Host "4. Complete WordPress installation"
Write-Host "5. Activate JD Transcripts Professional theme"
Write-Host ""
Read-Host "Press Enter to continue"