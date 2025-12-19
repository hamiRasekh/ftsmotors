# PowerShell script to setup local environment
# This script updates DATABASE_URL for local development

$envFile = Join-Path $PSScriptRoot ".env"

if (Test-Path $envFile) {
    Write-Host "Updating .env file for local development..." -ForegroundColor Yellow
    
    $content = Get-Content $envFile -Raw
    $content = $content -replace 'postgres:5432', 'localhost:5432'
    $content = $content -replace 'NODE_ENV=production', 'NODE_ENV=development'
    
    Set-Content -Path $envFile -Value $content -NoNewline
    
    Write-Host "✅ .env file updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "DATABASE_URL is now set to: localhost:5432" -ForegroundColor Cyan
    Write-Host "Make sure PostgreSQL is running on localhost:5432" -ForegroundColor Yellow
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    
    $envContent = @"
DATABASE_URL="postgresql://ftsmotors:ftsmotors123@localhost:5432/ftsmotors?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
"@
    
    Set-Content -Path $envFile -Value $envContent
    Write-Host "✅ .env file created!" -ForegroundColor Green
}

