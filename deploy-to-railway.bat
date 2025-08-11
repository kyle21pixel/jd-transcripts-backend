@echo off
echo ========================================
echo   JD Legal Transcripts - Railway Deploy
echo ========================================
echo.
echo Your backend package is ready at:
echo c:\Users\Kyle\jd 3\railway-backend\
echo.
echo DEPLOYMENT STEPS:
echo 1. Go to https://railway.app/
echo 2. Sign up or log in with GitHub
echo 3. Click "New Project" - "Deploy from GitHub repo"
echo 4. Upload the railway-backend folder
echo 5. Set environment variables (see DEPLOYMENT_INSTRUCTIONS.md)
echo.
echo Your API will get a URL like:
echo https://your-app-name.up.railway.app
echo.
echo IMPORTANT: After deployment, update FRONTEND_URL
echo in Railway environment variables with your Netlify URL
echo.
echo Opening railway-backend folder...
explorer "c:\Users\Kyle\jd 3\railway-backend"
echo.
echo Opening Railway website...
start https://railway.app/
echo.
pause