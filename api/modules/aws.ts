/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  S3Client, 
  PutObjectCommand
} from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import * as os from 'os';
import { User } from '../database/models/user.model.ts';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

async function splitCsvFile(
  file: Express.Multer.File,
  chunkSize: number
): Promise<Buffer[]> {
  const rows: any[] = [];
  const chunks: Buffer[] = [];
  let header: string | null = null;

  await new Promise<void>((resolve, reject) => {
    Readable.from(file.buffer)
      .pipe(csvParser())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('headers', (headers) => {
        header = headers.join(',');
      })
      .on('end', resolve)
      .on('error', reject);
  });

  if (!header) {
    throw new Error('Invalid CSV file: No headers found');
  }

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunkRows = rows.slice(i, i + chunkSize);
    const chunkCsv = [
      header,
      ...chunkRows.map((row) => Object.values(row).join(','))
    ].join(os.EOL);
    chunks.push(Buffer.from(chunkCsv, 'utf-8'));
  }

  return chunks;
}

export async function uploadStorygraphImportFile(
  file: Express.Multer.File,
  user: User
): Promise<void> {
  const chunkSize = 20;
  const chunks = await splitCsvFile(file, chunkSize);

  try {
    for (let i = 0; i < chunks.length; i++) {
      const partKey = `storygraph/${user.id}_part${i + 1}.csv`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: partKey,
        Body: chunks[i]
      });

      await s3Client.send(command);
      console.log(`Uploaded part ${i + 1} to ${partKey}`);
    }
  } catch (error) {
    console.error('Error uploading storygraph import file parts', error);
    throw error;
  }
}
