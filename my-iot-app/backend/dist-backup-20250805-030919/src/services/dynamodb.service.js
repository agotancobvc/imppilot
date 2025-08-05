import { PutItemCommand, } from '@aws-sdk/client-dynamodb';
import { awsClients } from '../config/aws.js';
export const DYNAMO_TABLE_METRICS = 'GaitMetric';
export async function putMetric(item) {
    const cmd = new PutItemCommand({
        TableName: DYNAMO_TABLE_METRICS,
        Item: item,
    });
    return awsClients.dynamo.send(cmd);
}
//# sourceMappingURL=dynamodb.service.js.map