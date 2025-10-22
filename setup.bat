@echo off
echo Starting JD Reporting System Setup...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
npm install

REM Setup environment variables if .env doesn't exist
if not exist .env (
    echo Creating .env file...
    echo DB_HOST=localhost> .env
    echo DB_USER=root>> .env
    echo DB_PASSWORD=your_password>> .env
    echo DB_DATABASE=jd_reporting>> .env
    echo PORT=3000>> .env
    echo JWT_SECRET=your_jwt_secret_key_here>> .env
    echo FRONTEND_URL=http://localhost:3000>> .env
)

REM Initialize database
echo Initializing database...
node database/init.js

REM Start the server
echo Starting the server...
npm start