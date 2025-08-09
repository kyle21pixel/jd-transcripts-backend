@echo off
setlocal enabledelayedexpansion
color 0A
title JD Transcripts - Automated WordPress Setup

echo.
echo ========================================
echo    JD TRANSCRIPTS AUTO INSTALLER
echo ========================================
echo.
echo 🤖 This script will automate as much as possible!
echo.

REM Check for admin privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ This script needs Administrator privileges
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

echo ✅ Running with Administrator privileges
echo.

REM Create necessary directories
echo 📁 Creating directories...
if not exist "C:\xampp" mkdir "C:\xampp"
if not exist "C:\xampp\htdocs" mkdir "C:\xampp\htdocs"
if not exist "C:\xampp\htdocs\jd-transcripts" mkdir "C:\xampp\htdocs\jd-transcripts"
echo ✅ Directories created
echo.

REM Download XAMPP using PowerShell
echo 📥 Downloading XAMPP (this may take a few minutes)...
powershell -Command "& {
    $url = 'https://sourceforge.net/projects/xampp/files/XAMPP%%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe/download'
    $output = 'C:\temp\xampp-installer.exe'
    if (!(Test-Path 'C:\temp')) { New-Item -ItemType Directory -Path 'C:\temp' -Force }
    Write-Host 'Downloading XAMPP...'
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
        Write-Host 'XAMPP downloaded successfully!'
    } catch {
        Write-Host 'Download failed. Please download manually.'
    }
}"

if exist "C:\temp\xampp-installer.exe" (
    echo ✅ XAMPP downloaded successfully!
    echo.
    echo 🔧 Installing XAMPP...
    echo Please follow the installer prompts (install to C:\xampp)
    start /wait "C:\temp\xampp-installer.exe" /S
    echo ✅ XAMPP installation completed
) else (
    echo ❌ XAMPP download failed
    echo Please download manually from: https://www.apachefriends.org/
    start https://www.apachefriends.org/download.html
    echo Press any key after installing XAMPP...
    pause
)
echo.

REM Download WordPress
echo 📥 Downloading WordPress...
powershell -Command "& {
    $url = 'https://wordpress.org/latest.zip'
    $output = 'C:\temp\wordpress.zip'
    if (!(Test-Path 'C:\temp')) { New-Item -ItemType Directory -Path 'C:\temp' -Force }
    Write-Host 'Downloading WordPress...'
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
        Write-Host 'WordPress downloaded successfully!'
    } catch {
        Write-Host 'Download failed. Please download manually.'
    }
}"

if exist "C:\temp\wordpress.zip" (
    echo ✅ WordPress downloaded successfully!
    echo.
    echo 📦 Extracting WordPress...
    powershell -Command "Expand-Archive -Path 'C:\temp\wordpress.zip' -DestinationPath 'C:\temp\' -Force"
    
    REM Copy WordPress files
    echo 📋 Copying WordPress files...
    xcopy "C:\temp\wordpress\*" "C:\xampp\htdocs\jd-transcripts\" /E /I /Y /Q
    echo ✅ WordPress files copied
) else (
    echo ❌ WordPress download failed
    echo Please download manually from: https://wordpress.org/download/
    start https://wordpress.org/download/
    echo Extract to: C:\xampp\htdocs\jd-transcripts\
    explorer "C:\xampp\htdocs\jd-transcripts"
    pause
)
echo.

REM Copy theme files
echo 🎨 Installing JD Transcripts theme...
if exist "c:\Users\Kyle\jd 3\wordpress\wp-content\themes\jd-transcripts" (
    if not exist "C:\xampp\htdocs\jd-transcripts\wp-content\themes\jd-transcripts" (
        xcopy "c:\Users\Kyle\jd 3\wordpress\wp-content\themes\jd-transcripts" "C:\xampp\htdocs\jd-transcripts\wp-content\themes\jd-transcripts" /E /I /Y /Q
        echo ✅ JD Transcripts theme installed
    ) else (
        echo ✅ Theme already exists
    )
) else (
    echo ❌ Theme source not found
)
echo.

REM Create wp-config.php
echo ⚙️ Creating WordPress configuration...
if exist "C:\xampp\htdocs\jd-transcripts\wp-config-sample.php" (
    copy "C:\xampp\htdocs\jd-transcripts\wp-config-sample.php" "C:\xampp\htdocs\jd-transcripts\wp-config.php"
    
    REM Update database settings in wp-config.php
    powershell -Command "& {
        $configFile = 'C:\xampp\htdocs\jd-transcripts\wp-config.php'
        $content = Get-Content $configFile
        $content = $content -replace 'database_name_here', 'jd_transcripts'
        $content = $content -replace 'username_here', 'root'
        $content = $content -replace 'password_here', ''
        $content = $content -replace 'localhost', 'localhost'
        Set-Content $configFile $content
    }"
    echo ✅ WordPress configuration created
)
echo.

REM Start XAMPP services
echo 🚀 Starting XAMPP services...
if exist "C:\xampp\xampp_start.exe" (
    start "" "C:\xampp\xampp_start.exe"
    echo ✅ XAMPP services starting...
) else (
    echo ⚠️  Starting XAMPP Control Panel...
    if exist "C:\xampp\xampp-control.exe" (
        start "" "C:\xampp\xampp-control.exe"
        echo Please start Apache and MySQL services
    )
)
echo.

REM Wait for services
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Create database using MySQL command line
echo 💾 Creating database...
if exist "C:\xampp\mysql\bin\mysql.exe" (
    echo CREATE DATABASE IF NOT EXISTS jd_transcripts; | "C:\xampp\mysql\bin\mysql.exe" -u root
    echo ✅ Database 'jd_transcripts' created
) else (
    echo ⚠️  Please create database manually in phpMyAdmin
)
echo.

REM Create .htaccess for pretty permalinks
echo 📝 Creating .htaccess file...
(
echo # BEGIN WordPress
echo RewriteEngine On
echo RewriteRule ^index\.php$ - [L]
echo RewriteCond %%{REQUEST_FILENAME} !-f
echo RewriteCond %%{REQUEST_FILENAME} !-d
echo RewriteRule . /jd-transcripts/index.php [L]
echo # END WordPress
) > "C:\xampp\htdocs\jd-transcripts\.htaccess"
echo ✅ .htaccess created
echo.

REM Open browser windows
echo 🌐 Opening setup URLs...
timeout /t 3 /nobreak >nul

start http://localhost/jd-transcripts
echo ✅ WordPress installation opened

timeout /t 2 /nobreak >nul
start http://localhost/phpmyadmin
echo ✅ phpMyAdmin opened

echo.
echo ========================================
echo    AUTOMATED SETUP COMPLETE!
echo ========================================
echo.
echo 🎯 NEXT STEPS (Manual):
echo.
echo 1️⃣ WORDPRESS INSTALLATION (Browser tab 1):
echo    - Select language: English
echo    - Database: jd_transcripts
echo    - Username: root  
echo    - Password: (leave empty)
echo    - Complete installation
echo.
echo 2️⃣ ACTIVATE THEME:
echo    - Login to WordPress admin
echo    - Go to Appearance ^> Themes
echo    - Activate "JD Transcripts Professional"
echo.
echo 3️⃣ CREATE ADMIN PAGE:
echo    - Pages ^> Add New
echo    - Title: Admin Dashboard
echo    - Template: Admin Dashboard
echo    - Slug: admin
echo    - Publish
echo.
echo 🌐 YOUR URLS:
echo    Website: http://localhost/jd-transcripts
echo    Admin: http://localhost/jd-transcripts/wp-admin
echo    Dashboard: http://localhost/jd-transcripts/admin
echo    phpMyAdmin: http://localhost/phpmyadmin
echo.
echo ========================================
echo    READY TO TEST!
echo ========================================
echo.
pause