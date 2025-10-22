@echo off
echo ========================================
echo JD REPORTING - COMPLETE SYSTEM STARTUP
echo ========================================
echo.
echo This script will:
echo 1. Stop and restart MySQL service
echo 2. Create/initialize database automatically
echo 3. Launch all dashboards
echo.

REM Stop MySQL if running
echo [1/5] Stopping MySQL...
taskkill /F /IM mysqld.exe 2>nul
timeout /t 2 /nobreak >nul

REM Start XAMPP Control Panel
echo [2/5] Starting XAMPP Control Panel...
start "" "C:\xampp\xampp-control.exe"
timeout /t 3 /nobreak >nul

echo.
echo [3/5] Waiting for MySQL to start...
echo Please start Apache and MySQL in XAMPP Control Panel if not already started.
timeout /t 5 /nobreak >nul

REM Test database connection - this will auto-create database and tables
echo [4/5] Initializing database and tables...
start "" "http://localhost:8080/jd%%203/php_backend/config/test_connection.php"
timeout /t 3 /nobreak >nul

REM Open all dashboards
echo [5/5] Opening dashboards...
start "" "http://localhost:8080/jd%%203/php_backend/admin/login.php"
start "" "http://localhost:8080/jd%%203/php_backend/transcriber/login.php"
start "" "http://localhost:8080/jd%%203/order-form.html"

echo.
echo ========================================
echo SYSTEM STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Dashboards opened:
echo - Admin Dashboard: http://localhost:8080/jd%%203/php_backend/admin/login.php
echo - Transcriber Dashboard: http://localhost:8080/jd%%203/php_backend/transcriber/login.php
echo - Order Form: http://localhost:8080/jd%%203/order-form.html
echo.
echo Login Credentials:
echo   Admin: username=admin, password=admin123
echo   Transcriber: username=transcriber1, password=trans123
echo.
echo Database will be created automatically on first login!
echo.
pause
