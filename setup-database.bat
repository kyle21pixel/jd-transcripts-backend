@echo off
setlocal

echo Setting up MySQL database for JD Legal Transcripts...

:: Prompt for MySQL root password
set /p MYSQL_ROOT_PASS="Enter MySQL root password: "

:: Create database and user
echo Creating database and user...
mysql -u root -p%MYSQL_ROOT_PASS% -e "CREATE DATABASE IF NOT EXISTS jd_transcripts; CREATE USER IF NOT EXISTS 'jd_user'@'localhost' IDENTIFIED BY 'jd_password'; GRANT ALL PRIVILEGES ON jd_transcripts.* TO 'jd_user'@'localhost'; FLUSH PRIVILEGES;"

if %ERRORLEVEL% neq 0 (
    echo Error: Failed to create database and user
    exit /b 1
)

:: Update .env file
echo Updating .env file...
(
    echo DB_HOST=localhost
    echo DB_USER=jd_user
    echo DB_PASSWORD=jd_password
    echo DB_NAME=jd_transcripts
    echo JWT_SECRET=your_secret_key_here
    echo SMTP_HOST=smtp.gmail.com
    echo SMTP_PORT=587
    echo SMTP_SECURE=false
    echo SMTP_USER=your_email@gmail.com
    echo SMTP_PASS=your_app_password
    echo FRONTEND_URL=http://localhost:3000
    echo PORT=3000
    echo NODE_ENV=development
) > .env

echo Database setup complete!
echo Please update the SMTP settings in .env with your email credentials.
echo.
echo Now running npm install...
npm install

echo.
echo Running database migrations...
npm run migrate

echo.
echo Setup complete! You can now start the server with: npm start
endlocal