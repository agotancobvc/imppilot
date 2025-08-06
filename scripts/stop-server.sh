#!/bin/bash

# Stop ImPilot Backend Server
# This script stops the Node.js application managed by PM2

set -e

echo "Stopping ImPilot backend server..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found, installing..."
    npm install -g pm2
fi

# Stop the application if it's running
if pm2 list | grep -q "imppilot-backend"; then
    echo "Stopping existing imppilot-backend process..."
    pm2 stop imppilot-backend || true
    pm2 delete imppilot-backend || true
    echo "Server stopped successfully"
else
    echo "No running imppilot-backend process found"
fi

# Kill any process running on port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null; then
    echo "Killing processes on port 3000..."
    lsof -Pi :3000 -sTCP:LISTEN -t | xargs kill -9 || true
fi

echo "Stop server script completed"
