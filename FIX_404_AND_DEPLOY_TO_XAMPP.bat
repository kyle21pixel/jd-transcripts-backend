@echo off
REM JD Reporting - Fix 404 Error for order-form.html
REM This script will copy all required files to XAMPP htdocs

set SRC_DIR="c:\Users\kyle\Desktop\kyle\Kyle\jd 3"
set DEST_DIR="C:\xampp\htdocs\jd 3"

REM Create destination folder if missing
if not exist %DEST_DIR% mkdir %DEST_DIR%

REM Copy main HTML and frontend files
copy %SRC_DIR%\order-form.html %DEST_DIR% /Y
copy %SRC_DIR%\index.html %DEST_DIR% /Y
copy %SRC_DIR%\*.js %DEST_DIR% /Y
copy %SRC_DIR%\*.css %DEST_DIR% /Y

REM Copy backend folder
xcopy %SRC_DIR%\php_backend %DEST_DIR%\php_backend /E /I /Y

REM Copy uploads folder
xcopy %SRC_DIR%\php_backend\uploads %DEST_DIR%\php_backend\uploads /E /I /Y

REM Copy any other essential files
copy %SRC_DIR%\SYSTEM_STATUS_CHECK.php %DEST_DIR% /Y
copy %SRC_DIR%\COMPLETE_FIX_DOCUMENTATION.md %DEST_DIR% /Y
copy %SRC_DIR%\QUICK_REFERENCE.txt %DEST_DIR% /Y
copy %SRC_DIR%\SENIOR_DEVELOPER_FIX.md %DEST_DIR% /Y

REM Done
@echo.
@echo All files copied to XAMPP htdocs!
@echo Try again: http://localhost:8080/jd%%203/order-form.html
@echo.
pause
