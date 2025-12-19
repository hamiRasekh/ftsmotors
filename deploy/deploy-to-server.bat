@echo off
echo ==========================================
echo FTS Motors - Remote Deployment
echo ==========================================
echo.

set SERVER_IP=193.105.234.30
set SERVER_PORT=20
set SERVER_USER=root
set SERVER_DIR=/opt/ftsmotors

echo [1/5] Checking SSH connection...
ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "echo 'Connection successful'" 2>nul
if errorlevel 1 (
    echo ERROR: Cannot connect to server!
    echo Please check:
    echo   - Server IP: %SERVER_IP%
    echo   - Port: %SERVER_PORT%
    echo   - Password: p@ss0509
    echo.
    echo Trying to connect manually...
    ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP%
    pause
    exit /b 1
)

echo [2/5] Setting up server (if needed)...
ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "command -v docker >/dev/null 2>&1 || (curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh)"

echo [3/5] Creating project directory...
ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "mkdir -p %SERVER_DIR%"

echo [4/5] Uploading project files...
echo This may take a few minutes...
scp -P %SERVER_PORT% -r . %SERVER_USER%@%SERVER_IP%:%SERVER_DIR%/ 2>nul
if errorlevel 1 (
    echo.
    echo WARNING: SCP upload failed. Please use WinSCP or manual upload.
    echo.
    echo Manual steps:
    echo 1. Download WinSCP from https://winscp.net
    echo 2. Connect to %SERVER_IP%:%SERVER_PORT%
    echo 3. Upload files to %SERVER_DIR%
    echo.
    pause
)

echo [5/5] Running deployment script on server...
ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "cd %SERVER_DIR% && chmod +x deploy/*.sh && ./deploy/deploy.sh"

echo.
echo ==========================================
echo Deployment completed!
echo ==========================================
echo.
echo Your site should be available at:
echo   - https://ftsmotors.ir
echo   - https://api.ftsmotors.ir
echo.
echo To check status, SSH to server and run:
echo   ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP%
echo   cd %SERVER_DIR%
echo   docker-compose -f docker-compose.prod.yml ps
echo.
pause
