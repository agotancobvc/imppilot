export interface Config {
  port: number;
  nodeEnv: string;
  database: {
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  };
  aws: {
    region: string;
    s3Bucket: string;
  };
  redis: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const config: Config = {
  port: parseInt(process.env.PORT || '8000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    region: process.env.DYNAMODB_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.S3_BUCKET || 'dashboard-assets',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379/0',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret',
    expiresIn: '24h',
  },
};
