# JD Reporting Company - Application Startup Script
# This script starts both the backend and frontend servers

Write-Host "Starting JD Reporting Company Application..." -ForegroundColor Green

# Start Backend Server
$backendPath = Join-Path $PSScriptRoot "server"
$backendProcess = Start-Process -FilePath "node" -ArgumentList "app.js" -WorkingDirectory $backendPath -PassThru -WindowStyle Normal

Write-Host "Backend server started on http://localhost:5000" -ForegroundColor Cyan

# Start Frontend Server
$frontendPath = Join-Path $PSScriptRoot "client"
$frontendProcess = Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory $frontendPath -PassThru -WindowStyle Normal

Write-Host "Frontend server started on http://localhost:3000" -ForegroundColor Cyan
Write-Host "Open http://localhost:3000 in your browser to access the application" -ForegroundColor Yellow

Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Red
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # Clean up processes when script is terminated
    if ($backendProcess -ne $null) {
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if ($frontendProcess -ne $null) {
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Servers stopped" -ForegroundColor Green
}