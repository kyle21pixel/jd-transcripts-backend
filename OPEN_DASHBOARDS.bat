@echo off
cls
echo ============================================
echo   JD Reporting - Dashboard Launcher
echo   (Correct URLs with space encoding)
echo ============================================
echo.
echo Opening Admin Dashboard Login...
echo.
timeout /t 2 /nobreak > nul

start http://localhost:8080/jd%%203/php_backend/admin/login.php

echo.
echo ============================================
echo   All Dashboard URLs:
echo ============================================
echo.
echo Admin Login:
echo   http://localhost:8080/jd%%203/php_backend/admin/login.php
echo.
echo Admin Dashboard:
echo   http://localhost:8080/jd%%203/php_backend/admin/index.php
echo.
echo Transcriber Dashboard:
echo   http://localhost:8080/jd%%203/php_backend/transcriber/index.php
echo.
echo Order Form:
echo   http://localhost:8080/jd%%203/order-form.html
echo.
echo ============================================
echo   Login Credentials:
echo ============================================
echo.
echo Admin:
echo   Username: admin
echo   Password: admin123
echo.
echo Transcriber:
echo   Username: transcriber1
echo   Password: trans123
echo.
echo ============================================
echo.
echo Press any key to exit...
pause > nul
