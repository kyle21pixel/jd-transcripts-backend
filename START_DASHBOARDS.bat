@echo off
echo ============================================
echo   JD Reporting - Enhanced Dashboards
echo ============================================
echo.
echo Starting XAMPP Apache server...
echo.

REM Check if XAMPP is installed
if not exist "C:\xampp\apache\bin\httpd.exe" (
    echo ERROR: XAMPP not found at C:\xampp
    echo Please install XAMPP first or update the path in this script
    pause
    exit /b
)

REM Start Apache if not running
tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL | find /I /N "httpd.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Apache is already running!
) else (
    echo Starting Apache...
    start "" "C:\xampp\apache\bin\httpd.exe"
    timeout /t 3 /nobreak > nul
)

echo.
echo ============================================
echo   Dashboard URLs:
echo ============================================
echo.
echo  Admin Dashboard (Enhanced):
echo  http://localhost/jd-3/php_backend/admin/index.php
echo.
echo  Transcriber Dashboard (Enhanced):
echo  http://localhost/jd-3/php_backend/transcriber/index.php
echo.
echo  Order Form (Public):
echo  http://localhost/jd-3/order-form.html
echo.
echo  Password Generator:
echo  http://localhost/jd-3/php_backend/generate_password_hash.php
echo.
echo ============================================
echo.
echo Opening Admin Dashboard in your browser...
echo.

REM Wait a moment for Apache to fully start
timeout /t 2 /nobreak > nul

REM Open admin dashboard
start http://localhost/jd-3/php_backend/admin/login.php

echo.
echo ============================================
echo   Default Login Credentials:
echo ============================================
echo.
echo  Admin:
echo    Username: admin
echo    Password: admin123
echo.
echo  Transcriber:
echo    Username: transcriber1
echo    Password: trans123
echo.
echo ============================================
echo.
echo Press any key to exit...
pause > nul
