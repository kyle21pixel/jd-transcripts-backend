@echo off
echo JD Reporting Company - Test Environment Deployment
echo ================================================
echo.
echo This script will deploy the test environment for the JD Reporting Company website.
echo.

set DEPLOY_DIR=%USERPROFILE%\Desktop\JD-Reporting-Test

echo Creating deployment directory: %DEPLOY_DIR%
mkdir "%DEPLOY_DIR%" 2>nul

echo Extracting test package...
powershell -Command "Expand-Archive -Path 'c:\Users\Kyle\jd 3\jd-reporting-test-package.zip' -DestinationPath '%DEPLOY_DIR%' -Force"

echo.
echo Test environment deployed successfully!
echo.
echo To start the test server:
echo 1. Open a command prompt
echo 2. Navigate to: %DEPLOY_DIR%
echo 3. Run: start-test-server.bat
echo.
echo Or simply double-click on start-test-server.bat in the deployment directory.
echo.
echo Press any key to open the deployment directory...
pause >nul
start "" "%DEPLOY_DIR%"