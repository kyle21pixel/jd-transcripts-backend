# Automated XAMPP Installation
Write-Host "========================================" -ForegroundColor Green
Write-Host "🚀 INSTALLING XAMPP AUTOMATICALLY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Close any existing XAMPP installer
Get-Process | Where-Object {$_.ProcessName -like "*xampp*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Download XAMPP installer
$xamppUrl = "https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe/download"
$installerPath = "$env:TEMP\xampp-installer-new.exe"

Write-Host "📥 Downloading XAMPP installer..." -ForegroundColor Yellow
try {
    # Use alternative download method
    $webClient = New-Object System.Net.WebClient
    $webClient.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
    $webClient.DownloadFile("https://www.apachefriends.org/xampp-files/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe", $installerPath)
    Write-Host "✅ XAMPP installer downloaded" -ForegroundColor Green
} catch {
    Write-Host "❌ Download failed, trying alternative..." -ForegroundColor Red
    try {
        Invoke-WebRequest -Uri "https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe/download" -OutFile $installerPath -UseBasicParsing
        Write-Host "✅ XAMPP installer downloaded (alternative method)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Could not download XAMPP automatically" -ForegroundColor Red
        Write-Host "Please download manually from: https://www.apachefriends.org/download.html" -ForegroundColor White
        exit 1
    }
}

# Install XAMPP silently
Write-Host "🔧 Installing XAMPP..." -ForegroundColor Yellow
try {
    $installArgs = @(
        "--mode", "unattended",
        "--unattendedmodeui", "none", 
        "--prefix", "C:\xampp-new"
    )
    
    Start-Process $installerPath -ArgumentList $installArgs -Wait -NoNewWindow
    Write-Host "✅ XAMPP installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Installation failed" -ForegroundColor Red
    Write-Host "Trying manual installation..." -ForegroundColor Yellow
    Start-Process $installerPath -Wait
}

# Start XAMPP services
Write-Host "🚀 Starting XAMPP services..." -ForegroundColor Yellow
$xamppControl = "C:\xampp-new\xampp-control.exe"
if (Test-Path $xamppControl) {
    Start-Process $xamppControl
    Write-Host "✅ XAMPP Control Panel opened" -ForegroundColor Green
} else {
    Write-Host "❌ XAMPP Control Panel not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ XAMPP INSTALLATION COMPLETE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. In XAMPP Control Panel, click 'Start' for Apache" -ForegroundColor Gray
Write-Host "2. In XAMPP Control Panel, click 'Start' for MySQL" -ForegroundColor Gray
Write-Host "3. Both should show green 'Running' status" -ForegroundColor Gray
Write-Host "4. Test: http://localhost should show XAMPP dashboard" -ForegroundColor Gray