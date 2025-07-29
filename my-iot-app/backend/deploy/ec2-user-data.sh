#!/bin/bash
# EC2 User Data Script for Gait Metrics Backend Deployment

# Update system
yum update -y

# Install Node.js 18 (LTS)
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

# Create application directory
mkdir -p /opt/gait-metrics-backend
cd /opt/gait-metrics-backend

# Create deployment user
useradd -r -s /bin/false gait-metrics
chown -R gait-metrics:gait-metrics /opt/gait-metrics-backend

# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
rpm -U ./amazon-cloudwatch-agent.rpm

# Configure CloudWatch agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << 'EOF'
{
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/opt/gait-metrics-backend/logs/app.log",
                        "log_group_name": "/aws/ec2/gait-metrics-backend",
                        "log_stream_name": "{instance_id}/app.log"
                    },
                    {
                        "file_path": "/opt/gait-metrics-backend/logs/error.log",
                        "log_group_name": "/aws/ec2/gait-metrics-backend",
                        "log_stream_name": "{instance_id}/error.log"
                    }
                ]
            }
        }
    },
    "metrics": {
        "namespace": "GaitMetrics/Backend",
        "metrics_collected": {
            "cpu": {
                "measurement": ["cpu_usage_idle", "cpu_usage_iowait", "cpu_usage_user", "cpu_usage_system"],
                "metrics_collection_interval": 60
            },
            "disk": {
                "measurement": ["used_percent"],
                "metrics_collection_interval": 60,
                "resources": ["*"]
            },
            "mem": {
                "measurement": ["mem_used_percent"],
                "metrics_collection_interval": 60
            }
        }
    }
}
EOF

# Start CloudWatch agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s

# Create systemd service
cat > /etc/systemd/system/gait-metrics-backend.service << 'EOF'
[Unit]
Description=Gait Metrics Backend
After=network.target

[Service]
Type=simple
User=gait-metrics
WorkingDirectory=/opt/gait-metrics-backend
ExecStart=/usr/bin/node dist/src/app.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
systemctl daemon-reload
systemctl enable gait-metrics-backend

# Create log directory
mkdir -p /opt/gait-metrics-backend/logs
chown -R gait-metrics:gait-metrics /opt/gait-metrics-backend/logs

echo "EC2 instance setup complete. Ready for application deployment."
