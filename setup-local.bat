@echo off
color 0A
echo.
echo ========================================
echo    JD TRANSCRIPTS LOCAL SETUP
echo ========================================
echo.

echo 🚀 Setting up your local WordPress development environment...
echo.

REM Check if XAMPP directory exists
if not exist "C:\xampp" (
    echo ❌ XAMPP not found at C:\xampp
    echo.
    echo Please install XAMPP first:
    echo 1. Download from: https://www.apachefriends.org/
    echo 2. Install to default location (C:\xampp)
    echo 3. Run this script again
    echo.
    start https://www.apachefriends.org/download.html
    pause
    exit /b 1
)

echo ✅ XAMPP found at C:\xampp
echo.

REM Check if WordPress directory exists
if not exist "C:\xampp\htdocs\jd-transcripts" (
    echo 📁 Creating WordPress directory...
    mkdir "C:\xampp\htdocs\jd-transcripts"
    echo ✅ Directory created: C:\xampp\htdocs\jd-transcripts
) else (
    echo ✅ WordPress directory exists
)
echo.

REM Check if WordPress is downloaded
if not exist "C:\xampp\htdocs\jd-transcripts\wp-config-sample.php" (
    echo ❌ WordPress not found in C:\xampp\htdocs\jd-transcripts
    echo.
    echo Please download and extract WordPress:
    echo 1. Download from: https://wordpress.org/download/
    echo 2. Extract ALL files to: C:\xampp\htdocs\jd-transcripts\
    echo 3. Run this script again
    echo.
    start https://wordpress.org/download/
    explorer "C:\xampp\htdocs\jd-transcripts"
    pause
    exit /b 1
)

echo ✅ WordPress files found
echo.

REM Copy theme files
echo 📋 Copying JD Transcripts theme...
if exist "c:\Users\Kyle\jd 3\wordpress\wp-content\themes\jd-transcripts" (
    if not exist "C:\xampp\htdocs\jd-transcripts\wp-content\themes\jd-transcripts" (
        xcopy "c:\Users\Kyle\jd 3\wordpress\wp-content\themes\jd-transcripts" "C:\xampp\htdocs\jd-transcripts\wp-content\themes\jd-transcripts" /E /I /Y
        echo ✅ Theme files copied successfully!
    ) else (
        echo ✅ Theme already exists
    )
) else (
    echo ❌ Theme source not found
)
echo.

REM Start XAMPP services
echo 🔧 Starting XAMPP services...
if exist "C:\xampp\xampp_start.exe" (
    start "" "C:\xampp\xampp_start.exe"
    echo ✅ XAMPP started
) else (
    echo ⚠️  Please start XAMPP manually:
    echo    1. Open XAMPP Control Panel
    echo    2. Start Apache and MySQL
    start "" "C:\xampp\xampp-control.exe"
)
echo.

REM Wait for services to start
echo ⏳ Waiting for services to start...
timeout /t 5 /nobreak >nul
echo.

REM Open setup URLs
echo 🌐 Opening setup URLs...
echo.
echo Opening in 3 seconds...
timeout /t 3 /nobreak >nul

REM Open phpMyAdmin for database creation
start http://localhost/phpmyadmin
echo ✅ phpMyAdmin opened - Create database 'jd_transcripts'

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Open WordPress installation
start http://localhost/jd-transcripts
echo ✅ WordPress installation opened

echo.
echo ========================================
echo    SETUP INSTRUCTIONS
echo ========================================
echo.
echo 📊 STEP 1: Create Database (phpMyAdmin tab)
echo    - Click "New" on left sidebar
echo    - Database name: jd_transcripts
echo    - Collation: utf8mb4_general_ci
echo    - Click "Create"
echo.
echo 🔧 STEP 2: Install WordPress (WordPress tab)
echo    - Select language: English
echo    - Database name: jd_transcripts
echo    - Username: root
echo    - Password: (leave empty)
echo    - Host: localhost
echo    - Complete installation
echo.
echo 🎨 STEP 3: Activate Theme
echo    - Login to WordPress admin
echo    - Go to Appearance ^> Themes
echo    - Activate "JD Transcripts Professional"
echo.
echo 📄 STEP 4: Create Admin Page
echo    - Go to Pages ^> Add New
echo    - Title: Admin Dashboard
echo    - Template: Admin Dashboard
echo    - Slug: admin
echo    - Publish
echo.
echo 🎯 FINAL URLS:
echo    Website: http://localhost/jd-transcripts
echo    Admin: http://localhost/jd-transcripts/wp-admin
echo    Dashboard: http://localhost/jd-transcripts/admin
echo.
echo ========================================
echo    SETUP COMPLETE!
echo ========================================
echo.
pause