# AWS Deployment Checklist for Gait Metrics Backend

## ✅ Pre-Deployment Checklist

### 1. AWS Prerequisites
- [ ] AWS CLI configured with appropriate permissions
- [ ] EC2 Key Pair created for SSH access
- [ ] VPC and subnets configured (public and private)
- [ ] RDS PostgreSQL instance running
- [ ] Domain name registered (optional)
- [ ] SSL certificate in ACM (optional)

### 2. Environment Configuration
- [ ] Update `.env.production` with your actual values:
  - [ ] `AWS_ACCOUNT_ID`
  - [ ] `DATABASE_URL` (RDS PostgreSQL connection string)
  - [ ] `S3_BUCKET_NAME` and `ARCHIVE_BUCKET`
  - [ ] `REDIS_URL` (ElastiCache endpoint)

### 3. Code Preparation
- [ ] All TypeScript build errors resolved ✅
- [ ] Git repository clean (no secrets in history) ✅
- [ ] Health check endpoints implemented ✅
- [ ] PM2 configuration ready ✅

## 🚀 Deployment Steps

### Step 1: Update Deployment Script
```bash
# Edit deploy/deploy.sh with your values
export VPC_ID="vpc-xxxxxxxxx"                    # Your VPC ID
export SUBNET_IDS="subnet-xxxxx,subnet-yyyyy"   # Your subnet IDs
export KEY_PAIR_NAME="your-key-pair-name"        # Your EC2 key pair
```

### Step 2: Deploy Infrastructure
```bash
# Make deployment script executable
chmod +x deploy/deploy.sh

# Run full deployment
npm run deploy:aws
```

### Step 3: Verify Deployment
```bash
# Check health endpoints
curl https://your-load-balancer-dns/health
curl https://your-load-balancer-dns/ready
curl https://your-load-balancer-dns/live

# Check CloudWatch logs
npm run logs:cloudwatch
```

### Step 4: Configure API Gateway (Optional)
```bash
# Deploy API Gateway stack
aws cloudformation deploy \
  --template-file deploy/api-gateway-config.yaml \
  --stack-name gait-metrics-api-gateway \
  --parameter-overrides \
    LoadBalancerDNS=your-alb-dns \
    DomainName=api.yourdomain.com \
    CertificateArn=your-cert-arn \
  --capabilities CAPABILITY_IAM
```

## 🔧 Post-Deployment Configuration

### Database Setup
```bash
# Run Prisma migrations
npm run migrate:deploy

# Verify database connection
npm run health:check
```

### Secrets Management
```bash
# Update secrets in AWS Secrets Manager
aws secretsmanager update-secret \
  --secret-id gait-metrics-prod-secrets \
  --secret-string '{
    "JWT_ACCESS_SECRET": "your-secure-secret",
    "JWT_REFRESH_SECRET": "your-secure-secret",
    "DATABASE_URL": "postgresql://user:pass@rds-endpoint:5432/db"
  }'
```

## 📊 Monitoring Setup

### CloudWatch Dashboards
- [ ] EC2 instance metrics
- [ ] Application Load Balancer metrics
- [ ] DynamoDB table metrics
- [ ] Custom application metrics

### Alerts Configuration
- [ ] High CPU utilization
- [ ] Memory usage alerts
- [ ] Health check failures
- [ ] Error rate thresholds

## 🔐 Security Verification

### Network Security
- [ ] Security groups properly configured
- [ ] Private subnets for backend instances
- [ ] Public subnets for load balancer only
- [ ] NACLs configured (if used)

### Access Control
- [ ] IAM roles with least privilege
- [ ] Secrets stored in AWS Secrets Manager
- [ ] No hardcoded credentials in code
- [ ] API keys properly managed

## 🧪 Testing Checklist

### Health Endpoints
```bash
# Test all health endpoints
curl -f https://your-endpoint/health    # Should return 200
curl -f https://your-endpoint/ready     # Should return 200
curl -f https://your-endpoint/live      # Should return 200
```

### API Functionality
```bash
# Test authentication endpoints
curl -X POST https://your-endpoint/api/auth/clinic-login \
  -H "Content-Type: application/json" \
  -d '{"code": "test-clinic-code"}'

# Test Socket.IO connection
# Use a WebSocket client to test real-time features
```

### Database Connectivity
```bash
# Verify Prisma connection
node -e "
import { getPrisma } from './dist/src/config/db.js';
const prisma = await getPrisma();
console.log(await prisma.\$queryRaw\`SELECT 1\`);
"
```

## 📈 Performance Optimization

### Auto Scaling Configuration
- [ ] CPU-based scaling policies
- [ ] Request count scaling
- [ ] Custom CloudWatch metrics
- [ ] Proper health check grace periods

### Caching Strategy
- [ ] ElastiCache Redis configured
- [ ] Session management via Redis
- [ ] API response caching (if applicable)
- [ ] Static asset caching via S3/CloudFront

## 🚨 Troubleshooting Guide

### Common Issues

**502 Bad Gateway:**
```bash
# Check application status
ssh -i ~/.ssh/your-key.pem ec2-user@instance-ip
sudo systemctl status gait-metrics-backend
sudo journalctl -u gait-metrics-backend -f
```

**Database Connection Issues:**
```bash
# Test database connectivity
psql -h your-rds-endpoint -U username -d gait_metrics_db
```

**Health Check Failures:**
```bash
# Check health endpoint locally on EC2
curl http://localhost:3000/health
```

## 📋 Maintenance Tasks

### Regular Maintenance
- [ ] Monitor CloudWatch logs and metrics
- [ ] Review and rotate secrets monthly
- [ ] Update dependencies regularly
- [ ] Backup RDS and DynamoDB data
- [ ] Review security group rules

### Scaling Considerations
- [ ] Monitor request patterns
- [ ] Adjust Auto Scaling policies
- [ ] Consider read replicas for RDS
- [ ] Implement DynamoDB auto-scaling

## 🎯 Success Criteria

Your deployment is successful when:
- [ ] All health endpoints return 200 status
- [ ] Application logs show no errors
- [ ] Database connections are working
- [ ] Socket.IO real-time features function
- [ ] Auto Scaling Group maintains desired capacity
- [ ] Load balancer distributes traffic properly
- [ ] CloudWatch metrics are being collected

## 📞 Support Resources

### AWS Documentation
- [EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/)
- [Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/)
- [API Gateway](https://docs.aws.amazon.com/apigateway/)
- [RDS PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/)

### Monitoring Commands
```bash
# View application logs
npm run logs:cloudwatch

# Check stack status
aws cloudformation describe-stacks --stack-name gait-metrics-backend

# Monitor health checks
watch -n 5 'curl -s https://your-endpoint/health | jq .'
```

Your gait metrics backend is now ready for production deployment on AWS! 🚀
