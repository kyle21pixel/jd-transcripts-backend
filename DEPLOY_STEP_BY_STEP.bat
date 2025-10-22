@echo off
echo ========================================
echo 🚀 JD LEGAL TRANSCRIPTS - STEP BY STEP
echo ========================================
echo.
echo Follow these steps to deploy:
echo.

echo Step 1: Open Command Prompt/Terminal
echo Right-click Start → "Command Prompt" or "Terminal"
echo.

echo Step 2: Install Netlify CLI
echo Copy and paste this command:
echo.
echo npm install -g netlify-cli
echo.
echo Press Enter to run it
echo.
pause

echo.
echo Step 3: Login to Netlify
echo Copy and paste this command:
echo.
echo netlify login
echo.
echo Press Enter - a browser will open for you to sign in
echo.
pause

echo.
echo Step 4: Go to the project folder
echo Copy and paste this command:
echo.
echo cd "c:\Users\kyle\Desktop\kyle\Kyle\jd 3"
echo.
pause

echo.
echo Step 5: Build the application
echo Copy and paste these commands:
echo.
echo cd client
echo npm install
echo npm run build
echo cd ..
echo.
pause

echo.
echo Step 6: Deploy to Netlify
echo Copy and paste this command:
echo.
echo netlify deploy --prod --dir=client\build
echo.
echo Press Enter - wait for deployment to complete
echo.

echo ========================================
echo 🎉 YOUR SITE WILL BE LIVE!
echo ========================================
echo.
echo After deployment, copy the URL shown
echo Your site will be at: https://[site-name].netlify.app
echo.
pause