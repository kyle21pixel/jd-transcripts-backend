@echo off
echo Fixing MySQL Authentication Plugin Issue
echo =======================================

REM Stop MySQL service first (run XAMPP control panel as administrator and stop MySQL)

REM Start MySQL in safe mode
echo Starting MySQL in safe mode...
cd "C:\xampp\mysql\bin"
start /B mysqld --skip-grant-tables --user=mysql

echo Waiting for MySQL to start...
timeout /t 5 /nobreak > nul

echo Fixing authentication plugin...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "USE mysql; UPDATE user SET plugin='mysql_native_password' WHERE User='root'; UPDATE user SET authentication_string=PASSWORD('Kyle.21.Nov') WHERE User='root'; FLUSH PRIVILEGES;"

echo Stopping safe mode MySQL...
taskkill /f /im mysqld.exe > nul 2>&1

echo.
echo Authentication plugin fixed!
echo Now restart MySQL through XAMPP control panel and test your application.
echo.
pause