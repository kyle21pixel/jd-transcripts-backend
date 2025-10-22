# Deploy static site to Netlify and print the live URL
# Usage: Run in PowerShell

param(
    [string]$DeployDir = "c:\Users\Kyle\jd 3"
)

Write-Host "==== JD Transcripts — Netlify Deploy ====" -ForegroundColor Cyan

# Ensure Netlify CLI is available
$nl = Get-Command netlify -ErrorAction SilentlyContinue
if (-not $nl) {
    Write-Host "Netlify CLI not found. Attempting to install (npm install -g netlify-cli)..." -ForegroundColor Yellow
    try {
        npm install -g netlify-cli | Out-Null
        $nl = Get-Command netlify -ErrorAction SilentlyContinue
    } catch {
        Write-Host "Failed to install Netlify CLI automatically. Please install it manually: npm install -g netlify-cli" -ForegroundColor Red
        exit 1
    }
}

# Ensure we are in the project directory
Set-Location $DeployDir

# Make sure netlify.toml is present and publish dir is root
if (-not (Test-Path "$DeployDir\netlify.toml")) {
    Write-Host "netlify.toml not found. Creating a minimal config to deploy from root..." -ForegroundColor Yellow
    @"
[build]
  publish = "."
  command = "echo 'Deploying static site from root'"
"@ | Set-Content -Path "$DeployDir\netlify.toml"
}

# Login status
Write-Host "Checking Netlify auth..." -ForegroundColor Cyan
$loginOutput = netlify status 2>&1
if ($LASTEXITCODE -ne 0 -or ($loginOutput -match "Not logged in")) {
    Write-Host "You are not logged in. A browser window will open for login..." -ForegroundColor Yellow
    netlify login
}

# Link site if needed
if (-not (Test-Path "$DeployDir\.netlify\state.json")) {
    Write-Host "Linking this folder to a Netlify site..." -ForegroundColor Cyan
    netlify link
}

# Deploy to production
Write-Host "Deploying to Netlify (production)..." -ForegroundColor Green
$deployOutput = netlify deploy --prod --dir="$DeployDir" --message "JD Transcripts static deploy" 2>&1
Write-Host $deployOutput

# Try to extract the live URL from deploy output
$liveUrl = ($deployOutput | Select-String -Pattern "Website URL:\s*(https?://\S+)" -AllMatches).Matches | ForEach-Object { $_.Groups[1].Value } | Select-Object -First 1
if (-not $liveUrl) {
    # Fallback to netlify status
    $statusOutput = netlify status 2>&1
    $liveUrl = ($statusOutput | Select-String -Pattern "Site URL:\s*(https?://\S+)" -AllMatches).Matches | ForEach-Object { $_.Groups[1].Value } | Select-Object -First 1
}

if ($liveUrl) {
    "${liveUrl}" | Set-Content -Path "$DeployDir\NETLIFY_URL.txt"
    Write-Host "\nLive URL: $liveUrl" -ForegroundColor Green
    Write-Host "Saved to: $DeployDir\NETLIFY_URL.txt" -ForegroundColor DarkGray
    try { Start-Process $liveUrl } catch {}
} else {
    Write-Host "Could not determine the live URL automatically. Please check the output above or run: netlify status" -ForegroundColor Yellow
}