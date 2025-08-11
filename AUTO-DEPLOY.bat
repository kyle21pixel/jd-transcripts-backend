@echo off
color 0A
echo.
echo ========================================
echo   JD LEGAL TRANSCRIPTS AUTO-DEPLOY
echo ========================================
echo.
echo 🚀 OPENING DEPLOYMENT SITES...

start "" "https://app.netlify.com/drop"
start "" "https://railway.app/new"
explorer "C:\Users\Kyle\Desktop\JD-Deployment"

echo.
echo ✅ Everything opened! Follow these steps:
echo.
echo STEP 1 - NETLIFY (2 minutes):
echo 1. Drag jd-transcripts-frontend.zip to Netlify
echo 2. Copy your URL (e.g., https://amazing-123456.netlify.app)
echo.
echo STEP 2 - RAILWAY (3 minutes):
echo 1. Upload jd-transcripts-backend.zip
echo 2. Add environment variables (see deployment guide)
echo 3. Replace FRONTEND_URL with your Netlify URL
echo.
echo ADMIN LOGIN:
echo Username: jd.admin
echo Password: admin123
echo.
echo 🎉 YOUR WEBSITE WILL BE LIVE IN 5 MINUTES!
pause