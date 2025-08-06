#!/bin/bash

# Install Dependencies for ImPilot Backend
# This script installs Node.js dependencies and sets up the environment

set -e

echo "Installing dependencies for ImPilot backend..."

# Navigate to the application directory
cd /home/ec2-user/imppilot

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js not found, installing..."
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
fi

# Check if PM2 is installed globally
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 globally..."
    sudo npm install -g pm2
fi

# Install application dependencies
if [ -f "package.json" ]; then
    echo "Installing Node.js dependencies..."
    npm install --production
else
    echo "No package.json found, skipping npm install"
fi

# Set up environment variables
echo "Setting up environment variables..."
if [ ! -f ".env" ]; then
    cat > .env << EOL
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:ZkifvuTdCcFIlHr9UEzm@imppilot-instance-1.cqx2wy2g0mjg.us-east-1.rds.amazonaws.com:5432/postgres
JWT_ACCESS_SECRET=\$(aws secretsmanager get-secret-value --secret-id jwt-access-secret --query SecretString --output text --region us-east-1)
JWT_REFRESH_SECRET=\$(aws secretsmanager get-secret-value --secret-id jwt-refresh-secret --query SecretString --output text --region us-east-1)
AWS_REGION=us-east-1
EOL
fi

# Set proper permissions
chmod +x /home/ec2-user/imppilot/scripts/*.sh
chown -R ec2-user:ec2-user /home/ec2-user/imppilot

echo "Dependencies installation completed"
