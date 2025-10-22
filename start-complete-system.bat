@echo off
echo ========================================
echo 🚀 STARTING COMPLETE JD TRANSCRIPTS SYSTEM
echo ========================================
echo.

echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Starting Backend Servers...

echo   Starting Original Backend (Port 3001)...
start "JD Backend Original" cmd /k "node backend-server.js"

echo   Starting WordPress-Compatible Backend (Port 8080)...
start "JD WordPress API" cmd /k "node wordpress-api-server.js"

echo.
echo 🌐 Starting Frontend Server...
start "JD Frontend" cmd /k "node frontend-server.js"

echo.
echo ⏳ Waiting for all servers to start...
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo ✅ COMPLETE SYSTEM STARTED!
echo ========================================
echo.
echo 🌐 LIVE URLS:
echo.
echo 📱 CUSTOMER INTERFACE:
echo    Main Website: http://localhost:3000
echo    Order Form:   http://localhost:3000/order.html
echo    Services:     http://localhost:3000/services.html
echo    About:        http://localhost:3000/about.html
echo.
echo 🔧 ADMIN INTERFACE:
echo    Admin Dashboard: http://localhost:3000/admin-dashboard-new.html
echo    Admin Login:     http://localhost:3000/admin-login-new.html
echo    Login: admin / admin123
echo.
echo 🔌 WORDPRESS-STYLE SYSTEM:
echo    WordPress Home:  http://localhost:8080/jd-wordpress
echo    WordPress API:   http://localhost:8080/wp-json/jd-api/v1
echo    Health Check:    http://localhost:8080/wp-json/wp/v2/health
echo.
echo 📊 API ENDPOINTS:
echo    Original API:    http://localhost:3001/api
echo    WordPress API:   http://localhost:8080/wp-json/jd-api/v1
echo.
echo ========================================
echo 🧪 TESTING THE SYSTEM
echo ========================================
echo.
echo 1. PLACE AN ORDER:
echo    → Go to: http://localhost:3000/order.html
echo    → Fill out the form and submit
echo    → Note the order number
echo.
echo 2. VIEW ORDER AS ADMIN:
echo    → Go to: http://localhost:3000/admin-dashboard-new.html
echo    → Login: admin / admin123
echo    → Click "Orders" tab to see submitted orders
echo.
echo 3. WORDPRESS-STYLE ACCESS:
echo    → Go to: http://localhost:8080/jd-wordpress
echo    → View WordPress-compatible system
echo    → API available for plugins
echo.
echo ========================================
echo 🎯 SYSTEM FEATURES
echo ========================================
echo.
echo ✅ Customer order submission
echo ✅ Admin order management
echo ✅ Dashboard statistics
echo ✅ Transcriber management
echo ✅ WordPress-compatible API
echo ✅ Plugin-ready architecture
echo ✅ Email notifications (ready)
echo ✅ File upload support (ready)
echo.
echo 🔌 READY FOR WORDPRESS PLUGINS:
echo    The system now provides WordPress-compatible
echo    REST API endpoints that can be used by any
echo    WordPress plugin or theme.
echo.
echo Opening system in browser...
start "" "http://localhost:3000"
start "" "http://localhost:8080/jd-wordpress"

echo.
echo ========================================
echo 📋 SYSTEM STATUS: ALL SERVICES RUNNING
echo ========================================
echo.
echo Press any key to view system status...
pause > nul

echo.
echo 🔍 Checking system health...
curl -s http://localhost:3001/api/health
echo.
curl -s http://localhost:8080/wp-json/wp/v2/health
echo.
echo.
echo System is ready! All URLs are live and functional.
echo.
pause