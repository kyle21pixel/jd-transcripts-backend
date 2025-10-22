# Check XAMPP Installation Status
Write-Host "🔍 Checking XAMPP Status..." -ForegroundColor Green
Write-Host ""

# Check if XAMPP is installed
if (Test-Path "C:\xampp\xampp-control.exe") {
    Write-Host "✅ XAMPP is installed at C:\xampp" -ForegroundColor Green
    
    # Check if Apache is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 5
        Write-Host "✅ Apache is running" -ForegroundColor Green
        
        # Check if WordPress is accessible
        try {
            $wpResponse = Invoke-WebRequest -Uri "http://localhost/wordpress" -UseBasicParsing -TimeoutSec 5
            Write-Host "✅ WordPress is accessible" -ForegroundColor Green
            
            Write-Host ""
            Write-Host "🎉 Everything is ready!" -ForegroundColor Green
            Write-Host "Complete WordPress setup at: http://localhost/wordpress" -ForegroundColor Cyan
            
        } catch {
            Write-Host "⚠️ WordPress not found at http://localhost/wordpress" -ForegroundColor Yellow
            Write-Host "Run: .\complete-wordpress-setup.ps1" -ForegroundColor Cyan
        }
        
    } catch {
        Write-Host "❌ Apache is not running" -ForegroundColor Red
        Write-Host "Please start Apache in XAMPP Control Panel" -ForegroundColor Yellow
        
        # Open XAMPP Control Panel
        Start-Process "C:\xampp\xampp-control.exe"
    }
    
} else {
    Write-Host "❌ XAMPP is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install XAMPP manually:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://www.apachefriends.org/download.html" -ForegroundColor White
    Write-Host "2. Download XAMPP for Windows" -ForegroundColor White
    Write-Host "3. Install to C:\xampp" -ForegroundColor White
    Write-Host "4. Start Apache and MySQL services" -ForegroundColor White
    Write-Host "5. Run: .\complete-wordpress-setup.ps1" -ForegroundColor Cyan
}

Write-Host ""
Read-Host "Press Enter to continue"