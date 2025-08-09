@echo off
echo ========================================
echo    RESTARTING XAMPP SERVICES
echo ========================================
echo.

echo Stopping XAMPP services...
taskkill /f /im "httpd.exe" 2>nul
taskkill /f /im "mysqld.exe" 2>nul
echo Services stopped.
echo.

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo Starting XAMPP Control Panel...
if exist "C:\xampp\xampp-control.exe" (
    start "" "C:\xampp\xampp-control.exe"
    echo ✅ XAMPP Control Panel opened
    echo.
    echo MANUAL STEPS:
    echo 1. Click START next to Apache
    echo 2. Click START next to MySQL  
    echo 3. Both should show green "Running"
    echo.
) else (
    echo ❌ XAMPP not found at C:\xampp
    echo Please install XAMPP first
)

echo After starting services, try:
echo http://localhost/jd-transcripts
echo.
pause