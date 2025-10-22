@echo off
echo MySQL Password Reset Script
echo ==========================

REM Stop MySQL service (run XAMPP control panel as administrator and stop MySQL first)

REM Start MySQL in safe mode
cd "C:\xampp\mysql\bin"
mysqld --skip-grant-tables --user=mysql

echo MySQL is now running in safe mode.
echo Open another command prompt and run the password reset commands.
echo Press any key to continue...
pause > nul