# Auto deployment script with password authentication
$ErrorActionPreference = "Stop"

$ServerIP = "193.105.234.30"
$ServerPort = "22"  # Trying standard SSH port
$ServerUser = "root"
$ServerPass = "p@ss0509"
$ServerDir = "/opt/ftsmotors"

Write-Host "🚀 Starting automated deployment..." -ForegroundColor Green

# Function to execute SSH command with password
function Invoke-SSHWithPassword {
    param(
        [string]$Command,
        [string]$IP = $ServerIP,
        [int]$Port = $ServerPort,
        [string]$User = $ServerUser,
        [string]$Pass = $ServerPass
    )
    
    # Try using plink (PuTTY) if available, otherwise use ssh with expect-like approach
    $plinkPath = "C:\Program Files\PuTTY\plink.exe"
    
    if (Test-Path $plinkPath) {
        $cmd = "echo y | `"$plinkPath`" -ssh -P $Port -pw `"$Pass`" $User@$IP `"$Command`""
        Invoke-Expression $cmd
    } else {
        # Use ssh with here-string for password (requires sshpass alternative)
        Write-Host "⚠️  PuTTY not found. Please install PuTTY or use manual deployment." -ForegroundColor Yellow
        Write-Host "   Download from: https://www.putty.org/" -ForegroundColor Yellow
        return $false
    }
}

# Test connection
Write-Host "📡 Testing connection..." -ForegroundColor Yellow
try {
    $testResult = Invoke-SSHWithPassword "echo 'Connection successful'"
    if ($testResult) {
        Write-Host "✅ Connection successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Connection failed. Trying alternative method..." -ForegroundColor Red
        # Try with port 20
        $ServerPort = "20"
        $testResult = Invoke-SSHWithPassword "echo 'Connection successful'"
    }
} catch {
    Write-Host "❌ Cannot connect to server. Please check:" -ForegroundColor Red
    Write-Host "   - Server IP: $ServerIP" -ForegroundColor Yellow
    Write-Host "   - Port: $ServerPort" -ForegroundColor Yellow
    Write-Host "   - Username: $ServerUser" -ForegroundColor Yellow
    Write-Host "   - Password: $ServerPass" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Step 1: Installing Docker..." -ForegroundColor Yellow
$dockerCheck = Invoke-SSHWithPassword "command -v docker >/dev/null 2>&1 && echo 'installed' || echo 'not_installed'"
if ($dockerCheck -notmatch "installed") {
    Write-Host "   Installing Docker..." -ForegroundColor Cyan
    Invoke-SSHWithPassword "curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
} else {
    Write-Host "   ✅ Docker already installed" -ForegroundColor Green
}

Write-Host "📦 Step 2: Installing Docker Compose..." -ForegroundColor Yellow
$composeCheck = Invoke-SSHWithPassword "command -v docker-compose >/dev/null 2>&1 && echo 'installed' || echo 'not_installed'"
if ($composeCheck -notmatch "installed") {
    Write-Host "   Installing Docker Compose..." -ForegroundColor Cyan
    Invoke-SSHWithPassword "curl -L `"https://github.com/docker/compose/releases/latest/download/docker-compose-`$(uname -s)-`$(uname -m)`" -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose"
} else {
    Write-Host "   ✅ Docker Compose already installed" -ForegroundColor Green
}

Write-Host "📁 Step 3: Creating project directory..." -ForegroundColor Yellow
Invoke-SSHWithPassword "mkdir -p $ServerDir"

Write-Host "📤 Step 4: Uploading project files..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes..." -ForegroundColor Cyan

# Use PSCP (PuTTY SCP) if available
$pscpPath = "C:\Program Files\PuTTY\pscp.exe"
if (Test-Path $pscpPath) {
    $currentDir = Get-Location
    $excludeArgs = "-x node_modules -x .git -x .next -x dist"
    $pscpCmd = "`"$pscpPath`" -P $ServerPort -pw `"$ServerPass`" -r $excludeArgs `"$currentDir\*`" $User@${IP}:$ServerDir/"
    Invoke-Expression $pscpCmd
} else {
    Write-Host "⚠️  PSCP not found. Please upload files manually using WinSCP:" -ForegroundColor Yellow
    Write-Host "   Host: $ServerIP" -ForegroundColor Cyan
    Write-Host "   Port: $ServerPort" -ForegroundColor Cyan
    Write-Host "   Username: $ServerUser" -ForegroundColor Cyan
    Write-Host "   Password: $ServerPass" -ForegroundColor Cyan
    Write-Host "   Remote path: $ServerDir" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Or install PuTTY from: https://www.putty.org/" -ForegroundColor Yellow
}

Write-Host "⚙️  Step 5: Setting up environment..." -ForegroundColor Yellow
$envExists = Invoke-SSHWithPassword "test -f $ServerDir/.env.production && echo 'exists' || echo 'not_exists'"
if ($envExists -notmatch "exists") {
    Write-Host "   Creating .env.production..." -ForegroundColor Cyan
    Invoke-SSHWithPassword "cd $ServerDir && cp env.production.example .env.production"
    Write-Host "⚠️  IMPORTANT: Please edit .env.production and change passwords!" -ForegroundColor Yellow
    Write-Host "   Run: ssh -p $ServerPort $ServerUser@$ServerIP" -ForegroundColor Cyan
    Write-Host "   Then: nano $ServerDir/.env.production" -ForegroundColor Cyan
}

Write-Host "🔨 Step 6: Deploying application..." -ForegroundColor Yellow
Invoke-SSHWithPassword "cd $ServerDir && chmod +x deploy/*.sh && ./deploy/deploy.sh"

Write-Host ""
Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your application should be available at:" -ForegroundColor Green
Write-Host "   - https://ftsmotors.ir" -ForegroundColor Cyan
Write-Host "   - https://api.ftsmotors.ir" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 To check status:" -ForegroundColor Yellow
Write-Host "   ssh -p $ServerPort $ServerUser@$ServerIP" -ForegroundColor Cyan
Write-Host "   cd $ServerDir" -ForegroundColor Cyan
Write-Host "   docker-compose -f docker-compose.prod.yml ps" -ForegroundColor Cyan
