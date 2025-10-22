Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "JD Legal Transcripts - Netlify Deployment" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Building React Application..." -ForegroundColor Yellow
Set-Location "client"
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to install client dependencies"
    }

    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to build React application"
    }
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Set-Location ".."
Write-Host "✓ Client build completed successfully" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Checking deployment files..." -ForegroundColor Yellow
if (!(Test-Path "client\build\index.html")) {
    Write-Host "ERROR: Build files not found in client/build/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (!(Test-Path "netlify.toml")) {
    Write-Host "ERROR: netlify.toml not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ All deployment files ready" -ForegroundColor Green
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT READY!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your application is now ready for Netlify deployment." -ForegroundColor White
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Go to https://netlify.com" -ForegroundColor White
Write-Host "2. Sign in or create account" -ForegroundColor White
Write-Host "3. Click 'Deploy manually' or connect GitHub" -ForegroundColor White
Write-Host "4. Upload the entire project folder" -ForegroundColor White
Write-Host "5. Netlify will automatically detect netlify.toml" -ForegroundColor White
Write-Host "6. Your site will be live at: https://your-site-name.netlify.app" -ForegroundColor White
Write-Host ""
Write-Host "BACKEND DEPLOYMENT (Required):" -ForegroundColor Yellow
Write-Host "Deploy the backend to Railway first:" -ForegroundColor White
Write-Host "1. Go to https://railway.app" -ForegroundColor White
Write-Host "2. Create new project" -ForegroundColor White
Write-Host "3. Upload server/ folder" -ForegroundColor White
Write-Host "4. Update the API URLs in netlify.toml with your Railway URL" -ForegroundColor White
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Read-Host "Press Enter to exit"