# JD Legal Transcripts - Instant Deploy Script
Write-Host "🚀 DEPLOYING JD LEGAL TRANSCRIPTS RIGHT NOW..." -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install from: https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    $npmVersion = npm --version 2>$null
    Write-Host "✅ npm found: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Install Netlify CLI
Write-Host "📦 Installing Netlify CLI..." -ForegroundColor Yellow
try {
    npm install -g netlify-cli 2>$null
    Write-Host "✅ Netlify CLI installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install Netlify CLI" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Login to Netlify
Write-Host "🔐 Logging into Netlify..." -ForegroundColor Yellow
Write-Host "A browser window will open - sign in to Netlify" -ForegroundColor White
try {
    netlify login 2>$null
    Write-Host "✅ Netlify login successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Netlify login failed" -ForegroundColor Red
    Write-Host "Please try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Yellow
Set-Location "client"

if (Test-Path "build") {
    Remove-Item -Recurse -Force "build" 2>$null
}

try {
    npm install 2>$null
    npm run build 2>$null
    Write-Host "✅ Application built successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Set-Location ".."
Write-Host ""

# Deploy to Netlify
Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Yellow
Write-Host "This may take 2-3 minutes..." -ForegroundColor White
Write-Host ""

try {
    $deployOutput = netlify deploy --prod --dir=client\build 2>&1
    Write-Host $deployOutput
    Write-Host ""

    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host "🎉 DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🌐 YOUR SITE IS NOW LIVE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 COPY YOUR LIVE URL FROM ABOVE" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Visit your live site" -ForegroundColor White
    Write-Host "2. Test all pages" -ForegroundColor White
    Write-Host "3. Deploy backend to Railway (optional)" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "❌ DEPLOYMENT FAILED" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔄 Try manual deployment:" -ForegroundColor Yellow
    Write-Host "1. Go to https://netlify.com" -ForegroundColor White
    Write-Host "2. Click 'Deploy manually'" -ForegroundColor White
    Write-Host "3. Upload the 'client/build' folder" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to finish"