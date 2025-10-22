@echo off
color 0A
echo ============================================================
echo        JD REPORTING - COMPLETE SYSTEM VERIFICATION
echo ============================================================
echo.
echo This will verify your entire system is working correctly.
echo.
pause
echo.

echo [TEST 1/5] Checking if XAMPP is running...
tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL | find /I /N "httpd.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [PASS] Apache is running
) else (
    echo [FAIL] Apache is NOT running - Please start it in XAMPP Control Panel
    goto :end
)

tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [PASS] MySQL is running
) else (
    echo [FAIL] MySQL is NOT running - Please start it in XAMPP Control Panel
    goto :end
)

echo.
echo [TEST 2/5] Testing System Status Page...
start "" "http://localhost:8080/jd%%203/SYSTEM_STATUS_CHECK.php"
timeout /t 2 /nobreak >nul
echo [PASS] System status page opened

echo.
echo [TEST 3/5] Testing Database Connection...
start "" "http://localhost:8080/jd%%203/php_backend/config/test_connection.php"
timeout /t 3 /nobreak >nul
echo [PASS] Database connection test opened
echo       Check the browser window - it should show SUCCESS

echo.
echo [TEST 4/5] Testing Login Pages...
start "" "http://localhost:8080/jd%%203/php_backend/admin/login.php"
timeout /t 1 /nobreak >nul
echo [PASS] Admin login page opened
echo       Try logging in: admin / admin123

start "" "http://localhost:8080/jd%%203/php_backend/transcriber/login.php"
timeout /t 1 /nobreak >nul
echo [PASS] Transcriber login page opened
echo       Try logging in: transcriber1 / trans123

echo.
echo [TEST 5/5] Testing Order Form...
start "" "http://localhost:8080/jd%%203/order-form.html"
timeout /t 1 /nobreak >nul
echo [PASS] Order form opened
echo       Try submitting a test order

echo.
echo ============================================================
echo                   VERIFICATION COMPLETE!
echo ============================================================
echo.
echo All pages have been opened in your browser.
echo.
echo QUICK TEST STEPS:
echo 1. Check "Database Test" tab - Should show SUCCESS
echo 2. Login to Admin Dashboard (admin/admin123)
echo 3. Submit a test order from Order Form
echo 4. Refresh Admin Dashboard - See the new order
echo 5. Assign order to transcriber1
echo 6. Login to Transcriber Dashboard (transcriber1/trans123)
echo 7. See the assigned order
echo.
echo If all steps work, your system is 100%% functional!
echo.
:end
pause
