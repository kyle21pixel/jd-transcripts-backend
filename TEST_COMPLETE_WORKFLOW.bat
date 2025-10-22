@echo off
color 0A
cls
echo ============================================================
echo     JD REPORTING - COMPLETE SYSTEM TEST
echo ============================================================
echo.
echo This script will test the complete order workflow:
echo 1. Order submission from website
echo 2. Order storage in database
echo 3. Admin dashboard access
echo 4. Order assignment to transcriber
echo 5. Transcriber dashboard access
echo.
pause
echo.

REM Step 1: Check if services are running
echo [STEP 1/6] Checking if XAMPP services are running...
tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL | find /I /N "httpd.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] Apache is running
) else (
    echo [FAIL] Apache is NOT running
    echo Please start Apache in XAMPP Control Panel
    pause
    exit /b 1
)

tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL is running
) else (
    echo [FAIL] MySQL is NOT running
    echo Please start MySQL in XAMPP Control Panel
    pause
    exit /b 1
)

echo.
echo [STEP 2/6] Testing database connection...
cd /d "C:\xampp\mysql\bin"
mysql.exe -u root -P 3307 -h 127.0.0.1 -e "SELECT 1" >NUL 2>&1
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL connection successful on port 3307
) else (
    echo [FAIL] MySQL connection failed
    pause
    exit /b 1
)

echo.
echo [STEP 3/6] Opening order form...
start "" "http://localhost:8080/jd%%203/order-form.html"
timeout /t 2 /nobreak >nul
echo [OK] Order form opened in browser

echo.
echo [STEP 4/6] Opening admin login...
start "" "http://localhost:8080/jd%%203/php_backend/admin/login.php"
timeout /t 2 /nobreak >nul
echo [OK] Admin login opened in browser

echo.
echo [STEP 5/6] Opening transcriber login...
start "" "http://localhost:8080/jd%%203/php_backend/transcriber/login.php"
timeout /t 2 /nobreak >nul
echo [OK] Transcriber login opened in browser

echo.
echo [STEP 6/6] Opening phpMyAdmin to verify database...
start "" "http://localhost:8080/phpmyadmin"
timeout /t 2 /nobreak >nul
echo [OK] phpMyAdmin opened

echo.
echo ============================================================
echo                 MANUAL TESTING STEPS
echo ============================================================
echo.
echo Follow these steps to test the complete workflow:
echo.
echo 1. ORDER FORM (Tab 1):
echo    - Fill in all fields
echo    - Client Name: John Doe
echo    - Email: john@example.com
echo    - Phone: +1234567890
echo    - Service: Legal Transcription
echo    - Turnaround: 24 Hours
echo    - Special Instructions: Test order
echo    - Click Submit
echo    - Note the ORDER NUMBER that appears
echo.
echo 2. ADMIN DASHBOARD (Tab 2):
echo    - Login with: admin / admin123
echo    - You should see the new order in "Pending Orders"
echo    - Click on the order to view details
echo    - Click "Assign" button
echo    - Select "transcriber1" from dropdown
echo    - Click "Assign Order"
echo.
echo 3. TRANSCRIBER DASHBOARD (Tab 3):
echo    - Login with: transcriber1 / trans123
echo    - You should see the assigned order in "My Tasks"
echo    - Click "Start" to change status to "In Progress"
echo    - Click "Mark Complete" when done
echo.
echo 4. BACK TO ADMIN DASHBOARD (Tab 2):
echo    - Refresh the page
echo    - Find the completed order
echo    - Change status to "Delivered"
echo.
echo 5. PHPMYADMIN (Tab 4):
echo    - Click on "jd_reporting_company" database
echo    - Click on "orders" table
echo    - Verify your order is there with all details
echo    - Check "order_status_history" table for status changes
echo.
echo ============================================================
echo.
echo LOGIN CREDENTIALS:
echo   Admin: admin / admin123
echo   Transcriber: transcriber1 / trans123
echo.
echo ============================================================
echo.
echo If all steps work, your system is 100%% FUNCTIONAL!
echo.
pause
