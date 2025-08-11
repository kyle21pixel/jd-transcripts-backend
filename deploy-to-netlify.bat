@echo off
echo ========================================
echo   JD Legal Transcripts - Netlify Deploy
echo ========================================
echo.
echo Your deployment package is ready at:
echo c:\Users\Kyle\jd 3\deploy-package\
echo.
echo DEPLOYMENT STEPS:
echo 1. Go to https://www.netlify.com/
echo 2. Sign up or log in
echo 3. Click "Add new site" - "Deploy manually"
echo 4. Drag and drop the deploy-package folder
echo 5. Wait for deployment to complete
echo.
echo Your site will get a URL like:
echo https://amazing-name-123456.netlify.app
echo.
echo ADMIN ACCESS:
echo - URL: your-site-url/admin
echo - Username: jd.admin
echo - Password: admin123
echo.
echo Opening deploy-package folder...
explorer "c:\Users\Kyle\jd 3\deploy-package"
echo.
echo Opening Netlify website...
start https://www.netlify.com/
echo.
pause