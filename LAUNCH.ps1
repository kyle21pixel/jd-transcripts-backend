# XAMPP Apache Fix and Dashboard Launcher

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   JD Reporting - XAMPP Fix & Launch" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Kill any existing Apache processes
Write-Host "Stopping any existing Apache processes..." -ForegroundColor Yellow
Get-Process httpd -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Apache using XAMPP
Write-Host "Starting Apache via XAMPP..." -ForegroundColor Yellow
Start-Process "C:\xampp\apache_start.bat" -WindowStyle Hidden
Start-Sleep -Seconds 5

# Check if Apache started
$apache = Get-Process httpd -ErrorAction SilentlyContinue
if ($apache) {
    Write-Host "OK Apache is now running!" -ForegroundColor Green
} else {
    Write-Host "X Failed to start Apache" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual steps:" -ForegroundColor Yellow
    Write-Host "1. Open XAMPP Control Panel (xampp-control.exe)" -ForegroundColor White
    Write-Host "2. Click Stop next to Apache (if running)" -ForegroundColor White
    Write-Host "3. Click Start next to Apache" -ForegroundColor White
    Write-Host "4. Wait for green highlight" -ForegroundColor White
    Write-Host "5. Then try accessing the dashboard" -ForegroundColor White
    Write-Host ""
    pause
    exit
}

# Test web server
Write-Host ""
Write-Host "Testing web server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -ErrorAction Stop
    Write-Host "OK Web server is responding!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Opening Admin Dashboard..." -ForegroundColor Green
    Start-Sleep -Seconds 2
    Start-Process "http://localhost/jd-3/php_backend/admin/login.php"
    
} catch {
    Write-Host "X Web server not responding on port 80" -ForegroundColor Red
    Write-Host ""
    Write-Host "Trying port 8080..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -ErrorAction Stop
        Write-Host "OK Found Apache on port 8080!" -ForegroundColor Green
        Start-Process "http://localhost:8080/jd-3/php_backend/admin/login.php"
    } catch {
        Write-Host "X Web server not accessible" -ForegroundColor Red
        Write-Host ""
        Write-Host "PLEASE DO THIS MANUALLY:" -ForegroundColor Yellow -BackgroundColor Red
        Write-Host "1. Open XAMPP Control Panel" -ForegroundColor White
        Write-Host "2. Click Config next to Apache > Apache (httpd.conf)" -ForegroundColor White
        Write-Host "3. Find Listen 8080 and change to Listen 80" -ForegroundColor White
        Write-Host "4. Save and close" -ForegroundColor White
        Write-Host "5. Restart Apache in XAMPP" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Dashboard URLs:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Try these URLs in your browser:" -ForegroundColor White
Write-Host "  http://localhost/jd-3/php_backend/admin/login.php" -ForegroundColor Yellow
Write-Host "  http://localhost:8080/jd-3/php_backend/admin/login.php" -ForegroundColor Yellow
Write-Host ""
Write-Host "Login: admin / admin123" -ForegroundColor Green
Write-Host ""
pause
