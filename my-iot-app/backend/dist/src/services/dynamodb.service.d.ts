import { AttributeValue } from '@aws-sdk/client-dynamodb';
export declare const DYNAMO_TABLE_METRICS = "GaitMetric";
export declare function putMetric(item: Record<string, AttributeValue>): Promise<import("@aws-sdk/client-dynamodb").PutItemCommandOutput>;
//# sourceMappingURL=dynamodb.service.d.ts.map