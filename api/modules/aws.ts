import { 
  S3Client, 
  PutObjectCommand, 
  PutObjectCommandOutput 
} from '@aws-sdk/client-s3';
import { User } from '../database/models/user.model.ts';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function uploadStorygraphImportFile(
  file: Express.Multer.File,
  user: User
): Promise<PutObjectCommandOutput> {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: `storygraph/${user.id}.csv`,
      Body: file.buffer
    });

    const result = await s3Client.send(command);
    return result;
  } catch (error) {
    console.error('Error uploading storygraph import file', error);
    throw error;
  }
}
