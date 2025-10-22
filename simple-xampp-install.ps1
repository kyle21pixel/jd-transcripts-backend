# Simple XAMPP Installation
Write-Host "Installing XAMPP automatically..." -ForegroundColor Green

# Create clean directory
Remove-Item "C:\xampp-clean" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path "C:\xampp-clean" -Force | Out-Null

# Download XAMPP
$url = "https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe/download"
$installer = "$env:TEMP\xampp-clean-installer.exe"

Write-Host "Downloading XAMPP..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $url -OutFile $installer -UseBasicParsing
    Write-Host "Download complete!" -ForegroundColor Green
} catch {
    Write-Host "Download failed. Opening manual download page..." -ForegroundColor Red
    Start-Process "https://www.apachefriends.org/download.html"
    exit
}

# Install XAMPP
Write-Host "Installing XAMPP to C:\xampp-clean..." -ForegroundColor Yellow
Start-Process $installer -ArgumentList "--mode unattended --prefix C:\xampp-clean" -Wait

# Check installation
if (Test-Path "C:\xampp-clean\xampp-control.exe") {
    Write-Host "XAMPP installed successfully!" -ForegroundColor Green
    Start-Process "C:\xampp-clean\xampp-control.exe"
} else {
    Write-Host "Installation may have failed. Opening manual installer..." -ForegroundColor Yellow
    Start-Process $installer
}