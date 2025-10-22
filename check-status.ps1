Write-Host "Checking XAMPP Status..." -ForegroundColor Green

if (Test-Path "C:\xampp\xampp-control.exe") {
    Write-Host "XAMPP is installed" -ForegroundColor Green
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 5
        Write-Host "Apache is running" -ForegroundColor Green
    } catch {
        Write-Host "Apache is not running" -ForegroundColor Red
        Write-Host "Please start Apache in XAMPP Control Panel" -ForegroundColor Yellow
        Start-Process "C:\xampp\xampp-control.exe"
    }
} else {
    Write-Host "XAMPP is not installed" -ForegroundColor Red
    Write-Host "Please install XAMPP from: https://www.apachefriends.org/download.html" -ForegroundColor Yellow
}