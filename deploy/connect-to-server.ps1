# PowerShell script to connect to production server
# Usage: .\connect-to-server.ps1

$serverIP = "193.105.234.30"
$serverPort = "22"
$serverUser = "root"

Write-Host "🔌 Connecting to production server..." -ForegroundColor Cyan
Write-Host "Server: $serverUser@$serverIP:$serverPort" -ForegroundColor Yellow
Write-Host ""

# Connect using SSH
ssh -p $serverPort $serverUser@$serverIP
