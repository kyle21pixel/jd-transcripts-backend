@echo off
echo ========================================
echo   Copying JD Transcripts Files to WordPress
echo ========================================
echo.

set WORDPRESS_PATH=C:\xampp\htdocs\wordpress

echo Checking if WordPress directory exists...
if not exist "%WORDPRESS_PATH%" (
    echo ERROR: WordPress directory not found at %WORDPRESS_PATH%
    echo Please install WordPress first following the manual guide.
    pause
    exit /b 1
)

echo WordPress directory found!
echo.

echo Copying plugin files...
if exist "wordpress-backend-plugin" (
    xcopy "wordpress-backend-plugin" "%WORDPRESS_PATH%\wp-content\plugins\jd-transcripts-api\" /E /I /Y
    echo Plugin files copied successfully!
) else (
    echo WARNING: Plugin source directory not found
)

echo.
echo Copying theme files...
if exist "wordpress-theme" (
    xcopy "wordpress-theme" "%WORDPRESS_PATH%\wp-content\themes\jd-transcripts\" /E /I /Y
    echo Theme files copied successfully!
) else (
    echo WARNING: Theme source directory not found
)

echo.
echo Copying admin dashboard files...
copy "admin-dashboard-new.html" "%WORDPRESS_PATH%\" 2>nul
copy "admin-dashboard-script.js" "%WORDPRESS_PATH%\" 2>nul
copy "admin-dashboard-styles.css" "%WORDPRESS_PATH%\" 2>nul
copy "admin-login-new.html" "%WORDPRESS_PATH%\" 2>nul
echo Admin files copied!

echo.
echo ========================================
echo   File copying complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to http://localhost/wordpress/wp-admin
echo 2. Login with your WordPress admin credentials
echo 3. Go to Plugins and activate "JD Transcripts API Backend"
echo 4. Go to Appearance ^> Themes and activate "JD Transcripts"
echo 5. Test your admin dashboard at http://localhost/wordpress/admin
echo.
pause