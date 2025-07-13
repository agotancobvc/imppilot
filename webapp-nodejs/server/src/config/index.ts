export const config = {
    port: process.env.PORT || 8000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Database configuration
    database: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      name: process.env.DB_NAME || 'webapp'
    },
    
    // AWS configuration
    aws: {
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      s3Bucket: process.env.S3_BUCKET || 'dashboard-assets'
    },
    
    // Redis configuration
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    
    // Security
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret'
  };
  