@echo off
echo ========================================
echo JD Transcripts WordPress Backend Setup
echo ========================================
echo.

set XAMPP_PATH=C:\xampp
set WP_PATH=%XAMPP_PATH%\htdocs\jd-transcripts
set PLUGIN_SOURCE=c:\Users\Kyle\jd 3\wordpress-backend-plugin
set PLUGIN_DEST=%WP_PATH%\wp-content\plugins\jd-transcripts-api

echo Checking prerequisites...
echo.

REM Check XAMPP
if exist "%XAMPP_PATH%" (
    echo [OK] XAMPP found at %XAMPP_PATH%
) else (
    echo [ERROR] XAMPP not found. Please install XAMPP first:
    echo   Download from: https://www.apachefriends.org/download.html
    echo   Install to: C:\xampp
    pause
    exit /b 1
)

REM Check WordPress
if exist "%WP_PATH%" (
    echo [OK] WordPress found at %WP_PATH%
) else (
    echo [ERROR] WordPress not found at %WP_PATH%
    echo   Please download WordPress and extract to: %WP_PATH%
    echo   Download from: https://wordpress.org/download/
    pause
    exit /b 1
)

REM Check plugin source
if exist "%PLUGIN_SOURCE%" (
    echo [OK] Plugin source found at %PLUGIN_SOURCE%
) else (
    echo [ERROR] Plugin source not found at %PLUGIN_SOURCE%
    pause
    exit /b 1
)

echo.
echo Copying plugin files...

REM Create plugins directory if needed
if not exist "%WP_PATH%\wp-content\plugins" (
    mkdir "%WP_PATH%\wp-content\plugins"
)

REM Remove existing plugin if it exists
if exist "%PLUGIN_DEST%" (
    rmdir /s /q "%PLUGIN_DEST%"
)

REM Copy plugin files
xcopy "%PLUGIN_SOURCE%" "%PLUGIN_DEST%\" /e /i /h /y
if %errorlevel% equ 0 (
    echo [OK] Plugin files copied successfully
) else (
    echo [ERROR] Failed to copy plugin files
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.

echo Next steps:
echo.
echo 1. Start XAMPP services:
echo    - Open XAMPP Control Panel
echo    - Start Apache and MySQL
echo.
echo 2. Create database:
echo    - Open: http://localhost/phpmyadmin
echo    - Create database: jd_transcripts
echo.
echo 3. Install WordPress:
echo    - Open: http://localhost/jd-transcripts
echo    - Follow installation wizard
echo    - Database: jd_transcripts, User: root, Password: (empty)
echo.
echo 4. Activate plugin:
echo    - Login to: http://localhost/jd-transcripts/wp-admin
echo    - Go to Plugins ^> Installed Plugins
echo    - Activate 'JD Transcripts API Backend'
echo.
echo 5. Run setup wizard:
echo    - Go to Tools ^> JD API Setup
echo    - Configure and run setup
echo.
echo Your API will be available at:
echo http://localhost/jd-transcripts/wp-json/jd-api/v1
echo.

REM Try to open XAMPP Control Panel
if exist "%XAMPP_PATH%\xampp-control.exe" (
    echo Opening XAMPP Control Panel...
    start "" "%XAMPP_PATH%\xampp-control.exe"
)

pause