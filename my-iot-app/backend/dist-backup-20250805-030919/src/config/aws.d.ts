import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
export declare const awsClients: {
    secretsManager: SecretsManagerClient;
    s3: S3Client;
    dynamo: DynamoDBClient;
};
export declare function getSecret(secretName: string): Promise<Record<string, string>>;
//# sourceMappingURL=aws.d.ts.map