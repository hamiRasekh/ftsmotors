#!/bin/bash

# Remote deployment script for FTS Motors
# This script connects to the server and deploys the project

set -e

# Server configuration
SERVER_IP="193.105.234.30"
SERVER_PORT="20"
SERVER_USER="root"
SERVER_PASS="p@ss0509"
SERVER_DIR="/opt/ftsmotors"
DOMAIN="ftsmotors.ir"
EMAIL="admin@ftsmotors.ir"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting remote deployment to $SERVER_IP${NC}"

# Check if sshpass is installed (for password authentication)
if ! command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}⚠️  sshpass not found. Installing...${NC}"
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y sshpass
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install hudochenkov/sshpass/sshpass
    else
        echo -e "${RED}❌ Please install sshpass manually${NC}"
        exit 1
    fi
fi

# Function to execute command on remote server
remote_exec() {
    sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no -p "$SERVER_PORT" "$SERVER_USER@$SERVER_IP" "$1"
}

# Function to copy file to remote server
remote_copy() {
    sshpass -p "$SERVER_PASS" scp -o StrictHostKeyChecking=no -P "$SERVER_PORT" -r "$1" "$SERVER_USER@$SERVER_IP:$2"
}

echo -e "${YELLOW}📦 Step 1: Setting up server...${NC}"
remote_exec "bash -s" < deploy/setup-server.sh || echo "Server setup might have already been done"

echo -e "${YELLOW}📤 Step 2: Uploading project files...${NC}"
# Create directory on server
remote_exec "mkdir -p $SERVER_DIR"

# Copy project files (excluding node_modules, .git, etc.)
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.next' --exclude 'dist' \
    -e "sshpass -p '$SERVER_PASS' ssh -p $SERVER_PORT -o StrictHostKeyChecking=no" \
    ./ "$SERVER_USER@$SERVER_IP:$SERVER_DIR/"

echo -e "${YELLOW}⚙️  Step 3: Setting up environment...${NC}"
# Check if .env.production exists on server
if ! remote_exec "test -f $SERVER_DIR/.env.production"; then
    echo "Creating .env.production from example..."
    remote_exec "cd $SERVER_DIR && cp env.production.example .env.production"
    echo -e "${YELLOW}⚠️  Please edit .env.production on server and set secure passwords!${NC}"
    echo "You can SSH to the server and run: nano $SERVER_DIR/.env.production"
fi

echo -e "${YELLOW}🔨 Step 4: Building and deploying...${NC}"
remote_exec "cd $SERVER_DIR && chmod +x deploy/*.sh && ./deploy/deploy.sh"

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${GREEN}🌐 Your application should be available at:${NC}"
echo -e "   - https://$DOMAIN"
echo -e "   - https://api.$DOMAIN"
echo ""
echo -e "${YELLOW}📝 To check status, SSH to server and run:${NC}"
echo -e "   ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP"
echo -e "   cd $SERVER_DIR && docker-compose -f docker-compose.prod.yml ps"
