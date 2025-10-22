@echo off
cls
echo ============================================
echo   JD Reporting - Database Setup
echo ============================================
echo.
echo This will create the database and tables...
echo.
pause

echo Running MySQL commands...
echo.

"C:\xampp\mysql\bin\mysql.exe" -u root -e "SOURCE c:/Users/kyle/Desktop/kyle/Kyle/jd 3/php_backend/setup_database.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo   SUCCESS! Database created!
    echo ============================================
    echo.
    echo Database: jd_reporting_company
    echo Admin User: admin / admin123
    echo Transcriber: transcriber1 / trans123
    echo.
    echo Now opening the dashboard...
    timeout /t 3 /nobreak > nul
    start http://localhost:8080/jd%%203/php_backend/admin/login.php
) else (
    echo.
    echo ============================================
    echo   ERROR! Database setup failed
    echo ============================================
    echo.
    echo Try running this command manually in phpMyAdmin:
    echo Open: http://localhost:8080/phpmyadmin
    echo Then import: php_backend/setup_database.sql
)

echo.
pause
