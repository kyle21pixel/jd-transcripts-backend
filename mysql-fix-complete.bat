@echo off
echo =============================================
echo MySQL Authentication Fix - Complete Solution
echo =============================================
echo.

echo IMPORTANT: Make sure XAMPP Control Panel is CLOSED first!
echo.

echo Step 1: This will start MySQL in safe mode (no authentication required)
cd "C:\xampp\mysql\bin"
start /B mysqld --skip-grant-tables --user=mysql

echo Waiting 3 seconds for MySQL to start...
timeout /t 3 /nobreak > nul

echo.
echo Step 2: Now opening a new command window to fix authentication...
echo (Copy and paste this command in the new window that opens)
echo.

echo Command to run in the new window:
echo "C:\xampp\mysql\bin\mysql.exe" -u root -e "USE mysql; UPDATE user SET plugin='mysql_native_password', authentication_string=PASSWORD('Kyle.21.Nov') WHERE User='root'; UPDATE user SET plugin='mysql_native_password', authentication_string=PASSWORD('Kyle.21.Nov') WHERE User='root' AND Host='localhost'; FLUSH PRIVILEGES; SELECT 'Authentication Fixed!' as Status;"

echo.
echo Step 3: After running the command above in the new window,
echo come back here and press any key to stop safe mode and restart MySQL.
echo.

pause

REM Stop safe mode MySQL
echo Stopping safe mode MySQL...
taskkill /f /im mysqld.exe > nul 2>&1

echo.
echo =============================================
echo FIX COMPLETE!
echo =============================================
echo.
echo Now:
echo 1. Start MySQL in XAMPP Control Panel
echo 2. Test your Node.js application
echo 3. The database 'jd_reporting' will be created automatically
echo.
echo If you still get errors, try restarting your computer.
echo.
pause