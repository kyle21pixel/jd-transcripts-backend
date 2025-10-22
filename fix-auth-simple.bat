@echo off
echo Simple MySQL Authentication Fix
echo ==============================

echo Step 1: Stop MySQL in XAMPP Control Panel first!
echo.
echo Step 2: Starting MySQL in safe mode...
cd "C:\xampp\mysql\bin"

REM Start MySQL in safe mode (no authentication required)
mysqld --skip-grant-tables --user=mysql

echo.
echo MySQL is now running in safe mode.
echo.
echo Step 3: Open a NEW command prompt and run this command:
echo "C:\xampp\mysql\bin\mysql.exe" -u root -e "USE mysql; UPDATE user SET plugin='mysql_native_password', authentication_string=PASSWORD('Kyle.21.Nov') WHERE User='root'; FLUSH PRIVILEGES; SELECT 'Password updated successfully!' as Status;"
echo.
echo Step 4: After running the command in the new window,
echo        come back here and press any key to stop MySQL safe mode.
echo.
pause

REM Stop MySQL processes
taskkill /f /im mysqld.exe > nul 2>&1

echo.
echo Done! Now start MySQL normally through XAMPP Control Panel.
echo.
pause