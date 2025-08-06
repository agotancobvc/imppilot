#!/bin/bash

# Start ImPilot Backend Server
# This script starts the Node.js application using PM2

set -e

echo "Starting ImPilot backend server..."

# Navigate to the application directory
cd /home/ec2-user/imppilot

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Fetch JWT secrets from AWS Secrets Manager
echo "Fetching JWT secrets from AWS Secrets Manager..."
export JWT_ACCESS_SECRET=$(aws secretsmanager get-secret-value --secret-id jwt-access-secret --query SecretString --output text --region us-east-1 2>/dev/null || echo "fallback-access-secret")
export JWT_REFRESH_SECRET=$(aws secretsmanager get-secret-value --secret-id jwt-refresh-secret --query SecretString --output text --region us-east-1 2>/dev/null || echo "fallback-refresh-secret")

# Run database migrations if needed
if [ -f "dist/prisma/migrate.js" ]; then
    echo "Running database migrations..."
    node dist/prisma/migrate.js || echo "Migration script not found or failed"
fi

# Start the application with PM2
echo "Starting application with PM2..."
pm2 start dist/index.js \
    --name "imppilot-backend" \
    --instances 1 \
    --env production \
    --log /home/ec2-user/imppilot/logs/app.log \
    --error /home/ec2-user/imppilot/logs/error.log \
    --out /home/ec2-user/imppilot/logs/out.log \
    --time

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup systemd -u ec2-user --hp /home/ec2-user || true

echo "ImPilot backend server started successfully"
echo "Application is running on port 3000"
echo "PM2 status:"
pm2 status
