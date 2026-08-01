/**
 * Task Model
 * CRUD operations for tasks (action items, follow-ups)
 */

import { nanoid } from 'nanoid';
import { getDatabase, transaction } from '../db/migrations';

/**
 * Task interface
 */
export interface Task {
  id: string;
  dealId: string;
  title: string;
  description?: string;
  dueDate?: string;
  assignedTo?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  completedAt?: string;
  remindAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * Input type for creating tasks
 */
export interface CreateTaskInput {
  dealId: string;
  title: string;
  description?: string;
  dueDate?: string;
  assignedTo?: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  remindAt?: string;
}

/**
 * Input type for updating tasks
 */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: string;
  assignedTo?: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  remindAt?: string;
  completedAt?: string;
}

/**
 * Create a new task
 * @param input Task creation data
 * @returns Created task
 */
export function createTask(input: CreateTaskInput): Task {
  return transaction((db) => {
    const id = nanoid();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO tasks (
        id, dealId, title, description, dueDate, assignedTo, status,
        remindAt, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      input.dealId,
      input.title,
      input.description || null,
      input.dueDate || null,
      input.assignedTo || null,
      input.status || 'pending',
      input.remindAt || null,
      now,
      now
    );

    return getTask(id) as Task;
  });
}

/**
 * Get a task by ID
 * Returns null if task not found or is soft-deleted
 * @param taskId Task ID
 * @returns Task or null
 */
export function getTask(taskId: string): Task | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM tasks WHERE id = ? AND deletedAt IS NULL
  `);

  return (stmt.get(taskId) as Task) || null;
}

/**
 * Update a task
 * @param taskId Task ID
 * @param input Update data
 * @returns Updated task
 */
export function updateTask(taskId: string, input: UpdateTaskInput): Task {
  return transaction((db) => {
    const task = getTask(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (input.title !== undefined) {
      updates.push('title = ?');
      values.push(input.title);
    }
    if (input.description !== undefined) {
      updates.push('description = ?');
      values.push(input.description || null);
    }
    if (input.dueDate !== undefined) {
      updates.push('dueDate = ?');
      values.push(input.dueDate || null);
    }
    if (input.assignedTo !== undefined) {
      updates.push('assignedTo = ?');
      values.push(input.assignedTo || null);
    }
    if (input.status !== undefined) {
      updates.push('status = ?');
      values.push(input.status);
    }
    if (input.remindAt !== undefined) {
      updates.push('remindAt = ?');
      values.push(input.remindAt || null);
    }
    if (input.completedAt !== undefined) {
      updates.push('completedAt = ?');
      values.push(input.completedAt || null);
    }

    if (updates.length === 0) {
      return task;
    }

    updates.push('updatedAt = ?');
    values.push(now);
    values.push(taskId);

    const stmt = db.prepare(`
      UPDATE tasks SET ${updates.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);

    return getTask(taskId) as Task;
  });
}

/**
 * Delete a task (soft delete)
 * Sets deletedAt timestamp, doesn't remove from database
 * @param taskId Task ID
 */
export function deleteTask(taskId: string): void {
  transaction((db) => {
    const task = getTask(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE tasks SET deletedAt = ?, updatedAt = ? WHERE id = ?
    `);

    stmt.run(now, now, taskId);
  });
}

/**
 * List all active (non-deleted) tasks
 * @param limit Maximum number of results (default 100)
 * @param offset Pagination offset (default 0)
 * @returns Array of tasks
 */
export function listTasks(limit: number = 100, offset: number = 0): Task[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM tasks
    WHERE deletedAt IS NULL
    ORDER BY dueDate ASC, createdAt DESC
    LIMIT ? OFFSET ?
  `);

  return (stmt.all(limit, offset) as Task[]) || [];
}

/**
 * Get all tasks for a deal
 * @param dealId Deal ID
 * @param limit Maximum number of results (default 100)
 * @param offset Pagination offset (default 0)
 * @returns Array of tasks
 */
export function getTasksByDealId(
  dealId: string,
  limit: number = 100,
  offset: number = 0
): Task[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM tasks
    WHERE dealId = ? AND deletedAt IS NULL
    ORDER BY dueDate ASC, createdAt DESC
    LIMIT ? OFFSET ?
  `);

  return (stmt.all(dealId, limit, offset) as Task[]) || [];
}

/**
 * Get task count for a deal
 * @param dealId Deal ID
 * @returns Number of tasks
 */
export function getTaskCountByDealId(dealId: string): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM tasks
    WHERE dealId = ? AND deletedAt IS NULL
  `);

  const result = stmt.get(dealId) as { count: number };
  return result?.count || 0;
}

/**
 * Get all tasks assigned to a user
 * @param assignedTo User ID or name
 * @param limit Maximum number of results (default 100)
 * @param offset Pagination offset (default 0)
 * @returns Array of tasks
 */
export function getTasksAssignedTo(
  assignedTo: string,
  limit: number = 100,
  offset: number = 0
): Task[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM tasks
    WHERE assignedTo = ? AND deletedAt IS NULL
    ORDER BY dueDate ASC, createdAt DESC
    LIMIT ? OFFSET ?
  `);

  return (stmt.all(assignedTo, limit, offset) as Task[]) || [];
}

/**
 * Get overdue tasks
 * @param limit Maximum number of results (default 50)
 * @returns Array of overdue tasks
 */
export function getOverdueTasks(limit: number = 50): Task[] {
  const db = getDatabase();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    SELECT * FROM tasks
    WHERE deletedAt IS NULL AND dueDate < ? AND status != 'completed'
    ORDER BY dueDate ASC
    LIMIT ?
  `);

  return (stmt.all(now, limit) as Task[]) || [];
}

/**
 * Get tasks by status
 * @param status Task status
 * @param limit Maximum number of results (default 100)
 * @returns Array of tasks
 */
export function getTasksByStatus(
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled',
  limit: number = 100
): Task[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM tasks
    WHERE status = ? AND deletedAt IS NULL
    ORDER BY dueDate ASC, createdAt DESC
    LIMIT ?
  `);

  return (stmt.all(status, limit) as Task[]) || [];
}

/**
 * Mark a task as completed
 * @param taskId Task ID
 */
export function completeTask(taskId: string): Task {
  const now = new Date().toISOString();
  return updateTask(taskId, {
    status: 'completed',
    completedAt: now,
  });
}

/**
 * Get upcoming tasks (due within N days)
 * @param days Number of days to look ahead (default 7)
 * @param limit Maximum number of results (default 50)
 * @returns Array of upcoming tasks
 */
export function getUpcomingTasks(days: number = 7, limit: number = 50): Task[] {
  const db = getDatabase();
  const now = new Date().toISOString();
  const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const stmt = db.prepare(`
    SELECT * FROM tasks
    WHERE deletedAt IS NULL AND dueDate >= ? AND dueDate <= ? AND status != 'completed'
    ORDER BY dueDate ASC
    LIMIT ?
  `);

  return (stmt.all(now, futureDate, limit) as Task[]) || [];
}

/**
 * Search tasks by title or description
 * @param query Search query
 * @param limit Maximum number of results (default 50)
 * @returns Array of matching tasks
 */
export function searchTasks(query: string, limit: number = 50): Task[] {
  const db = getDatabase();
  const searchTerm = `%${query}%`;
  const stmt = db.prepare(`
    SELECT * FROM tasks
    WHERE deletedAt IS NULL AND (
      title LIKE ? OR description LIKE ?
    )
    ORDER BY dueDate ASC, createdAt DESC
    LIMIT ?
  `);

  return (stmt.all(searchTerm, searchTerm, limit) as Task[]) || [];
}
