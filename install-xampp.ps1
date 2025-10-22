# Install XAMPP for WordPress
Write-Host "Installing XAMPP for JD Legal Transcripts WordPress setup..." -ForegroundColor Green

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "This script needs Administrator privileges to install XAMPP." -ForegroundColor Yellow
    Write-Host "Please right-click PowerShell and 'Run as Administrator'" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

# Download XAMPP
$xamppUrl = "https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe/download"
$installer = "$env:TEMP\xampp-installer.exe"

Write-Host "Downloading XAMPP (this may take a few minutes)..." -ForegroundColor Yellow

try {
    Invoke-WebRequest -Uri $xamppUrl -OutFile $installer -UseBasicParsing
    Write-Host "Download complete" -ForegroundColor Green
} catch {
    Write-Host "Download failed. Please download XAMPP manually from:" -ForegroundColor Red
    Write-Host "https://www.apachefriends.org/download.html" -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit 1
}

# Install XAMPP
Write-Host "Installing XAMPP..." -ForegroundColor Yellow
try {
    Start-Process -FilePath $installer -ArgumentList "--mode", "unattended", "--launchapps", "0" -Wait
    Write-Host "XAMPP installed successfully" -ForegroundColor Green
} catch {
    Write-Host "Installation failed. Please run the installer manually:" -ForegroundColor Red
    Write-Host $installer -ForegroundColor Cyan
    Read-Host "Press Enter to continue"
}

# Cleanup
Remove-Item $installer -Force -ErrorAction SilentlyContinue

# Start XAMPP Control Panel
$xamppControl = "C:\xampp\xampp-control.exe"
if (Test-Path $xamppControl) {
    Write-Host "Starting XAMPP Control Panel..." -ForegroundColor Green
    Start-Process $xamppControl
    Write-Host ""
    Write-Host "XAMPP Control Panel opened." -ForegroundColor Green
    Write-Host "Please start Apache and MySQL services." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After starting the services, run: .\simple-setup.ps1" -ForegroundColor Cyan
} else {
    Write-Host "XAMPP installation may have failed." -ForegroundColor Red
    Write-Host "Please install XAMPP manually and then run the setup script." -ForegroundColor Yellow
}

Read-Host "Press Enter to continue"