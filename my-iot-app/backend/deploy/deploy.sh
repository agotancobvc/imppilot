#!/bin/bash
# Deployment script for Gait Metrics Backend to AWS

set -e

# Configuration
STACK_NAME="gait-metrics-backend"
REGION="us-east-1"
KEY_PAIR_NAME="your-key-pair-name"
VPC_ID="vpc-xxxxxxxxx"  # Replace with your VPC ID
SUBNET_IDS="subnet-xxxxxxxxx,subnet-yyyyyyyyy"  # Replace with your subnet IDs

echo "🚀 Starting deployment of Gait Metrics Backend..."

# Step 1: Build the application
echo "📦 Building application..."
npm run build

# Step 2: Create deployment package
echo "📦 Creating deployment package..."
mkdir -p deploy/package
cp -r dist/* deploy/package/
cp package.json deploy/package/
cp package-lock.json deploy/package/
cd deploy/package && npm ci --production && cd ../..

# Step 3: Create S3 bucket for deployment artifacts (if not exists)
DEPLOYMENT_BUCKET="gait-metrics-deployment-$(date +%s)"
aws s3 mb s3://$DEPLOYMENT_BUCKET --region $REGION

# Step 4: Upload deployment package to S3
echo "📤 Uploading deployment package..."
tar -czf deploy/gait-metrics-backend.tar.gz -C deploy/package .
aws s3 cp deploy/gait-metrics-backend.tar.gz s3://$DEPLOYMENT_BUCKET/

# Step 5: Deploy CloudFormation stack
echo "☁️ Deploying CloudFormation stack..."
aws cloudformation deploy \
  --template-file deploy/cloudformation-template.yaml \
  --stack-name $STACK_NAME \
  --parameter-overrides \
    VpcId=$VPC_ID \
    SubnetIds=$SUBNET_IDS \
    KeyPairName=$KEY_PAIR_NAME \
    DBPassword="$(openssl rand -base64 32)" \
  --capabilities CAPABILITY_IAM \
  --region $REGION

# Step 6: Get stack outputs
echo "📋 Getting stack outputs..."
LOAD_BALANCER_DNS=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
  --output text \
  --region $REGION)

S3_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
  --output text \
  --region $REGION)

REDIS_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`RedisEndpoint`].OutputValue' \
  --output text \
  --region $REGION)

# Step 7: Update Secrets Manager with actual values
echo "🔐 Updating secrets..."
aws secretsmanager update-secret \
  --secret-id gait-metrics-prod-secrets \
  --secret-string "{
    \"JWT_ACCESS_SECRET\": \"$(openssl rand -base64 64)\",
    \"JWT_REFRESH_SECRET\": \"$(openssl rand -base64 64)\",
    \"DATABASE_URL\": \"postgresql://gaitmetrics:$(openssl rand -base64 32)@your-rds-endpoint.region.rds.amazonaws.com:5432/gait_metrics_db\",
    \"REDIS_URL\": \"redis://$REDIS_ENDPOINT:6379\"
  }" \
  --region $REGION

# Step 8: Deploy application to EC2 instances
echo "🚀 Deploying application to EC2 instances..."
# Get Auto Scaling Group instances
INSTANCE_IDS=$(aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names gait-metrics-backend-asg \
  --query 'AutoScalingGroups[0].Instances[?LifecycleState==`InService`].InstanceId' \
  --output text \
  --region $REGION)

for INSTANCE_ID in $INSTANCE_IDS; do
  echo "Deploying to instance: $INSTANCE_ID"
  
  # Get instance public IP
  INSTANCE_IP=$(aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text \
    --region $REGION)
  
  # Deploy via SSH (requires key pair access)
  scp -i ~/.ssh/$KEY_PAIR_NAME.pem deploy/gait-metrics-backend.tar.gz ec2-user@$INSTANCE_IP:/tmp/
  
  ssh -i ~/.ssh/$KEY_PAIR_NAME.pem ec2-user@$INSTANCE_IP << 'EOF'
    sudo su -
    cd /opt/gait-metrics-backend
    tar -xzf /tmp/gait-metrics-backend.tar.gz
    chown -R gait-metrics:gait-metrics /opt/gait-metrics-backend
    systemctl restart gait-metrics-backend
    systemctl status gait-metrics-backend
EOF
done

# Step 9: Run database migrations
echo "🗄️ Running database migrations..."
# This would typically be done from one of the EC2 instances
# ssh -i ~/.ssh/$KEY_PAIR_NAME.pem ec2-user@$INSTANCE_IP << 'EOF'
#   cd /opt/gait-metrics-backend
#   npm run migrate
# EOF

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Application URL: http://$LOAD_BALANCER_DNS"
echo "📦 S3 Bucket: $S3_BUCKET"
echo "🔄 Redis Endpoint: $REDIS_ENDPOINT"
echo ""
echo "Next steps:"
echo "1. Configure your RDS PostgreSQL database"
echo "2. Update DNS records to point to the load balancer"
echo "3. Set up SSL certificate for HTTPS"
echo "4. Configure API Gateway to proxy to the load balancer"
echo "5. Set up monitoring and alerting"

# Cleanup
rm -rf deploy/package
rm -f deploy/gait-metrics-backend.tar.gz
