# Remote deployment script for FTS Motors (PowerShell)
# This script connects to the server and deploys the project

param(
    [string]$ServerIP = "193.105.234.30",
    [string]$ServerPort = "20",
    [string]$ServerUser = "root",
    [string]$ServerPass = "p@ss0509",
    [string]$ServerDir = "/opt/ftsmotors",
    [string]$Domain = "ftsmotors.ir",
    [string]$Email = "admin@ftsmotors.ir"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting remote deployment to $ServerIP" -ForegroundColor Green

# Check if Posh-SSH is installed
if (-not (Get-Module -ListAvailable -Name Posh-SSH)) {
    Write-Host "📦 Installing Posh-SSH module..." -ForegroundColor Yellow
    Install-Module -Name Posh-SSH -Force -Scope CurrentUser
}

Import-Module Posh-SSH

# Create secure password
$SecurePassword = ConvertTo-SecureString $ServerPass -AsPlainText -Force
$Credential = New-Object System.Management.Automation.PSCredential($ServerUser, $SecurePassword)

# SSH connection parameters
$SSHParams = @{
    ComputerName = $ServerIP
    Port = $ServerPort
    Credential = $Credential
    AcceptKey = $true
}

Write-Host "📦 Step 1: Setting up server..." -ForegroundColor Yellow
$setupScript = Get-Content "deploy\setup-server.sh" -Raw
Invoke-SSHCommand @SSHParams -Command "bash -s" -InputObject $setupScript | Out-Null

Write-Host "📤 Step 2: Uploading project files..." -ForegroundColor Yellow
# Use SCP to copy files
$scpParams = @{
    ComputerName = $ServerIP
    Port = $ServerPort
    Credential = $Credential
    LocalPath = "."
    RemotePath = $ServerDir
    Recurse = $true
}

# Exclude unnecessary files
$excludePatterns = @("node_modules", ".git", ".next", "dist", ".env*")
New-SSHSession @SSHParams | Out-Null

# Create directory on server
Invoke-SSHCommand @SSHParams -Command "mkdir -p $ServerDir" | Out-Null

Write-Host "⚙️  Step 3: Setting up environment..." -ForegroundColor Yellow
$envCheck = Invoke-SSHCommand @SSHParams -Command "test -f $ServerDir/.env.production"
if (-not $envCheck.Output) {
    Write-Host "Creating .env.production from example..." -ForegroundColor Yellow
    Invoke-SSHCommand @SSHParams -Command "cd $ServerDir && cp env.production.example .env.production" | Out-Null
    Write-Host "⚠️  Please edit .env.production on server and set secure passwords!" -ForegroundColor Yellow
}

Write-Host "🔨 Step 4: Building and deploying..." -ForegroundColor Yellow
Invoke-SSHCommand @SSHParams -Command "cd $ServerDir && chmod +x deploy/*.sh && ./deploy/deploy.sh" | Out-Null

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your application should be available at:" -ForegroundColor Green
Write-Host "   - https://$Domain" -ForegroundColor Cyan
Write-Host "   - https://api.$Domain" -ForegroundColor Cyan
