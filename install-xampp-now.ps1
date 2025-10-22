# Install XAMPP with Administrator Privileges
Write-Host "🚀 Installing XAMPP for JD Legal Transcripts..." -ForegroundColor Green
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️ This script needs Administrator privileges to install XAMPP." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please do the following:" -ForegroundColor White
    Write-Host "1. Right-click on PowerShell" -ForegroundColor Cyan
    Write-Host "2. Select 'Run as Administrator'" -ForegroundColor Cyan
    Write-Host "3. Navigate to: c:\Users\Kyle\jd 3" -ForegroundColor Cyan
    Write-Host "4. Run: .\install-xampp-now.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or manually install XAMPP:" -ForegroundColor White
    Write-Host "1. Run: $env:TEMP\xampp-installer.exe" -ForegroundColor Cyan
    Write-Host "2. Install to default location (C:\xampp)" -ForegroundColor Cyan
    Write-Host "3. Then run: .\complete-wordpress-setup.ps1" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Running with Administrator privileges" -ForegroundColor Green

# Install XAMPP
$installer = "$env:TEMP\xampp-installer.exe"
if (Test-Path $installer) {
    Write-Host "📦 Installing XAMPP..." -ForegroundColor Cyan
    Write-Host "This may take a few minutes..." -ForegroundColor Yellow
    
    try {
        # Install XAMPP silently
        Start-Process -FilePath $installer -ArgumentList "--mode", "unattended", "--launchapps", "0" -Wait -NoNewWindow
        Write-Host "✅ XAMPP installation completed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Installation failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Please install XAMPP manually from: $installer" -ForegroundColor Yellow
        Read-Host "Press Enter to continue"
        exit 1
    }
} else {
    Write-Host "❌ XAMPP installer not found at: $installer" -ForegroundColor Red
    Write-Host "Please download XAMPP manually from: https://www.apachefriends.org/download.html" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Verify installation
if (Test-Path "C:\xampp\xampp-control.exe") {
    Write-Host "✅ XAMPP installed successfully at C:\xampp" -ForegroundColor Green
    
    # Start XAMPP Control Panel
    Write-Host "🎛️ Starting XAMPP Control Panel..." -ForegroundColor Cyan
    Start-Process "C:\xampp\xampp-control.exe"
    
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. In XAMPP Control Panel, start Apache and MySQL" -ForegroundColor White
    Write-Host "2. Wait for both services to show 'Running' status" -ForegroundColor White
    Write-Host "3. Then run: .\complete-wordpress-setup.ps1" -ForegroundColor Cyan
    Write-Host ""
    
} else {
    Write-Host "❌ XAMPP installation verification failed" -ForegroundColor Red
    Write-Host "Please check if XAMPP was installed correctly" -ForegroundColor Yellow
}

Write-Host "Press Enter to continue..."
Read-Host