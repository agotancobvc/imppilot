// backend/src/services/dynamodb.service.ts
import {
    PutItemCommand,
    DynamoDBClient,
    AttributeValue,
  } from '@aws-sdk/client-dynamodb';
  import { awsClients } from '../config/aws.js';
  
  export const DYNAMO_TABLE_METRICS = 'GaitMetric';
  
  /** Store one metric into the dedicated metrics table. */
  export async function putMetric(item: Record<string, AttributeValue>) {
    const cmd = new PutItemCommand({
      TableName: DYNAMO_TABLE_METRICS,
      Item: item,
    });
    return awsClients.dynamo.send(cmd);
  }
  