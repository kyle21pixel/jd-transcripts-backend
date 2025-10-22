@echo off
echo ========================================
echo 🚀 JD LEGAL TRANSCRIPTS - FULL AUTO SETUP
echo ========================================
echo.
echo This will install everything and deploy automatically
echo.

echo Step 1: Installing Netlify CLI...
echo.

REM Install Netlify CLI globally
npm install -g netlify-cli

if %errorlevel% neq 0 (
    echo ❌ Failed to install Netlify CLI
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Netlify CLI installed successfully
echo.

echo Step 2: Logging into Netlify...
echo.

REM Login to Netlify
netlify login

if %errorlevel% neq 0 (
    echo ❌ Netlify login failed
    echo Please try again or check your internet connection
    pause
    exit /b 1
)

echo ✅ Netlify login successful
echo.

echo Step 3: Building application...
echo.

REM Build the application
cd client
if exist "build" rmdir /s /q build
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build application
    pause
    exit /b 1
)

cd ..
echo ✅ Application built successfully
echo.

echo Step 4: Deploying to Netlify...
echo.

REM Deploy to Netlify
netlify deploy --prod --dir=client\build

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo 🎉 DEPLOYMENT COMPLETE!
    echo ========================================
    echo.
    echo 🌐 Your site is now LIVE on Netlify!
    echo 📋 Copy the URL from above
    echo.
    echo 🔧 Next Steps:
    echo 1. Visit your live site
    echo 2. Test all functionality
    echo 3. Deploy backend to Railway (optional)
    echo.
    echo 📞 Support: Check DEPLOYMENT_GUIDE.md
    echo.
) else (
    echo.
    echo ❌ DEPLOYMENT FAILED
    echo Please check the error messages above
    echo You can also try manual deployment
    echo.
)

echo Press any key to finish...
pause >nul