@echo off
echo ========================================
echo    JD Transcripts WordPress Installer
echo ========================================
echo.

echo This script will help you set up WordPress locally with XAMPP
echo.

echo Step 1: Make sure XAMPP is installed and running
echo - Download XAMPP from: https://www.apachefriends.org/
echo - Start Apache and MySQL services
echo.
pause

echo Step 2: Download WordPress
echo - Downloading WordPress...
echo.

REM Create WordPress directory
if not exist "wordpress-core" mkdir wordpress-core
cd wordpress-core

REM Download WordPress (you'll need to do this manually)
echo Please download WordPress from: https://wordpress.org/download/
echo Extract it to: C:\xampp\htdocs\jd-transcripts\
echo.
pause

echo Step 3: Database Setup
echo - Open phpMyAdmin: http://localhost/phpmyadmin
echo - Create new database: jd_transcripts
echo - Set collation: utf8mb4_general_ci
echo.
pause

echo Step 4: Copy Theme Files
echo - Copy the jd-transcripts folder to: wp-content/themes/
echo.

REM Copy theme files
if exist "C:\xampp\htdocs\jd-transcripts\wp-content\themes\" (
    xcopy "..\wp-content\themes\jd-transcripts" "C:\xampp\htdocs\jd-transcripts\wp-content\themes\jd-transcripts" /E /I /Y
    echo Theme files copied successfully!
) else (
    echo Please install WordPress first, then run this script again.
)

echo.
echo Step 5: WordPress Installation
echo - Open: http://localhost/jd-transcripts
echo - Follow WordPress installation wizard
echo - Database: jd_transcripts
echo - Username: root
echo - Password: (leave empty for XAMPP)
echo - Host: localhost
echo.
pause

echo Step 6: Activate Theme
echo - Login to WordPress Admin: http://localhost/jd-transcripts/wp-admin
echo - Go to Appearance > Themes
echo - Activate "JD Transcripts Professional"
echo.

echo Step 7: Create Admin Page
echo - Go to Pages > Add New
echo - Title: Admin Dashboard
echo - Template: Admin Dashboard
echo - Publish the page
echo.

echo ========================================
echo    Installation Complete!
echo ========================================
echo.
echo Your JD Transcripts WordPress site is ready!
echo.
echo URLs:
echo - Website: http://localhost/jd-transcripts
echo - Admin: http://localhost/jd-transcripts/wp-admin
echo - Dashboard: http://localhost/jd-transcripts/admin
echo.
pause