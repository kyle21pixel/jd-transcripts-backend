# JD Reporting - Quick Setup & Launch
# This script helps you set up and access the enhanced dashboards

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   JD Reporting - Enhanced Dashboards" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check XAMPP installation
$xamppPath = "C:\xampp"
if (-not (Test-Path $xamppPath)) {
    Write-Host "ERROR: XAMPP not found at $xamppPath" -ForegroundColor Red
    Write-Host "Please install XAMPP first or update the path in this script" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "✓ XAMPP found" -ForegroundColor Green
Write-Host ""

# Check if Apache is running
$apacheProcess = Get-Process -Name "httpd" -ErrorAction SilentlyContinue
if ($apacheProcess) {
    Write-Host "✓ Apache is already running" -ForegroundColor Green
} else {
    Write-Host "Starting Apache..." -ForegroundColor Yellow
    Start-Process "$xamppPath\apache\bin\httpd.exe" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    Write-Host "✓ Apache started" -ForegroundColor Green
}

# Check if MySQL is running
$mysqlProcess = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
if ($mysqlProcess) {
    Write-Host "✓ MySQL is already running" -ForegroundColor Green
} else {
    Write-Host "⚠ MySQL is not running. Please start it from XAMPP Control Panel" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Dashboard URLs:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin Dashboard (Enhanced):" -ForegroundColor White
Write-Host "  http://localhost/jd-3/php_backend/admin/login.php" -ForegroundColor Yellow
Write-Host ""
Write-Host "Transcriber Dashboard (Enhanced):" -ForegroundColor White
Write-Host "  http://localhost/jd-3/php_backend/transcriber/index.php" -ForegroundColor Yellow
Write-Host ""
Write-Host "Public Order Form:" -ForegroundColor White
Write-Host "  http://localhost/jd-3/order-form.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "Dashboard Launcher:" -ForegroundColor White
Write-Host "  http://localhost/jd-3/dashboard-launcher.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Login Credentials:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin:" -ForegroundColor White
Write-Host "  Username: admin" -ForegroundColor Green
Write-Host "  Password: admin123" -ForegroundColor Green
Write-Host ""
Write-Host "Transcriber:" -ForegroundColor White
Write-Host "  Username: transcriber1" -ForegroundColor Green
Write-Host "  Password: trans123" -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host "Which dashboard would you like to open? (1=Admin, 2=Transcriber, 3=Order Form, 4=Launcher, 5=All) [1]"

if ([string]::IsNullOrWhiteSpace($choice)) { $choice = "1" }

Write-Host ""
Write-Host "Opening dashboard(s)..." -ForegroundColor Green
Start-Sleep -Seconds 2

switch ($choice) {
    "1" { Start-Process "http://localhost/jd-3/php_backend/admin/login.php" }
    "2" { Start-Process "http://localhost/jd-3/php_backend/transcriber/index.php" }
    "3" { Start-Process "http://localhost/jd-3/order-form.html" }
    "4" { Start-Process "http://localhost/jd-3/dashboard-launcher.html" }
    "5" { 
        Start-Process "http://localhost/jd-3/dashboard-launcher.html"
        Start-Sleep -Seconds 1
        Start-Process "http://localhost/jd-3/php_backend/admin/login.php"
    }
    default { Start-Process "http://localhost/jd-3/php_backend/admin/login.php" }
}

Write-Host ""
Write-Host "✓ Done! Your browser should open shortly." -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
