@echo off
echo ========================================
echo   JD Transcripts - Local Testing
echo ========================================
echo.

echo Testing static HTML site...
echo Opening in browser: http://localhost:8000
echo.

cd /d "c:\Users\Kyle\jd 3"
start "" "http://localhost:8000"

echo Starting local server...
python -m http.server 8000 2>nul || (
    echo Python not found, trying Node.js...
    npx serve . -p 8000 2>nul || (
        echo.
        echo No local server available.
        echo Opening file directly...
        start "" "index.html"
    )
)

echo.
echo ========================================
echo Your website is now running locally!
echo ========================================
echo.
echo Static Site: http://localhost:8000
echo.
echo To test React app:
echo   cd client && npm start
echo.
echo To test backend:
echo   cd server && npm run dev
echo.
echo Press any key to stop server...
pause > nul