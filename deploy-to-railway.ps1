# Railway Deployment Script for JD Legal Transcripts Backend
Write-Host "🚀 Deploying JD Legal Transcripts Backend to Railway..." -ForegroundColor Green

# Check if Railway CLI is installed
try {
    railway --version | Out-Null
    Write-Host "✅ Railway CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g @railway/cli" -ForegroundColor Yellow
    Write-Host "Then run: railway login" -ForegroundColor Yellow
    exit 1
}

# Navigate to server directory
Set-Location "c:\Users\Kyle\jd 3\server"

Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Blue

# Check if logged in to Railway
try {
    railway whoami | Out-Null
    Write-Host "✅ Logged in to Railway" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Railway. Please run:" -ForegroundColor Red
    Write-Host "railway login" -ForegroundColor Yellow
    exit 1
}

# Deploy to Railway
Write-Host "🚀 Starting deployment..." -ForegroundColor Green
railway up

Write-Host "✅ Deployment initiated!" -ForegroundColor Green
Write-Host "🌐 Your API will be available at your Railway project URL" -ForegroundColor Blue
Write-Host "📊 Check deployment status at: https://railway.app/dashboard" -ForegroundColor Blue

# Show next steps
Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to Railway dashboard: https://railway.app/dashboard" -ForegroundColor White
Write-Host "2. Find your project and copy the deployment URL" -ForegroundColor White
Write-Host "3. Test your API endpoints:" -ForegroundColor White
Write-Host "   - GET https://your-app.railway.app/" -ForegroundColor Cyan
Write-Host "   - GET https://your-app.railway.app/api/health" -ForegroundColor Cyan
Write-Host "   - POST https://your-app.railway.app/api/orders" -ForegroundColor Cyan
Write-Host "4. Update your frontend to use the new Railway URL" -ForegroundColor White