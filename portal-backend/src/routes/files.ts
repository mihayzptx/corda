import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth';
import { uploadFile, getDownloadUrl, deleteFile } from '../services/fileService';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

router.post('/messages/:messageId/files', authenticateToken, upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'validation_error', message: 'No file uploaded' });
    }

    const fileMetadata = await uploadFile(req.params.messageId, req.file, req.userId!);
    res.status(201).json(fileMetadata);
  } catch (err) {
    next(err);
  }
});

router.get('/files/:id/download', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const url = await getDownloadUrl(req.params.id, req.userId!);
    res.redirect(url);
  } catch (err) {
    next(err);
  }
});

router.delete('/files/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteFile(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
