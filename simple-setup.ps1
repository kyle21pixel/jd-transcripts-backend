Write-Host "Setting up WordPress for JD Legal Transcripts..." -ForegroundColor Green

# Check for web server
try {
    $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 5
    Write-Host "Web server is running" -ForegroundColor Green
} catch {
    Write-Host "No web server found. Please install XAMPP first." -ForegroundColor Red
    Write-Host "Download from: https://www.apachefriends.org/download.html" -ForegroundColor Yellow
    exit 1
}

# Set paths
$htdocs = "C:\xampp\htdocs"
$wp = "$htdocs\wordpress"

# Check htdocs
if (-not (Test-Path $htdocs)) {
    Write-Host "htdocs not found. Please install XAMPP." -ForegroundColor Red
    exit 1
}

Write-Host "Found htdocs directory" -ForegroundColor Green

# Download WordPress
if (-not (Test-Path $wp)) {
    Write-Host "Downloading WordPress..." -ForegroundColor Yellow
    
    $zip = "$env:TEMP\wp.zip"
    $temp = "$env:TEMP\wordpress"
    
    Invoke-WebRequest -Uri "https://wordpress.org/latest.zip" -OutFile $zip -UseBasicParsing
    Expand-Archive -Path $zip -DestinationPath $env:TEMP -Force
    Move-Item -Path $temp -Destination $wp -Force
    Remove-Item $zip -Force
    
    Write-Host "WordPress downloaded" -ForegroundColor Green
} else {
    Write-Host "WordPress already exists" -ForegroundColor Green
}

# Copy plugin
$pluginSrc = "c:\Users\Kyle\jd 3\wordpress-backend-plugin"
$pluginDst = "$wp\wp-content\plugins\jd-transcripts-api"

if (Test-Path $pluginSrc) {
    Copy-Item -Path $pluginSrc -Destination $pluginDst -Recurse -Force
    Write-Host "Plugin copied" -ForegroundColor Green
}

# Copy theme
$themeSrc = "c:\Users\Kyle\jd 3\wordpress-theme"
$themeDst = "$wp\wp-content\themes\jd-transcripts"

if (Test-Path $themeSrc) {
    Copy-Item -Path $themeSrc -Destination $themeDst -Recurse -Force
    Write-Host "Theme copied" -ForegroundColor Green
}

# Copy admin files
$files = @("admin-dashboard-new.html", "admin-dashboard-script.js", "admin-dashboard-styles.css", "admin-login-new.html")
foreach ($file in $files) {
    $src = "c:\Users\Kyle\jd 3\$file"
    $dst = "$wp\$file"
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Force
        Write-Host "Copied $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open: http://localhost/wordpress" -ForegroundColor Cyan
Write-Host "2. Complete WordPress installation" -ForegroundColor White
Write-Host "3. Activate JD Transcripts plugin and theme" -ForegroundColor White
Write-Host "4. Test admin dashboard: http://localhost/wordpress/admin" -ForegroundColor Cyan
Write-Host ""

Start-Process "http://localhost/wordpress"