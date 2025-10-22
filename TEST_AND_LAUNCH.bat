@echo off
cls
echo ============================================
echo   JD Reporting - XAMPP Diagnostic Tool
echo ============================================
echo.

echo Checking Apache status...
tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL | find /I /N "httpd.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] Apache process is running
) else (
    echo [ERROR] Apache is NOT running
    echo.
    echo Please open XAMPP Control Panel and click START next to Apache
    pause
    exit /b
)

echo.
echo Checking MySQL status...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL process is running
) else (
    echo [WARNING] MySQL is NOT running
    echo You may need to start MySQL from XAMPP Control Panel
)

echo.
echo ============================================
echo   Testing Web Server Access
echo ============================================
echo.

echo Testing http://localhost/ ...
curl -s -o nul -w "%%{http_code}" http://localhost/ > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt

if "%STATUS%"=="200" (
    echo [OK] Apache is responding on port 80
    echo.
    echo ============================================
    echo   Your Dashboards Should Work!
    echo ============================================
    echo.
    echo Opening Admin Dashboard...
    timeout /t 2 /nobreak > nul
    start http://localhost/jd-3/php_backend/admin/login.php
) else if "%STATUS%"=="000" (
    echo [ERROR] Cannot connect to Apache
    echo.
    echo SOLUTION:
    echo 1. Open XAMPP Control Panel
    echo 2. Stop Apache if it shows as running
    echo 3. Click START next to Apache
    echo 4. Wait for it to turn green
    echo 5. Run this script again
    pause
) else (
    echo [WARNING] Apache returned status: %STATUS%
    echo.
    echo Trying alternative port...
    start http://localhost:8080/jd-3/php_backend/admin/login.php
)

echo.
echo ============================================
echo   Dashboard URLs:
echo ============================================
echo.
echo http://localhost/jd-3/php_backend/admin/login.php
echo http://localhost/jd-3/php_backend/transcriber/index.php
echo http://localhost/jd-3/order-form.html
echo.
echo ============================================
echo.
pause
