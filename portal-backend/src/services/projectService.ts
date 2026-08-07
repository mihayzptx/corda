import pool from '../config/database';
import { NotFoundError } from '../middleware/errorHandler';

export interface Project {
  id: string;
  name: string;
  description?: string;
  phase: 'Discovery' | 'Development' | 'QA' | 'Delivery' | 'Complete';
  completion_percent: number;
  start_date?: string;
  estimated_end_date?: string;
  created_at: string;
  updated_at: string;
  milestones?: any[];
}

export async function getProjectsByCustomer(customerId: string): Promise<Project[]> {
  const result = await pool.query(
    `SELECT id, name, description, phase, completion_percent, start_date, estimated_end_date, created_at, updated_at
     FROM projects WHERE customer_id = $1 ORDER BY created_at DESC`,
    [customerId]
  );

  return result.rows;
}

export async function getProjectById(projectId: string, customerId: string): Promise<Project> {
  const result = await pool.query(
    `SELECT id, name, description, phase, completion_percent, start_date, estimated_end_date, created_at, updated_at
     FROM projects WHERE id = $1 AND customer_id = $2`,
    [projectId, customerId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Project not found');
  }

  const project = result.rows[0];

  const milestoneResult = await pool.query(
    `SELECT id, title, target_date, status, description FROM milestones WHERE project_id = $1 ORDER BY target_date ASC`,
    [projectId]
  );

  project.milestones = milestoneResult.rows;

  return project;
}

export async function updateProjectStatus(
  projectId: string,
  updates: { phase?: string; completion_percent?: number; status_summary?: string }
): Promise<Project> {
  const allowedFields = ['phase', 'completion_percent'];
  const setClause = allowedFields
    .filter(field => field in updates)
    .map((field, i) => `${field} = $${i + 1}`)
    .join(', ');

  if (!setClause) {
    throw new Error('No valid fields to update');
  }

  const values = allowedFields.filter(field => field in updates).map(field => updates[field as keyof typeof updates]);
  values.push(projectId);

  const result = await pool.query(
    `UPDATE projects SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
    values
  );

  return result.rows[0];
}
