import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { config } from '../config/index.js';

const client = new DynamoDBClient({
  region: config.database.region,
  credentials: config.database.accessKeyId ? {
    accessKeyId: config.database.accessKeyId,
    secretAccessKey: config.database.secretAccessKey!,
  } : undefined,
});

export const docClient = DynamoDBDocumentClient.from(client);

export interface MetricData {
  patient_id: string;
  timestamp: number;
  metric_id: string;
  value: number;
  session_id?: string;
}

export interface SessionData {
  session_id: string;
  patient_id: string;
  clinician_id: string;
  start_time: number;
  end_time?: number;
  status: 'active' | 'paused' | 'ended';
  metrics: string[];
}

export class MetricDataModel {
  static async create(data: MetricData): Promise<void> {
    const command = new PutCommand({
      TableName: 'MetricData',
      Item: data,
    });
    await docClient.send(command);
  }

  static async getByPatientAndMetric(
    patientId: string, 
    metricId: string, 
    limit: number = 50
  ): Promise<MetricData[]> {
    const command = new QueryCommand({
      TableName: 'MetricData',
      KeyConditionExpression: 'patient_id = :pid AND begins_with(metric_id, :mid)',
      ExpressionAttributeValues: {
        ':pid': patientId,
        ':mid': metricId,
      },
      Limit: limit,
      ScanIndexForward: false,
    });
    
    const result = await docClient.send(command);
    return result.Items as MetricData[];
  }
}

export class SessionDataModel {
  static async create(data: SessionData): Promise<void> {
    const command = new PutCommand({
      TableName: 'SessionData',
      Item: data,
    });
    await docClient.send(command);
  }

  static async getById(sessionId: string): Promise<SessionData | null> {
    const command = new GetCommand({
      TableName: 'SessionData',
      Key: { session_id: sessionId },
    });
    
    const result = await docClient.send(command);
    return result.Item as SessionData || null;
  }
}
