@echo off
echo Executing MySQL Password Reset...
echo ================================

cd "C:\xampp\mysql\bin"

REM Connect to MySQL and execute the reset commands
mysql -u root < "c:\Users\kyle\Desktop\kyle\Kyle\jd 3\mysql-reset-password.sql"

echo Password reset completed!
echo ========================
echo Now you can:
echo 1. Close this command prompt
echo 2. Stop the safe mode MySQL (Ctrl+C in the first command prompt)
echo 3. Start MySQL normally through XAMPP control panel
echo 4. Test your Node.js application
echo.
pause