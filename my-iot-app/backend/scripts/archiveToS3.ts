import { DynamoDBStreamEvent, Context } from 'aws-lambda';
import { S3 } from '@aws-sdk/client-s3';
import zlib from 'zlib';

const s3 = new S3({ region: process.env.AWS_REGION });

export const handler = async (event: DynamoDBStreamEvent, _ctx: Context) => {
  const records = event.Records.filter(r => r.eventName === 'REMOVE').map(r => ({
    pk: r.dynamodb?.Keys?.PK.S,
    sk: r.dynamodb?.Keys?.SK.S,
    data: r.dynamodb?.OldImage,
  }));

  if (records.length === 0) return;

  const payload = Buffer.from(JSON.stringify(records), 'utf8');
  const gzipped = zlib.gzipSync(payload);

  const date = new Date();
  const key = `metrics/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}/archive-${Date.now()}.json.gz`;

  await s3.putObject({
    Bucket: process.env.ARCHIVE_BUCKET!,
    Key: key,
    Body: gzipped,
    ContentType: 'application/json',
    ContentEncoding: 'gzip',
  });
};
