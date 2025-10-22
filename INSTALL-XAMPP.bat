@echo off
echo ========================================
echo   Installing XAMPP for WordPress
echo ========================================
echo.
echo This will install XAMPP and complete your WordPress setup.
echo.
echo IMPORTANT: This needs Administrator privileges
echo Right-click this file and "Run as administrator"
echo.
pause

echo Installing XAMPP...
powershell -ExecutionPolicy Bypass -File "install-xampp-now.ps1"

echo.
pause