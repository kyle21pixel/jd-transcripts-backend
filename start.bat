@echo off
echo Starting JD Legal Transcripts Application...
echo.

echo Starting backend server...
start cmd /k "cd server && npm install && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting frontend client...
start cmd /k "cd client && npm install && npm start"

echo.
echo Both server and client are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo Admin login: http://localhost:3000/admin (username: jd.admin, password: admin123)
pause