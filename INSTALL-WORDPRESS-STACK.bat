@echo off
echo ========================================
echo   JD Legal Transcripts - Complete Setup
echo ========================================
echo.
echo This will install XAMPP, WordPress, and configure everything
echo to replace your Node.js backend with WordPress.
echo.
echo IMPORTANT: This script needs Administrator privileges
echo Right-click this file and "Run as administrator"
echo.
pause

echo Starting complete installation...
powershell -ExecutionPolicy Bypass -File "install-complete-wordpress-stack.ps1"

echo.
echo Installation complete! Check the output above for next steps.
echo.
pause