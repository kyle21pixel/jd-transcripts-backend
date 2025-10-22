# Railway Deployment Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  JD Reporting Company - Railway Deployment  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
try {
    railway --version
    Write-Host "✅ Railway CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI is not installed. Installing..." -ForegroundColor Red
    npm install -g @railway/cli
}

# Login to Railway
Write-Host ""
Write-Host "Step 1: Logging in to Railway..." -ForegroundColor Yellow
railway login

# Link to the project
Write-Host ""
Write-Host "Step 2: Linking to Railway project..." -ForegroundColor Yellow
railway link

# Deploy the project
Write-Host ""
Write-Host "Step 3: Deploying to Railway..." -ForegroundColor Yellow
railway up

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment complete!  " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your backend has been deployed to Railway." -ForegroundColor Green
Write-Host "You can view your deployment at https://railway.app/dashboard" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")