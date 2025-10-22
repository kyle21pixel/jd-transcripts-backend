@echo off
echo ========================================
echo 🚀 JD LEGAL TRANSCRIPTS - AUTO DEPLOY
echo ========================================
echo.
echo This script will guide you through automatic deployment
echo.

REM Check if Netlify CLI is installed
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Netlify CLI not found!
    echo.
    echo 📦 Installing Netlify CLI...
    echo Run this command in PowerShell/Terminal:
    echo npm install -g netlify-cli
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✅ Netlify CLI found
echo.

REM Check if user is logged in
netlify status >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 You need to login to Netlify first
    echo.
    echo Run this command:
    echo netlify login
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✅ Netlify login confirmed
echo.

echo 🔍 Checking build files...
if not exist "client\build\index.html" (
    echo ❌ Build files not found!
    echo Run BUILD_APP.bat first
    pause
    exit /b 1
)

echo ✅ Build files ready
echo.

echo 🚀 Starting Netlify deployment...
echo.

REM Deploy to Netlify
netlify deploy --prod --dir=client\build

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo 🎉 DEPLOYMENT SUCCESSFUL!
    echo ========================================
    echo.
    echo Your site is now live on Netlify!
    echo Check the URL above.
    echo.
    echo 📋 Next Steps:
    echo 1. Copy your live URL
    echo 2. Test all pages
    echo 3. Deploy backend to Railway
    echo.
) else (
    echo.
    echo ❌ DEPLOYMENT FAILED
    echo Check the error messages above
    echo.
)

echo Press any key to continue...
pause >nul