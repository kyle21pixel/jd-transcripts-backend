@echo off
echo ========================================
echo JD Legal Transcripts - Railway Deploy
echo ========================================

echo Installing Railway CLI...
npm install -g @railway/cli

echo Navigating to server directory...
cd "c:\Users\Kyle\jd 3\server"

echo Opening Railway login (browser will open)...
echo Please complete login in browser, then press any key to continue
pause

railway login

echo Creating Railway project...
railway init

echo Deploying to Railway...
railway up

echo ========================================
echo Deployment complete!
echo Check your Railway dashboard for the live URL
echo ========================================
pause