# AWS Deployment Guide for Gait Metrics Backend

This guide will help you deploy your TypeScript backend to AWS using your existing infrastructure.

## 🏗️ Architecture Overview

Your deployment will use:
- **EC2 instances** with Auto Scaling Group for the Node.js backend
- **Application Load Balancer** for high availability and health checks
- **API Gateway** as the main entry point with custom domain support
- **RDS PostgreSQL** for structured data (via Prisma)
- **DynamoDB** for real-time gait metrics storage
- **S3** for file storage and archives
- **ElastiCache Redis** for session management and caching
- **Secrets Manager** for secure credential storage

## 📋 Prerequisites

1. **AWS CLI** configured with appropriate permissions
2. **Key Pair** created in EC2 for SSH access
3. **VPC and Subnets** configured (public and private)
4. **Domain name** (optional, for custom API endpoint)
5. **SSL Certificate** in ACM (optional, for HTTPS)

## 🚀 Deployment Steps

### Step 1: Prepare Environment Variables

1. Copy the production environment template:
   ```bash
   cp .env.production .env.prod
   ```

2. Update the following values in `.env.prod`:
   - `AWS_ACCOUNT_ID`: Your AWS account ID
   - `DATABASE_URL`: Your RDS PostgreSQL connection string
   - `S3_BUCKET_NAME`: Your S3 bucket name
   - `ARCHIVE_BUCKET`: Your S3 archive bucket name
   - `REDIS_URL`: Your ElastiCache Redis endpoint

### Step 2: Deploy Infrastructure

1. **Deploy the main infrastructure stack:**
   ```bash
   # Update these variables in deploy/deploy.sh
   export VPC_ID="vpc-xxxxxxxxx"                    # Your VPC ID
   export SUBNET_IDS="subnet-xxxxx,subnet-yyyyy"   # Your subnet IDs (comma-separated)
   export KEY_PAIR_NAME="your-key-pair-name"        # Your EC2 key pair name
   
   # Run the deployment script
   chmod +x deploy/deploy.sh
   ./deploy/deploy.sh
   ```

2. **Deploy API Gateway (optional):**
   ```bash
   # Get the Load Balancer DNS from the previous deployment
   LOAD_BALANCER_DNS=$(aws cloudformation describe-stacks \
     --stack-name gait-metrics-backend \
     --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
     --output text)
   
   # Deploy API Gateway
   aws cloudformation deploy \
     --template-file deploy/api-gateway-config.yaml \
     --stack-name gait-metrics-api-gateway \
     --parameter-overrides \
       LoadBalancerDNS=$LOAD_BALANCER_DNS \
       DomainName="api.yourdomain.com" \
       CertificateArn="arn:aws:acm:region:account:certificate/cert-id" \
     --capabilities CAPABILITY_IAM
   ```

### Step 3: Configure Database

1. **Set up RDS PostgreSQL:**
   ```bash
   # Connect to your RDS instance and create the database
   createdb gait_metrics_db
   
   # Run Prisma migrations (from your local machine or EC2)
   npm run migrate:deploy
   ```

2. **Configure DynamoDB tables** (already created by CloudFormation):
   - `gait-metrics-prod-metrics`: For storing real-time gait data
   - `gait-metrics-prod-sessions`: For session management

### Step 4: Set up Secrets Manager

Update your secrets in AWS Secrets Manager:
```bash
aws secretsmanager update-secret \
  --secret-id gait-metrics-prod-secrets \
  --secret-string '{
    "JWT_ACCESS_SECRET": "your-secure-access-secret",
    "JWT_REFRESH_SECRET": "your-secure-refresh-secret",
    "DATABASE_URL": "postgresql://username:password@your-rds-endpoint:5432/gait_metrics_db"
  }'
```

### Step 5: Deploy Application Code

The deployment script automatically:
1. Builds your TypeScript code
2. Creates a deployment package
3. Uploads it to S3
4. Deploys to EC2 instances via SSH
5. Restarts the application service

### Step 6: Configure Monitoring

1. **CloudWatch Logs**: Automatically configured for application logs
2. **CloudWatch Metrics**: EC2 and application metrics
3. **Health Checks**: Available at `/health`, `/ready`, `/live` endpoints

## 🔧 Configuration Details

### Environment Variables

Your application expects these environment variables (stored in Secrets Manager):

```bash
# Core Configuration
NODE_ENV=production
PORT=3000
AWS_REGION=us-east-1

# Database
DATABASE_URL=postgresql://...

# JWT
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# AWS Services
DYNAMODB_METRICS_TABLE=gait-metrics-prod-metrics
DYNAMODB_SESSIONS_TABLE=gait-metrics-prod-sessions
S3_BUCKET_NAME=your-bucket
ARCHIVE_BUCKET=your-archive-bucket
REDIS_URL=redis://your-elasticache-endpoint:6379
```

### Health Check Endpoints

- **`/health`**: Comprehensive health check including all services
- **`/ready`**: Readiness probe for Kubernetes-style deployments
- **`/live`**: Liveness probe for basic application health

### Security Groups

The CloudFormation template creates these security groups:
- **Backend SG**: Allows traffic from ALB on port 3000, SSH on port 22
- **ALB SG**: Allows HTTP/HTTPS traffic from internet
- **ElastiCache SG**: Allows Redis traffic from backend instances

## 📊 Monitoring and Logging

### CloudWatch Logs
- Application logs: `/aws/ec2/gait-metrics-backend`
- Error logs: Separate log stream for errors

### CloudWatch Metrics
- EC2 instance metrics (CPU, memory, disk)
- Application Load Balancer metrics
- Custom application metrics

### Health Monitoring
```bash
# Check application health
curl https://your-api-gateway-url/health

# Check specific services
curl https://your-load-balancer-dns/ready
```

## 🔄 Deployment Updates

To deploy code updates:

1. **Build and test locally:**
   ```bash
   npm run build
   npm test
   ```

2. **Deploy using the script:**
   ```bash
   ./deploy/deploy.sh
   ```

3. **Verify deployment:**
   ```bash
   curl https://your-api-endpoint/health
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Health check failures:**
   - Check CloudWatch logs for application errors
   - Verify database connectivity
   - Ensure all environment variables are set

2. **502 Bad Gateway:**
   - Application not running on EC2 instances
   - Security group blocking traffic
   - Health check endpoint not responding

3. **Database connection issues:**
   - Verify RDS security group allows connections
   - Check DATABASE_URL in Secrets Manager
   - Ensure Prisma migrations are applied

### Useful Commands

```bash
# Check application status on EC2
ssh -i ~/.ssh/your-key.pem ec2-user@instance-ip
sudo systemctl status gait-metrics-backend

# View application logs
sudo journalctl -u gait-metrics-backend -f

# Restart application
sudo systemctl restart gait-metrics-backend

# Check CloudWatch logs
aws logs tail /aws/ec2/gait-metrics-backend --follow
```

## 🔐 Security Best Practices

1. **Secrets Management**: All sensitive data stored in AWS Secrets Manager
2. **Network Security**: Private subnets for backend, public subnets for ALB
3. **IAM Roles**: Least privilege access for EC2 instances
4. **SSL/TLS**: HTTPS enforced via API Gateway and ALB
5. **Security Groups**: Restrictive inbound rules

## 📈 Scaling

The Auto Scaling Group is configured to:
- **Min Size**: 1 instance
- **Max Size**: 3 instances  
- **Desired**: 2 instances
- **Health Check**: ELB-based with 5-minute grace period

Scale based on:
- CPU utilization
- Request count
- Custom CloudWatch metrics

## 🎯 Next Steps

After deployment:

1. **Set up CI/CD pipeline** (GitHub Actions, CodePipeline)
2. **Configure custom domain** and SSL certificate
3. **Set up monitoring alerts** in CloudWatch
4. **Implement backup strategies** for RDS and DynamoDB
5. **Configure log retention** policies
6. **Set up disaster recovery** procedures

## 📞 Support

For deployment issues:
1. Check CloudWatch logs and metrics
2. Verify all prerequisites are met
3. Review security group and IAM permissions
4. Test individual components (database, DynamoDB, S3)

Your backend is now ready for production deployment on AWS! 🚀
