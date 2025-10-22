@echo off
echo ========================================
echo JD Legal Transcripts - Netlify Deployment
echo ========================================
echo.

echo Step 1: Building React Application...
cd client
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)

npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build React application
    pause
    exit /b 1
)

cd ..
echo ✓ Client build completed successfully
echo.

echo Step 2: Checking deployment files...
if not exist "client\build\index.html" (
    echo ERROR: Build files not found in client/build/
    pause
    exit /b 1
)

if not exist "netlify.toml" (
    echo ERROR: netlify.toml not found
    pause
    exit /b 1
)

echo ✓ All deployment files ready
echo.

echo ========================================
echo DEPLOYMENT READY!
echo ========================================
echo.
echo Your application is now ready for Netlify deployment.
echo.
echo NEXT STEPS:
echo 1. Go to https://netlify.com
echo 2. Sign in or create account
echo 3. Click "Deploy manually" or connect GitHub
echo 4. Upload the entire project folder
echo 5. Netlify will automatically detect netlify.toml
echo 6. Your site will be live at: https://your-site-name.netlify.app
echo.
echo BACKEND DEPLOYMENT (Required):
echo Deploy the backend to Railway first:
echo 1. Go to https://railway.app
echo 2. Create new project
echo 3. Upload server/ folder
echo 4. Update the API URLs in netlify.toml with your Railway URL
echo.
echo ========================================
pause