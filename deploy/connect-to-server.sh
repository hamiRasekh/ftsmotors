#!/bin/bash

# Bash script to connect to production server
# Usage: ./connect-to-server.sh

SERVER_IP="193.105.234.30"
SERVER_PORT="22"
SERVER_USER="root"

echo "🔌 Connecting to production server..."
echo "Server: ${SERVER_USER}@${SERVER_IP}:${SERVER_PORT}"
echo ""

# Connect using SSH
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_IP}
