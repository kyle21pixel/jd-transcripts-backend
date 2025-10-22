Write-Host "Starting JD Legal Transcripts Application..." -ForegroundColor Green
Write-Host ""

# Function to start a process in background
function Start-BackgroundProcess {
    param([string]$command, [string]$workingDir)
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = "powershell.exe"
    $startInfo.Arguments = "-Command `"$command`""
    $startInfo.WorkingDirectory = $workingDir
    $startInfo.UseShellExecute = $true
    $startInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Normal
    [System.Diagnostics.Process]::Start($startInfo) | Out-Null
}

Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-BackgroundProcess "npm install; npm run dev" "server"

Write-Host "Waiting 3 seconds for backend to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host "Starting frontend client..." -ForegroundColor Yellow
Start-BackgroundProcess "npm install; npm start" "client"

Write-Host ""
Write-Host "Application starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Admin login: http://localhost:3000/admin (username: jd.admin, password: admin123)" -ForegroundColor Magenta

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")