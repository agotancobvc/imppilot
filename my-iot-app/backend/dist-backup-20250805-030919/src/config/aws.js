import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
const REGION = process.env.AWS_REGION ?? 'us-east-1';
export const awsClients = {
    secretsManager: new SecretsManagerClient({
        region: REGION,
        credentials: fromNodeProviderChain(),
    }),
    s3: new S3Client({
        region: REGION,
        credentials: fromNodeProviderChain(),
    }),
    dynamo: new DynamoDBClient({
        region: REGION,
        credentials: fromNodeProviderChain(),
    }),
};
export async function getSecret(secretName) {
    const cmd = new GetSecretValueCommand({ SecretId: secretName });
    const { SecretString } = await awsClients.secretsManager.send(cmd);
    if (!SecretString)
        throw new Error(`Secret ${secretName} is empty`);
    return JSON.parse(SecretString);
}
//# sourceMappingURL=aws.js.map