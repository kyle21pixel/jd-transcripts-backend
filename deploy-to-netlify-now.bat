@echo off
echo ========================================
echo   JD Legal Transcripts - Netlify Deploy
echo ========================================
echo.
echo Your UPDATED deployment package is ready at:
echo c:\Users\kyle\Desktop\kyle\Kyle\jd 3\netlify-deploy\
echo.
echo DEPLOYMENT STEPS:
echo 1. Go to https://www.netlify.com/
echo 2. Sign up or log in to your account
echo 3. Click "Add new site" - "Deploy manually"
echo 4. Drag and drop the entire netlify-deploy folder
echo 5. Wait for deployment to complete
echo.
echo Your site will get a URL like:
echo https://amazing-name-123456.netlify.app
echo.
echo FIXED PAGES NOW AVAILABLE:
echo - https://your-site-url.netlify.app/track-order
echo - https://your-site-url.netlify.app/careers
echo - https://your-site-url.netlify.app/about
echo - https://your-site-url.netlify.app/contact
echo.
echo ADMIN ACCESS:
echo - URL: your-site-url/clean-admin.html
echo - Username: admin
echo - Password: admin123
echo.
echo Opening deployment folder...
explorer "c:\Users\kyle\Desktop\kyle\Kyle\jd 3\netlify-deploy"
echo.
echo Opening Netlify website...
start https://www.netlify.com/
echo.
echo Press any key to close this window...
pause >nul