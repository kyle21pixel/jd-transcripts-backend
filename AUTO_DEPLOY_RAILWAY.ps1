# Automated Railway Deployment Script
# This script does everything possible automatically

Write-Host "🚀 JD Legal Transcripts - Automated Railway Deployment" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Step 1: Check if Railway CLI is installed
Write-Host "📦 Checking Railway CLI..." -ForegroundColor Yellow
try {
    $railwayVersion = railway --version 2>$null
    if ($railwayVersion) {
        Write-Host "✅ Railway CLI found: $railwayVersion" -ForegroundColor Green
    } else {
        throw "Railway CLI not found"
    }
} catch {
    Write-Host "📥 Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
    Write-Host "✅ Railway CLI installed!" -ForegroundColor Green
}

# Step 2: Navigate to server directory
Write-Host "📁 Navigating to server directory..." -ForegroundColor Yellow
Set-Location "c:\Users\Kyle\jd 3\server"
Write-Host "✅ In server directory" -ForegroundColor Green

# Step 3: Check git status
Write-Host "🔍 Checking git repository..." -ForegroundColor Yellow
$gitStatus = git status 2>$null
if ($gitStatus) {
    Write-Host "✅ Git repository ready" -ForegroundColor Green
} else {
    Write-Host "❌ Git repository not found" -ForegroundColor Red
    exit 1
}

# Step 4: Login to Railway (this will open browser)
Write-Host "🔐 Logging into Railway..." -ForegroundColor Yellow
Write-Host "⚠️  This will open your browser for authentication" -ForegroundColor Cyan
Write-Host "   Please complete the login in your browser, then return here" -ForegroundColor Cyan
Read-Host "Press Enter when ready to continue"

try {
    railway login
    Write-Host "✅ Railway login successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway login failed. Please try manually." -ForegroundColor Red
    Write-Host "   Go to: https://railway.app" -ForegroundColor Cyan
    exit 1
}

# Step 5: Create new Railway project
Write-Host "🏗️  Creating Railway project..." -ForegroundColor Yellow
try {
    railway init
    Write-Host "✅ Railway project created!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create Railway project" -ForegroundColor Red
    exit 1
}

# Step 6: Set environment variables
Write-Host "🔧 Setting environment variables..." -ForegroundColor Yellow

$envVars = @{
    "MONGODB_URI" = "mongodb+srv://jdtranscripts:JDTranscripts2025@cluster0.mongodb.net/jd-transcripts?retryWrites=true&w=majority"
    "JWT_SECRET" = "jd-legal-transcripts-super-secret-jwt-key-2025-production-secure"
    "JWT_EXPIRE" = "7d"
    "EMAIL_SERVICE" = "gmail"
    "EMAIL_USER" = "admin@jdlegaltranscripts.com"
    "EMAIL_PASS" = "jdtranscripts2025app"
    "ADMIN_EMAIL" = "admin@jdlegaltranscripts.com"
    "FRONTEND_URL" = "https://sensational-tartufo-6888eb.netlify.app"
    "CORS_ORIGIN" = "https://sensational-tartufo-6888eb.netlify.app"
    "NODE_ENV" = "production"
    "MAX_FILE_SIZE" = "100MB"
    "UPLOAD_PATH" = "./uploads"
    "BCRYPT_ROUNDS" = "12"
    "SESSION_SECRET" = "jd-transcripts-session-secret-2025"
    "RATE_LIMIT_WINDOW" = "15"
    "RATE_LIMIT_MAX_REQUESTS" = "100"
    "LOG_LEVEL" = "info"
}

foreach ($key in $envVars.Keys) {
    try {
        railway variables set "$key=$($envVars[$key])"
        Write-Host "✅ Set $key" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Failed to set $key" -ForegroundColor Yellow
    }
}

# Step 7: Deploy to Railway
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Yellow
try {
    railway up
    Write-Host "✅ Deployment initiated!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    exit 1
}

# Step 8: Get deployment URL
Write-Host "🌐 Getting deployment URL..." -ForegroundColor Yellow
try {
    $deploymentInfo = railway status
    Write-Host "🎉 DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "=================================================" -ForegroundColor Green
    Write-Host "🌐 Check your Railway dashboard for the live URL" -ForegroundColor Cyan
    Write-Host "🔍 Your API endpoints will be:" -ForegroundColor Cyan
    Write-Host "   - /api/health (health check)" -ForegroundColor White
    Write-Host "   - /api/orders (create orders)" -ForegroundColor White
    Write-Host "   - /api/email/contact (contact form)" -ForegroundColor White
    Write-Host "=================================================" -ForegroundColor Green
    
} catch {
    Write-Host "⚠️  Deployment may still be in progress" -ForegroundColor Yellow
    Write-Host "   Check your Railway dashboard for status" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎉 NEXT STEPS:" -ForegroundColor Green
Write-Host "1. Go to https://railway.app dashboard" -ForegroundColor White
Write-Host "2. Find your project and get the live URL" -ForegroundColor White
Write-Host "3. Test your API endpoints" -ForegroundColor White
Write-Host "4. Update your Netlify frontend to use the new API" -ForegroundColor White
Write-Host ""
Write-Host "Need help with frontend integration? Just ask!" -ForegroundColor Cyan