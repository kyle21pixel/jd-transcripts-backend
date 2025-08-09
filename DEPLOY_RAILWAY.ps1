# Simple Railway Deployment Script
Write-Host "🚀 JD Legal Transcripts - Railway Deployment" -ForegroundColor Green

# Install Railway CLI
Write-Host "📦 Installing Railway CLI..." -ForegroundColor Yellow
npm install -g @railway/cli

# Navigate to server directory
Write-Host "📁 Going to server directory..." -ForegroundColor Yellow
Set-Location "c:\Users\Kyle\jd 3\server"

# Login to Railway
Write-Host "🔐 Opening Railway login..." -ForegroundColor Yellow
Write-Host "Please complete login in browser, then return here" -ForegroundColor Cyan
railway login

# Initialize Railway project
Write-Host "🏗️ Creating Railway project..." -ForegroundColor Yellow
railway init

# Deploy
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Yellow
railway up

Write-Host "✅ Deployment complete! Check Railway dashboard for URL" -ForegroundColor Green