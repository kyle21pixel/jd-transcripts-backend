# Simple JD Transcripts WordPress Local Deployment Script

Write-Host "========================================" -ForegroundColor Green
Write-Host "JD Transcripts WordPress Backend Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$xamppPath = "C:\xampp"
$wordpressPath = "$xamppPath\htdocs\jd-transcripts"
$pluginSourcePath = "c:\Users\Kyle\jd 3\wordpress-backend-plugin"
$pluginDestPath = "$wordpressPath\wp-content\plugins\jd-transcripts-api"

Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check XAMPP
if (Test-Path $xamppPath) {
    Write-Host "✓ XAMPP found at $xamppPath" -ForegroundColor Green
} else {
    Write-Host "✗ XAMPP not found. Please install XAMPP first:" -ForegroundColor Red
    Write-Host "  Download from: https://www.apachefriends.org/download.html" -ForegroundColor White
    Write-Host "  Install to: C:\xampp" -ForegroundColor White
    pause
    exit 1
}

# Check if WordPress exists
if (Test-Path $wordpressPath) {
    Write-Host "✓ WordPress found at $wordpressPath" -ForegroundColor Green
} else {
    Write-Host "✗ WordPress not found at $wordpressPath" -ForegroundColor Red
    Write-Host "  Please download WordPress and extract to: $wordpressPath" -ForegroundColor White
    Write-Host "  Download from: https://wordpress.org/download/" -ForegroundColor White
    pause
    exit 1
}

# Check plugin source
if (Test-Path $pluginSourcePath) {
    Write-Host "✓ Plugin source found at $pluginSourcePath" -ForegroundColor Green
} else {
    Write-Host "✗ Plugin source not found at $pluginSourcePath" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Copying plugin files..." -ForegroundColor Yellow

# Create plugins directory if needed
$pluginsDir = "$wordpressPath\wp-content\plugins"
if (!(Test-Path $pluginsDir)) {
    New-Item -ItemType Directory -Path $pluginsDir -Force | Out-Null
}

# Copy plugin files
if (Test-Path $pluginDestPath) {
    Remove-Item $pluginDestPath -Recurse -Force
}

Copy-Item -Path $pluginSourcePath -Destination $pluginDestPath -Recurse -Force
Write-Host "✓ Plugin files copied successfully" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Next steps:" -ForegroundColor White
Write-Host ""
Write-Host "1. Start XAMPP services:" -ForegroundColor Yellow
Write-Host "   - Open XAMPP Control Panel" -ForegroundColor Gray
Write-Host "   - Start Apache and MySQL" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Create database:" -ForegroundColor Yellow
Write-Host "   - Open: http://localhost/phpmyadmin" -ForegroundColor Gray
Write-Host "   - Create database: jd_transcripts" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Install WordPress:" -ForegroundColor Yellow
Write-Host "   - Open: http://localhost/jd-transcripts" -ForegroundColor Gray
Write-Host "   - Follow installation wizard" -ForegroundColor Gray
Write-Host "   - Database: jd_transcripts, User: root, Password: (empty)" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Activate plugin:" -ForegroundColor Yellow
Write-Host "   - Login to: http://localhost/jd-transcripts/wp-admin" -ForegroundColor Gray
Write-Host "   - Go to Plugins > Installed Plugins" -ForegroundColor Gray
Write-Host "   - Activate 'JD Transcripts API Backend'" -ForegroundColor Gray
Write-Host ""

Write-Host "5. Run setup wizard:" -ForegroundColor Yellow
Write-Host "   - Go to Tools > JD API Setup" -ForegroundColor Gray
Write-Host "   - Configure and run setup" -ForegroundColor Gray
Write-Host ""

Write-Host "Your API will be available at:" -ForegroundColor Cyan
Write-Host "http://localhost/jd-transcripts/wp-json/jd-api/v1" -ForegroundColor Cyan
Write-Host ""

# Open XAMPP Control Panel
try {
    if (Test-Path "$xamppPath\xampp-control.exe") {
        Write-Host "Opening XAMPP Control Panel..." -ForegroundColor Yellow
        Start-Process "$xamppPath\xampp-control.exe"
    }
} catch {
    Write-Host "Could not open XAMPP Control Panel automatically." -ForegroundColor Yellow
}

pause