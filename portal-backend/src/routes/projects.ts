import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getProjectsByCustomer, getProjectById, updateProjectStatus } from '../services/projectService';
import { ValidationError } from '../middleware/errorHandler';

const router = Router();

router.get('/projects', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await getProjectsByCustomer(req.userId!);
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.get('/projects/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await getProjectById(req.params.id, req.userId!);
    res.json(project);
  } catch (err) {
    next(err);
  }
});

router.patch('/admin/projects/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phase, completion_percent } = req.body;

    if (phase && !['Discovery', 'Development', 'QA', 'Delivery', 'Complete'].includes(phase)) {
      throw new ValidationError('Invalid phase');
    }

    if (completion_percent !== undefined && (completion_percent < 0 || completion_percent > 100)) {
      throw new ValidationError('completion_percent must be between 0 and 100');
    }

    const project = await updateProjectStatus(req.params.id, { phase, completion_percent });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

export default router;
