import { Router, Request, Response } from 'express';
import { getPrisma } from '../config/db.js';
import { awsClients } from '../config/aws.js';
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';

const router = Router();

/**
 * Health check endpoint for load balancer
 */
router.get('/health', async (req: Request, res: Response) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: 'unknown',
      dynamodb: 'unknown',
      redis: 'unknown'
    }
  };

  let databaseHealthy = false;
  
  try {
    // Check database connection with robust error handling
    const prisma = await getPrisma();
    await prisma.$queryRaw`SELECT 1`;
    healthCheck.services.database = 'healthy';
    databaseHealthy = true;
  } catch (error) {
    console.error('Database health check failed:', error);
    healthCheck.services.database = 'unhealthy';
    healthCheck.status = 'degraded';
    databaseHealthy = false;
  }

  try {
    // Check DynamoDB connection (non-critical)
    const tableName = process.env.DYNAMODB_METRICS_TABLE || 'gait-metrics-prod-metrics';
    await awsClients.dynamo.send(new DescribeTableCommand({ TableName: tableName }));
    healthCheck.services.dynamodb = 'healthy';
  } catch (error) {
    healthCheck.services.dynamodb = 'unhealthy';
    healthCheck.status = 'degraded';
  }

  // Check Redis connection (if configured, non-critical)
  try {
    if (process.env.REDIS_URL) {
      // Redis health check would go here
      healthCheck.services.redis = 'healthy';
    } else {
      healthCheck.services.redis = 'not_configured';
    }
  } catch (error) {
    healthCheck.services.redis = 'unhealthy';
    healthCheck.status = 'degraded';
  }

  // ALB-friendly health check logic:
  // Return 200 if core services (database) are working
  // Only return 503 if critical services are completely down
  const statusCode = databaseHealthy ? 200 : 503;
  
  console.log(`Health check: database=${healthCheck.services.database}, statusCode=${statusCode}`);
  res.status(statusCode).json(healthCheck);
});

/**
 * Readiness check endpoint
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check if all critical services are available
    const prisma = await getPrisma();
    await prisma.$queryRaw`SELECT 1`;
    
    const tableName = process.env.DYNAMODB_METRICS_TABLE || 'gait-metrics-prod-metrics';
    await awsClients.dynamo.send(new DescribeTableCommand({ TableName: tableName }));

    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Liveness check endpoint
 */
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
