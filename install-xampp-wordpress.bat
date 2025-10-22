@echo off
setlocal enabledelayedexpansion

echo ========================================
echo 🚀 INSTALLING XAMPP + WORDPRESS
echo ========================================
echo.

REM Create temp directory
set TEMP_DIR=%TEMP%\jd-setup
if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"

echo 📥 Step 1: Downloading XAMPP...
echo This may take a few minutes depending on your internet speed...

REM Download XAMPP using PowerShell
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://sourceforge.net/projects/xampp/files/XAMPP%%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe/download' -OutFile '%TEMP_DIR%\xampp-installer.exe' -UseBasicParsing}"

if exist "%TEMP_DIR%\xampp-installer.exe" (
    echo ✅ XAMPP downloaded successfully
    echo.
    echo 🔧 Installing XAMPP...
    echo Please wait while XAMPP installs...
    
    REM Install XAMPP silently
    "%TEMP_DIR%\xampp-installer.exe" --mode unattended --launchapps 0
    
    echo ✅ XAMPP installation completed
) else (
    echo ❌ Failed to download XAMPP
    echo Please download manually from: https://www.apachefriends.org/download.html
    pause
    exit /b 1
)

echo.
echo 📦 Step 2: Downloading WordPress...

REM Download WordPress
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://wordpress.org/latest.zip' -OutFile '%TEMP_DIR%\wordpress.zip' -UseBasicParsing}"

if exist "%TEMP_DIR%\wordpress.zip" (
    echo ✅ WordPress downloaded successfully
    
    echo 📂 Extracting WordPress...
    powershell -Command "Expand-Archive -Path '%TEMP_DIR%\wordpress.zip' -DestinationPath '%TEMP_DIR%' -Force"
    
    REM Create WordPress directory in XAMPP
    if not exist "C:\xampp\htdocs\jd-wordpress" mkdir "C:\xampp\htdocs\jd-wordpress"
    
    REM Copy WordPress files
    xcopy "%TEMP_DIR%\wordpress\*" "C:\xampp\htdocs\jd-wordpress\" /E /I /Y
    
    echo ✅ WordPress extracted to C:\xampp\htdocs\jd-wordpress
) else (
    echo ❌ Failed to download WordPress
    pause
    exit /b 1
)

echo.
echo 🚀 Step 3: Starting XAMPP...

REM Start XAMPP Control Panel
start "" "C:\xampp\xampp-control.exe"

echo ✅ XAMPP Control Panel started
echo.
echo 📋 Please do the following in XAMPP Control Panel:
echo 1. Click START next to Apache
echo 2. Click START next to MySQL
echo 3. Wait for both to show "Running" status
echo.
pause

echo.
echo 🗄️ Step 4: Creating Database...
echo Opening phpMyAdmin to create database...

start "" "http://localhost/phpmyadmin"

echo.
echo 📋 Please do the following in phpMyAdmin:
echo 1. Click "New" in the left sidebar
echo 2. Enter database name: jd_wordpress
echo 3. Click "Create"
echo.
pause

echo.
echo 🔧 Step 5: Creating WordPress Configuration...

REM Create wp-config.php
(
echo ^<?php
echo define^( 'DB_NAME', 'jd_wordpress' ^);
echo define^( 'DB_USER', 'root' ^);
echo define^( 'DB_PASSWORD', '' ^);
echo define^( 'DB_HOST', 'localhost' ^);
echo define^( 'DB_CHARSET', 'utf8mb4' ^);
echo define^( 'DB_COLLATE', '' ^);
echo.
echo define^( 'AUTH_KEY',         'put your unique phrase here' ^);
echo define^( 'SECURE_AUTH_KEY',  'put your unique phrase here' ^);
echo define^( 'LOGGED_IN_KEY',    'put your unique phrase here' ^);
echo define^( 'NONCE_KEY',        'put your unique phrase here' ^);
echo define^( 'AUTH_SALT',        'put your unique phrase here' ^);
echo define^( 'SECURE_AUTH_SALT', 'put your unique phrase here' ^);
echo define^( 'LOGGED_IN_SALT',   'put your unique phrase here' ^);
echo define^( 'NONCE_SALT',       'put your unique phrase here' ^);
echo.
echo $table_prefix = 'wp_';
echo.
echo define^( 'WP_DEBUG', true ^);
echo define^( 'WP_DEBUG_LOG', true ^);
echo define^( 'WP_DEBUG_DISPLAY', false ^);
echo.
echo if ^( ! defined^( 'ABSPATH' ^) ^) {
echo     define^( 'ABSPATH', __DIR__ . '/' ^);
echo }
echo.
echo require_once ABSPATH . 'wp-settings.php';
) > "C:\xampp\htdocs\jd-wordpress\wp-config.php"

echo ✅ WordPress configuration created

echo.
echo 🔌 Step 6: Creating JD Transcripts Plugin...

REM Create plugin directory
if not exist "C:\xampp\htdocs\jd-wordpress\wp-content\plugins\jd-transcripts-api" mkdir "C:\xampp\htdocs\jd-wordpress\wp-content\plugins\jd-transcripts-api"

echo ✅ Plugin directory created

echo.
echo 🌐 Step 7: Opening WordPress Installation...

start "" "http://localhost/jd-wordpress"

echo.
echo ========================================
echo ✅ INSTALLATION COMPLETE!
echo ========================================
echo.
echo 🌐 LIVE URLS:
echo.
echo WordPress Installation:
echo    http://localhost/jd-wordpress
echo.
echo WordPress Admin (after setup):
echo    http://localhost/jd-wordpress/wp-admin
echo.
echo Database Admin:
echo    http://localhost/phpmyadmin
echo.
echo Current Standalone System:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo.
echo 🚀 NEXT STEPS:
echo 1. Complete WordPress installation in the browser
echo 2. Create admin account (username: admin, password: admin123)
echo 3. Login to WordPress admin
echo 4. Go to Plugins and activate JD Transcripts API
echo.
echo 📋 WordPress Installation Details:
echo - Database: jd_wordpress
echo - DB User: root
echo - DB Password: (empty)
echo - DB Host: localhost
echo.

REM Cleanup
rmdir /s /q "%TEMP_DIR%" 2>nul

echo Installation complete! WordPress should open in your browser.
pause