@echo off
echo ========================================
echo 🚀 STARTING JD TRANSCRIPTS SYSTEM
echo ========================================
echo.

echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Starting Backend Server...
start "JD Backend" cmd /k "node backend-server.js"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo 🌐 Starting Frontend Server...
start "JD Frontend" cmd /k "npx http-server . -p 3000 -c-1"

echo.
echo ⏳ Waiting for frontend to start...
timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo ✅ SYSTEM STARTED SUCCESSFULLY!
echo ========================================
echo.
echo 🌐 Frontend URL: http://localhost:3000
echo 🔧 Backend API: http://localhost:3001/api
echo 📊 Admin Dashboard: http://localhost:3000/admin-dashboard-new.html
echo.
echo 📋 Test the system:
echo 1. Go to: http://localhost:3000/order.html
echo 2. Fill out and submit an order
echo 3. Go to: http://localhost:3000/admin-dashboard-new.html
echo 4. Login with: admin / admin123
echo 5. View the order in the admin dashboard
echo.
echo Opening system in browser...
start "" "http://localhost:3000"
start "" "http://localhost:3000/admin-dashboard-new.html"

echo.
echo Press any key to exit...
pause > nul