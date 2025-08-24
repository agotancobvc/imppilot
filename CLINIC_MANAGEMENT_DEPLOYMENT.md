# Clinic Management System - Deployment Instructions

## Overview
This document provides step-by-step instructions to deploy the new clinic management system features that enable self-service clinic registration, clinician management, and patient management.

## Database Migration

### Step 1: Run Database Migration on EC2

SSH into your EC2 instance and run the following commands:

```bash
# Navigate to backend directory
cd /home/ec2-user/imppilot/my-iot-app/backend

# Pull latest code with new schema
git stash push -u -m "pre-migration-$(date +%F-%H%M)"
git pull origin main

# Install any new dependencies
npm ci

# Run Prisma migration to update database schema
npx prisma migrate deploy

# Generate updated Prisma client
npx prisma generate

# Build the updated backend
npm run build
```

### Step 2: Restart Backend Service

```bash
# Stop current PM2 process
pm2 delete imppilot-backend

# Start updated backend
pm2 start npm --name imppilot-backend -- start

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs imppilot-backend --lines 50
```

### Step 3: Verify Database Schema

```bash
# Check if new tables exist
npx prisma studio
# Or connect to database and verify AuditLog table exists
```

## Frontend Deployment

### Step 1: Build Frontend with New Components

```bash
# Navigate to frontend directory locally
cd my-iot-app/frontend

# Install dependencies and build
npm ci
npm run build
```

### Step 2: Deploy to S3

Upload the `dist/` folder contents to your S3 bucket `imppilot.com`:

```bash
# Using AWS CLI (if configured)
aws s3 sync dist/ s3://imppilot.com --delete

# Or upload manually via AWS Console
```

### Step 3: Invalidate CloudFront Cache

```bash
# Create CloudFront invalidation
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## New API Endpoints

The following new endpoints are now available:

### Clinic Management
- `POST /api/clinics/register` - Register new clinic
- `GET /api/clinics/verify/:token` - Verify clinic email
- `GET /api/clinics/:clinicId` - Get clinic details
- `PUT /api/clinics/:clinicId` - Update clinic details

### Clinician Management
- `POST /api/clinicians/register` - Register new clinician
- `GET /api/clinicians/clinic/:clinicId` - Get clinicians for clinic
- `PUT /api/clinicians/:clinicianId` - Update clinician
- `DELETE /api/clinicians/:clinicianId` - Deactivate clinician

### Patient Management
- `POST /api/patients` - Add new patient
- `GET /api/patients/clinic/:clinicId` - Get patients for clinic
- `GET /api/patients/clinic/:clinicId/search` - Search patients
- `GET /api/patients/:patientId` - Get patient details
- `PUT /api/patients/:patientId` - Update patient

## New User Flows

### 1. Clinic Registration Flow
1. Visit https://imppilot.com
2. Click "Register New Clinic" on clinic login page
3. Fill out clinic information (name, email, address, phone)
4. Submit registration
5. Check email for verification link
6. Click verification link to activate clinic
7. Use generated clinic code to log in

### 2. Clinician Registration Flow
1. On clinician login page, click "Create Clinician Account"
2. Enter clinic ID (from clinic admin)
3. Fill out personal information and credentials
4. Submit registration
5. Account is immediately active for login

### 3. Patient Management Flow
1. After clinician login, click "Manage Patients" on patient selection page
2. View existing patients or add new patients
3. Search patients by name or MRN
4. Auto-generated MRN format: `CLINICCODE-001`, `CLINICCODE-002`, etc.

## Security Features

### HIPAA Compliance
- **Audit Logging**: All data modifications are logged in `AuditLog` table
- **Data Encryption**: Database connections use SSL/TLS
- **Access Control**: All patient/clinic data requires authentication

### Data Validation
- **Email Verification**: Clinics must verify email before adding clinicians
- **Unique Constraints**: Usernames, emails, and MRNs are unique
- **Required Fields**: Enforced at both frontend and backend levels

## Testing the System

### Test Clinic Registration
1. Register a new clinic with a valid email address
2. Check server logs for verification email details
3. Use the verification token to activate the clinic

### Test Clinician Registration
1. Use the clinic ID from registered clinic
2. Create a clinician account
3. Log in with new credentials

### Test Patient Management
1. Log in as clinician
2. Access patient management
3. Add a new patient and verify MRN generation
4. Search for patients

## Troubleshooting

### Common Issues

1. **Migration Fails**
   ```bash
   # Check database connectivity
   npx prisma db pull
   
   # Reset if needed (CAUTION: This will lose data)
   npx prisma migrate reset
   ```

2. **PM2 Process Issues**
   ```bash
   # Check PM2 logs
   pm2 logs imppilot-backend --lines 100
   
   # Restart if needed
   pm2 restart imppilot-backend
   ```

3. **Frontend Build Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### Health Checks

Verify the system is working:

```bash
# Backend health
curl -sS http://localhost:3000/health

# Test clinic registration endpoint
curl -X POST http://localhost:3000/api/clinics/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Clinic","email":"test@example.com"}'
```

## Environment Variables

Ensure these environment variables are set in production:

```bash
DATABASE_URL="postgresql://..."
JWT_ACCESS_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
FRONTEND_URL="https://imppilot.com"
AWS_REGION="us-east-1"
PORT="3000"
```

## Monitoring

Monitor the following for successful deployment:

1. **Database**: New tables `AuditLog` created
2. **Backend**: PM2 process running without errors
3. **Frontend**: New registration buttons visible
4. **API**: New endpoints responding correctly
5. **Logs**: No critical errors in application logs

## Rollback Plan

If issues occur, rollback steps:

1. **Database**: Restore from backup before migration
2. **Backend**: Revert to previous git commit and redeploy
3. **Frontend**: Restore previous S3 bucket contents
4. **PM2**: Restart with previous version

## Support

For issues during deployment:
- Check PM2 logs: `pm2 logs imppilot-backend`
- Check database connectivity: `npx prisma studio`
- Verify API endpoints: Use curl or Postman to test
- Check frontend console for JavaScript errors
