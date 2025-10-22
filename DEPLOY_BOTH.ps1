# JD Reporting Company - Combined Deployment Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  JD Reporting Company - Deployment Script  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Deploy Frontend to Netlify
Write-Host "Step 1: Deploying frontend to Netlify..." -ForegroundColor Yellow
Set-Location "c:\Users\Kyle\jd 3\deploy-package"
netlify deploy --prod

# Step 2: Deploy Backend to Railway
Write-Host ""
Write-Host "Step 2: Preparing backend for Railway deployment..." -ForegroundColor Yellow
Set-Location "c:\Users\Kyle\jd 3\railway-deploy"

# Check if Railway CLI is installed
try {
    railway --version
    Write-Host "✅ Railway CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI is not installed. Installing..." -ForegroundColor Red
    npm install -g @railway/cli
}

# Ask if user wants to deploy to Railway
Write-Host ""
Write-Host "Do you want to deploy the backend to Railway now? (Y/N)" -ForegroundColor Yellow
$deployRailway = Read-Host

if ($deployRailway -eq "Y" -or $deployRailway -eq "y") {
    # Login to Railway
    Write-Host ""
    Write-Host "Logging in to Railway..." -ForegroundColor Yellow
    railway login

    # Link to the project
    Write-Host ""
    Write-Host "Linking to Railway project..." -ForegroundColor Yellow
    railway link

    # Deploy the project
    Write-Host ""
    Write-Host "Deploying to Railway..." -ForegroundColor Yellow
    railway up
} else {
    Write-Host ""
    Write-Host "Skipping Railway deployment." -ForegroundColor Yellow
    Write-Host "To deploy manually, go to https://railway.app/dashboard" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment complete!  " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend deployed to: https://jd-reporting-company.netlify.app" -ForegroundColor Green
Write-Host "Backend deployment status: " -ForegroundColor Green
if ($deployRailway -eq "Y" -or $deployRailway -eq "y") {
    Write-Host "  ✅ Deployed to Railway" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ Manual deployment required" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "For more information, see DEPLOYMENT_INSTRUCTIONS.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")