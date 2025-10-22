@echo off
echo ========================================
echo 🚀 STARTING COMPLETE JD TRANSCRIPTS SYSTEM
echo ========================================
echo.

echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Starting All Servers...

echo   Starting WordPress-Compatible Backend (Port 8080)...
start "JD WordPress API" cmd /k "node wordpress-api-server.js"

echo   Starting Frontend Server (Port 3000)...
start "JD Frontend" cmd /k "node frontend-server.js"

echo.
echo ⏳ Waiting for servers to start...
timeout /t 8 /nobreak > nul

echo.
echo 🧪 Creating sample orders for testing...
powershell -Command "$body1 = @{ clientName = 'John Smith'; email = 'john.smith@example.com'; phone = '+1-555-0199'; serviceType = 'legal'; turnaroundTime = '24h'; audioLength = '45 minutes'; specialInstructions = 'Legal terminology required for court case.'; estimatedCost = 67.50 } | ConvertTo-Json; try { Invoke-RestMethod -Uri 'http://localhost:8080/wp-json/jd-api/v1/orders' -Method POST -Body $body1 -ContentType 'application/json' | Out-Null; Write-Host 'Sample order 1 created' } catch { Write-Host 'Server still starting...' }"

timeout /t 2 /nobreak > nul

powershell -Command "$body2 = @{ clientName = 'Dr. Sarah Wilson'; email = 'sarah.wilson@hospital.com'; phone = '+1-555-0201'; serviceType = 'medical'; turnaroundTime = '48h'; audioLength = '60 minutes'; specialInstructions = 'Medical conference recording with multiple speakers.'; estimatedCost = 85.00 } | ConvertTo-Json; try { Invoke-RestMethod -Uri 'http://localhost:8080/wp-json/jd-api/v1/orders' -Method POST -Body $body2 -ContentType 'application/json' | Out-Null; Write-Host 'Sample order 2 created' } catch { Write-Host 'Creating sample data...' }"

echo.
echo ========================================
echo ✅ COMPLETE SYSTEM IS LIVE!
echo ========================================
echo.

echo 🌐 CUSTOMER INTERFACE:
echo    Main Website: http://localhost:3000
echo    Order Form:   http://localhost:3000/order.html
echo.

echo 🔧 WORDPRESS ADMIN DASHBOARD:
echo    WordPress Admin: http://localhost:8080/jd-wordpress
echo    Alternative:     http://localhost:8080/wp-admin
echo.

echo 📊 API ENDPOINTS:
echo    WordPress API: http://localhost:8080/wp-json/jd-api/v1
echo    Health Check:  http://localhost:8080/wp-json/wp/v2/health
echo.

echo ========================================
echo 🎯 COMPLETE ORDER MANAGEMENT WORKFLOW
echo ========================================
echo.

echo 📋 CUSTOMER WORKFLOW:
echo    1. Customer goes to: http://localhost:3000/order.html
echo    2. Fills out the order form
echo    3. Submits order and gets confirmation
echo.

echo 👨‍💼 ADMIN WORKFLOW:
echo    1. Admin goes to: http://localhost:8080/jd-wordpress
echo    2. Clicks "Orders" in left menu
echo    3. Sees all pending orders
echo    4. Clicks "Assign" button (blue user-plus icon)
echo    5. Selects transcriber from dropdown
echo    6. Adds assignment notes
echo    7. Clicks "Assign Order"
echo    8. Order status changes to "Assigned"
echo    9. Can update status to "In Progress" or "Completed"
echo.

echo 👥 AVAILABLE TRANSCRIBERS:
echo    • Sarah Johnson - Medical - $45/hr
echo    • Mike Chen - Legal - $50/hr  
echo    • Emily Rodriguez - Business - $40/hr
echo    • David Thompson - Academic - $42/hr
echo    • Lisa Wang - General - $38/hr
echo    • Robert Martinez - Medical - $48/hr
echo.

echo ========================================
echo 🧪 TESTING THE SYSTEM
echo ========================================
echo.

echo 1. PLACE A NEW ORDER:
echo    → Go to: http://localhost:3000/order.html
echo    → Fill out form and submit
echo.

echo 2. MANAGE ORDERS AS ADMIN:
echo    → Go to: http://localhost:8080/jd-wordpress
echo    → Click "Orders" tab
echo    → View, assign, and update orders
echo.

echo 3. REAL-TIME FEATURES:
echo    → Dashboard auto-refreshes every 30 seconds
echo    → Orders table updates in real-time
echo    → Status changes reflect immediately
echo    → Assignment notifications appear
echo.

echo ========================================
echo 🎉 SYSTEM FEATURES INCLUDED
echo ========================================
echo.

echo ✅ Customer order submission
echo ✅ WordPress-style admin dashboard
echo ✅ Real-time order management
echo ✅ Transcriber assignment system
echo ✅ Order status tracking
echo ✅ Detailed order views
echo ✅ Dashboard statistics
echo ✅ Auto-refresh functionality
echo ✅ Professional notifications
echo ✅ Responsive design
echo ✅ WordPress-compatible API
echo ✅ Plugin-ready architecture
echo.

echo Opening system in browser...
start "" "http://localhost:3000"
start "" "http://localhost:8080/jd-wordpress"

echo.
echo ========================================
echo 🎯 SYSTEM IS READY FOR FULL TESTING!
echo ========================================
echo.

echo The complete order management workflow is now live:
echo • Customers can place orders
echo • Admins can see orders in real-time
echo • Orders can be assigned to transcribers
echo • Status can be tracked and updated
echo • Full WordPress-style admin experience
echo.

echo 🚀 Start testing by placing an order and managing it!
echo.
pause