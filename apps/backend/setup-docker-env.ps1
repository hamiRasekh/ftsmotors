# PowerShell script to setup Docker environment
# This script updates DATABASE_URL for Docker development

$envFile = Join-Path $PSScriptRoot ".env"

if (Test-Path $envFile) {
    Write-Host "Updating .env file for Docker development..." -ForegroundColor Yellow
    
    $content = Get-Content $envFile -Raw
    $content = $content -replace 'localhost:5432', 'postgres:5432'
    $content = $content -replace 'NODE_ENV=development', 'NODE_ENV=production'
    
    Set-Content -Path $envFile -Value $content -NoNewline
    
    Write-Host "✅ .env file updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "DATABASE_URL is now set to: postgres:5432" -ForegroundColor Cyan
    Write-Host "Make sure Docker containers are running: docker-compose up -d" -ForegroundColor Yellow
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
}

