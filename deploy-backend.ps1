# Backend Deployment Script
Write-Host "🚀 Deploying JD Transcripts Backend..." -ForegroundColor Green

# Navigate to server directory
Set-Location "c:\Users\Kyle\jd 3\server"

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

# Check if railway CLI is available
try {
    railway --version
    Write-Host "✅ Railway CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Deploy to Railway
Write-Host "📤 Deploying to Railway..." -ForegroundColor Blue
Write-Host "⚠️  You'll need to login to Railway when prompted" -ForegroundColor Yellow

# Initialize Railway project
railway login
railway init
railway up

Write-Host "✅ Backend deployment complete!" -ForegroundColor Green
Write-Host "🔗 Copy the Railway URL and update frontend config" -ForegroundColor Cyan