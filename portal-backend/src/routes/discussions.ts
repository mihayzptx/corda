import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getDiscussionsByProject,
  getDiscussionById,
  createDiscussion,
  addMessageToDiscussion,
  editMessage,
  deleteMessage,
} from '../services/discussionService';

const router = Router();

router.get('/projects/:projectId/discussions', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discussions = await getDiscussionsByProject(req.params.projectId);
    res.json(discussions);
  } catch (err) {
    next(err);
  }
});

router.get('/discussions/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discussion = await getDiscussionById(req.params.id);
    res.json(discussion);
  } catch (err) {
    next(err);
  }
});

router.post('/discussions', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { project_id, title, content } = req.body;
    const discussion = await createDiscussion(project_id, title, content || '', req.userId!);
    res.status(201).json(discussion);
  } catch (err) {
    next(err);
  }
});

router.post('/discussions/:id/messages', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, parent_message_id } = req.body;
    const message = await addMessageToDiscussion(req.params.id, req.userId!, content, parent_message_id);
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
});

router.patch('/messages/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    const message = await editMessage(req.params.id, content, req.userId!);
    res.json(message);
  } catch (err) {
    next(err);
  }
});

router.delete('/messages/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteMessage(req.params.id, req.userId!);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
