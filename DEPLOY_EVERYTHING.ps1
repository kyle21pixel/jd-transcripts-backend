# JD Transcripts - Complete Deployment Script
# This script will deploy both frontend and backend automatically

Write-Host "🌟 JD Transcripts - Complete Deployment" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Magenta

# Step 1: Install required CLI tools
Write-Host "`n🔧 Step 1: Installing deployment tools..." -ForegroundColor Green
try {
    npm install -g netlify-cli @railway/cli
    Write-Host "✅ CLI tools installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Error installing CLI tools. Please run as administrator." -ForegroundColor Red
    exit 1
}

# Step 2: Deploy Backend to Railway
Write-Host "`n🚀 Step 2: Deploying Backend to Railway..." -ForegroundColor Green
Set-Location "c:\Users\Kyle\jd 3\server"

Write-Host "📦 Installing server dependencies..." -ForegroundColor Blue
npm install

Write-Host "🔐 Please login to Railway when prompted..." -ForegroundColor Yellow
railway login

Write-Host "🚀 Initializing Railway project..." -ForegroundColor Blue
railway init

Write-Host "📤 Deploying to Railway..." -ForegroundColor Blue
railway up

# Get Railway URL
Write-Host "`n🔗 Getting Railway deployment URL..." -ForegroundColor Blue
$railwayUrl = railway status --json | ConvertFrom-Json | Select-Object -ExpandProperty url

if ($railwayUrl) {
    Write-Host "✅ Backend deployed to: $railwayUrl" -ForegroundColor Green
    
    # Step 3: Update frontend configuration
    Write-Host "`n🔧 Step 3: Updating frontend configuration..." -ForegroundColor Green
    Set-Location "c:\Users\Kyle\jd 3\deploy"
    
    # Update config.js with Railway URL
    $configContent = Get-Content "config.js" -Raw
    $configContent = $configContent -replace "https://your-backend-url\.railway\.app", $railwayUrl
    $configContent | Set-Content "config.js"
    
    Write-Host "✅ Frontend configuration updated" -ForegroundColor Green
} else {
    Write-Host "⚠️  Could not get Railway URL automatically. Please update config.js manually." -ForegroundColor Yellow
}

# Step 4: Deploy Frontend to Netlify
Write-Host "`n🌐 Step 4: Deploying Frontend to Netlify..." -ForegroundColor Green
Set-Location "c:\Users\Kyle\jd 3\deploy"

Write-Host "🔐 Please login to Netlify when prompted..." -ForegroundColor Yellow
netlify login

Write-Host "📤 Deploying to Netlify..." -ForegroundColor Blue
netlify deploy --prod --dir=. --open

Write-Host "`n🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host "✅ Backend deployed to Railway" -ForegroundColor Cyan
Write-Host "✅ Frontend deployed to Netlify" -ForegroundColor Cyan
Write-Host "🌐 Your website should open automatically" -ForegroundColor Cyan
Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Test your website functionality" -ForegroundColor White
Write-Host "2. Update M-Pesa credentials for production" -ForegroundColor White
Write-Host "3. Set up custom domain (optional)" -ForegroundColor White

Write-Host "`n🔗 Useful Commands:" -ForegroundColor Yellow
Write-Host "- View Railway logs: railway logs" -ForegroundColor White
Write-Host "- View Netlify site: netlify open" -ForegroundColor White
Write-Host "- Update deployment: Re-run this script" -ForegroundColor White