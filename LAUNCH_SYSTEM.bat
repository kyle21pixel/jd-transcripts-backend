@echo off
echo ========================================
echo    JD Transcripts System Launcher
echo ========================================
echo.
echo Setting up and launching your complete transcription system...
echo.

REM Check if XAMPP is running
tasklist /FI "IMAGENAME eq xampp-control.exe" 2>NUL | find /I /N "xampp-control.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ XAMPP is running
) else (
    echo ❌ XAMPP is not running. Please start XAMPP first.
    pause
    exit
)

echo.
echo Opening system components...
echo.

REM Open system test page
echo ► Opening System Setup Test...
start "" "http://localhost/jd%%203/test_complete_system.php"
timeout /t 2 /nobreak >nul

REM Open main website
echo ► Opening Main Website...
start "" "http://localhost/jd%%203/index.html"
timeout /t 2 /nobreak >nul

REM Open admin login
echo ► Opening Admin Login...
start "" "http://localhost/jd%%203/admin-login.html"
timeout /t 2 /nobreak >nul

REM Open phpMyAdmin
echo ► Opening Database (phpMyAdmin)...
start "" "http://localhost/phpmyadmin"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo    System Launch Complete!
echo ========================================
echo.
echo Your JD Transcripts system is now running:
echo.
echo 🌐 Main Website: http://localhost/jd%%203/index.html
echo 🔐 Admin Login: http://localhost/jd%%203/admin-login.html
echo 🗄️ Database: http://localhost/phpmyadmin
echo.
echo Login Credentials:
echo ==================
echo Admin: admin / password123
echo Manager: manager / password123
echo Transcriber: transcriber1 / password123
echo.
echo Test the complete workflow:
echo 1. Submit an order on the main website
echo 2. Login to admin dashboard to manage orders
echo 3. Use manager dashboard to assign orders
echo.
echo Press any key to exit...
pause >nul