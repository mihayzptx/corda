import { v4 as uuidv4 } from 'uuid';
import s3 from '../config/s3';
import pool from '../config/database';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'video/mp4', 'video/quicktime', 'video/webm'];
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export interface FileMetadata {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
  created_at: string;
}

export async function uploadFile(
  messageId: string,
  file: Express.Multer.File,
  userId: string
): Promise<FileMetadata> {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new ValidationError(`File type not allowed. Allowed types: images, documents, video`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError(`File too large. Maximum size: 100MB`);
  }

  const s3Key = `messages/${uuidv4()}-${file.originalname}`;

  try {
    await s3.putObject({
      Bucket: process.env.S3_BUCKET || 'corda-portal-files',
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      },
    }).promise();

    const fileId = uuidv4();
    await pool.query(
      `INSERT INTO files (id, message_id, filename, file_path, file_size, file_type, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [fileId, messageId, file.originalname, s3Key, file.size, file.mimetype, userId]
    );

    return {
      id: fileId,
      filename: file.originalname,
      file_path: s3Key,
      file_size: file.size,
      file_type: file.mimetype,
      uploaded_by: userId,
      created_at: new Date().toISOString(),
    };
  } catch (err) {
    throw new Error(`Failed to upload file: ${(err as Error).message}`);
  }
}

export async function getDownloadUrl(fileId: string, userId: string): Promise<string> {
  const result = await pool.query('SELECT file_path FROM files WHERE id = $1', [fileId]);

  if (result.rows.length === 0) {
    throw new NotFoundError('File not found');
  }

  const { file_path } = result.rows[0];

  const url = s3.getSignedUrl('getObject', {
    Bucket: process.env.S3_BUCKET || 'corda-portal-files',
    Key: file_path,
    Expires: 3600,
  });

  return url;
}

export async function deleteFile(fileId: string): Promise<void> {
  const result = await pool.query('SELECT file_path FROM files WHERE id = $1', [fileId]);

  if (result.rows.length === 0) {
    throw new NotFoundError('File not found');
  }

  const { file_path } = result.rows[0];

  await s3.deleteObject({
    Bucket: process.env.S3_BUCKET || 'corda-portal-files',
    Key: file_path,
  }).promise();

  await pool.query('DELETE FROM files WHERE id = $1', [fileId]);
}
