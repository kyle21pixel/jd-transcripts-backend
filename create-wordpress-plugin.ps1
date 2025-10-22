# Create WordPress Plugin for JD Transcripts API
Write-Host "🔌 Creating JD Transcripts API Plugin..." -ForegroundColor Cyan

$pluginDir = "C:\xampp\htdocs\jd-backend\wp-content\plugins\jd-transcripts-api"

# Create plugin directory
if (-not (Test-Path $pluginDir)) {
    New-Item -ItemType Directory -Path $pluginDir -Force | Out-Null
    Write-Host "✅ Plugin directory created" -ForegroundColor Green
}

# Create the main plugin file
$pluginContent = Get-Content -Path "c:\Users\Kyle\jd 3\wordpress-plugin-template.php" -Raw
$pluginContent | Out-File -FilePath "$pluginDir\jd-transcripts-api.php" -Encoding UTF8

Write-Host "✅ JD Transcripts API plugin created at: $pluginDir" -ForegroundColor Green
Write-Host "📋 Next: Activate the plugin in WordPress admin" -ForegroundColor Yellow