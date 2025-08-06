#!/bin/bash

# Validate ImPilot Backend Service
# This script validates that the application is running correctly

set -e

echo "Validating ImPilot backend service..."

# Wait for the application to start
sleep 10

# Check if the application is running on port 3000
if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null; then
    echo "ERROR: Application is not listening on port 3000"
    exit 1
fi

# Check PM2 process status
if ! pm2 list | grep -q "imppilot-backend.*online"; then
    echo "ERROR: PM2 process 'imppilot-backend' is not online"
    pm2 status
    exit 1
fi

# Health check endpoint test
echo "Testing health check endpoint..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f -s http://localhost:3000/health > /dev/null; then
        echo "✅ Health check endpoint is responding"
        break
    else
        echo "Attempt $attempt/$max_attempts: Health check failed, retrying in 5 seconds..."
        sleep 5
        attempt=$((attempt + 1))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo "ERROR: Health check endpoint failed after $max_attempts attempts"
    echo "Application logs:"
    pm2 logs imppilot-backend --lines 20 || true
    exit 1
fi

# Test basic API endpoint
echo "Testing basic API connectivity..."
if curl -f -s http://localhost:3000/api/auth/clinic > /dev/null; then
    echo "✅ API endpoints are accessible"
else
    echo "⚠️  API endpoints may not be fully ready (this might be expected during initial deployment)"
fi

# Check application logs for errors
echo "Checking application logs for critical errors..."
if pm2 logs imppilot-backend --lines 50 --nostream | grep -i "error\|exception\|failed" | grep -v "Invalid credentials\|Invalid clinic code"; then
    echo "⚠️  Found some errors in logs (review above)"
else
    echo "✅ No critical errors found in recent logs"
fi

echo "✅ Service validation completed successfully"
echo "ImPilot backend is running and responding to requests"
