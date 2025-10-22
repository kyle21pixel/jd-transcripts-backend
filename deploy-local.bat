@echo off
echo ========================================
echo JD Transcripts WordPress Backend Setup
echo ========================================
echo.

echo This script will help you set up WordPress locally
echo.

echo Step 1: Download and install XAMPP (if not already installed)
echo - Go to https://www.apachefriends.org/download.html
echo - Download XAMPP for Windows
echo - Install it to C:\xampp
echo.
pause

echo Step 2: Start XAMPP services
echo - Open XAMPP Control Panel
echo - Start Apache and MySQL services
echo.
pause

echo Step 3: Download WordPress
echo - Go to https://wordpress.org/download/
echo - Download WordPress ZIP file
echo - Extract to C:\xampp\htdocs\jd-transcripts
echo.
pause

echo Step 4: Create database
echo - Open http://localhost/phpmyadmin in your browser
echo - Create new database named 'jd_transcripts'
echo.
pause

echo Step 5: Install WordPress
echo - Go to http://localhost/jd-transcripts
echo - Follow WordPress installation wizard
echo - Use database name: jd_transcripts
echo - Database user: root
echo - Database password: (leave empty)
echo - Database host: localhost
echo.
pause

echo Step 6: Copy plugin files
echo - Copy wordpress-backend-plugin folder to C:\xampp\htdocs\jd-transcripts\wp-content\plugins\
echo.
pause

echo Step 7: Activate plugin
echo - Login to WordPress admin at http://localhost/jd-transcripts/wp-admin
echo - Go to Plugins and activate "JD Transcripts API Backend"
echo - Go to Tools > JD API Setup and run the setup wizard
echo.

echo Setup complete! Your WordPress backend will be available at:
echo http://localhost/jd-transcripts/wp-json/jd-api/v1
echo.
pause