# Update frontend to use WordPress backend
param(
    [string]$WordPressUrl = "http://localhost/jd-transcripts/wp-json/jd-api/v1"
)

Write-Host "========================================" -ForegroundColor Green
Write-Host "Frontend Update Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$adminScriptPath = "c:\Users\Kyle\jd 3\admin-dashboard-script.js"

if (!(Test-Path $adminScriptPath)) {
    Write-Host "Admin dashboard script not found at: $adminScriptPath" -ForegroundColor Red
    Write-Host "Please check the file path." -ForegroundColor White
    pause
    exit 1
}

Write-Host "Updating admin dashboard script..." -ForegroundColor Yellow

try {
    # Read the current file
    $content = Get-Content $adminScriptPath -Raw
    
    # Create backup
    $backupPath = $adminScriptPath + ".backup." + (Get-Date -Format "yyyyMMdd-HHmmss")
    Copy-Item $adminScriptPath $backupPath
    Write-Host "✓ Backup created: $backupPath" -ForegroundColor Green
    
    # Update the API base URL
    $oldPattern = "const API_BASE = localStorage\.getItem\('apiBase'\) \|\| '[^']+'"
    $newValue = "const API_BASE = localStorage.getItem('apiBase') || '$WordPressUrl'"
    
    $updatedContent = $content -replace $oldPattern, $newValue
    
    # Write the updated content
    $updatedContent | Out-File -FilePath $adminScriptPath -Encoding UTF8
    
    Write-Host "✓ Admin dashboard script updated" -ForegroundColor Green
    Write-Host "  New API URL: $WordPressUrl" -ForegroundColor Gray
    
} catch {
    Write-Host "✗ Failed to update admin dashboard script" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
    
    # Restore backup if it exists
    if (Test-Path $backupPath) {
        Copy-Item $backupPath $adminScriptPath -Force
        Write-Host "  Backup restored" -ForegroundColor Yellow
    }
    
    pause
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Frontend Update Complete" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if there are other files that might need updating
$otherFiles = @(
    "c:\Users\Kyle\jd 3\client\src\config.js",
    "c:\Users\Kyle\jd 3\client\src\utils\api.js",
    "c:\Users\Kyle\jd 3\client\src\services\api.js"
)

Write-Host "Checking for other files that might need updating..." -ForegroundColor Yellow
Write-Host ""

foreach ($file in $otherFiles) {
    if (Test-Path $file) {
        Write-Host "Found: $file" -ForegroundColor White
        Write-Host "  Please manually update the API base URL in this file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Manual updates needed:" -ForegroundColor White
Write-Host "1. Check your React frontend for any hardcoded API URLs" -ForegroundColor Gray
Write-Host "2. Update them to: $WordPressUrl" -ForegroundColor Gray
Write-Host "3. Test your frontend with the new backend" -ForegroundColor Gray
Write-Host "4. Deploy to Netlify when ready" -ForegroundColor Gray
Write-Host ""

pause