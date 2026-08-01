/**
 * Activity Model
 * CRUD operations for activities (calls, emails, meetings, etc.)
 * Activities auto-update deal.lastActivityDate when created
 */

import { nanoid } from 'nanoid';
import { getDatabase, transaction } from '../db/migrations';

/**
 * Activity interface
 */
export interface Activity {
  id: string;
  dealId: string;
  contactId?: string;
  type: string;
  subject: string;
  notes?: string;
  outcome?: string;
  duration?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * Input type for creating activities
 */
export interface CreateActivityInput {
  dealId: string;
  contactId?: string;
  type: string;
  subject: string;
  notes?: string;
  outcome?: string;
  duration?: number;
  createdBy?: string;
}

/**
 * Input type for updating activities
 */
export interface UpdateActivityInput {
  type?: string;
  subject?: string;
  notes?: string;
  outcome?: string;
  duration?: number;
}

/**
 * Create a new activity
 * Auto-updates deal.lastActivityDate to current timestamp
 * @param input Activity creation data
 * @returns Created activity
 */
export function createActivity(input: CreateActivityInput): Activity {
  return transaction((db) => {
    const id = nanoid();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO activities (
        id, dealId, contactId, type, subject, notes, outcome, duration,
        createdBy, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      input.dealId,
      input.contactId || null,
      input.type,
      input.subject,
      input.notes || null,
      input.outcome || null,
      input.duration || null,
      input.createdBy || null,
      now,
      now
    );

    // Update deal's lastActivityDate
    const updateDealStmt = db.prepare(`
      UPDATE deals SET lastActivityDate = ?, updatedAt = ? WHERE id = ?
    `);
    updateDealStmt.run(now, now, input.dealId);

    return getActivity(id) as Activity;
  });
}

/**
 * Get an activity by ID
 * Returns null if activity not found or is soft-deleted
 * @param activityId Activity ID
 * @returns Activity or null
 */
export function getActivity(activityId: string): Activity | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM activities WHERE id = ? AND deletedAt IS NULL
  `);

  return (stmt.get(activityId) as Activity) || null;
}

/**
 * Update an activity
 * @param activityId Activity ID
 * @param input Update data
 * @returns Updated activity
 */
export function updateActivity(activityId: string, input: UpdateActivityInput): Activity {
  return transaction((db) => {
    const activity = getActivity(activityId);
    if (!activity) {
      throw new Error(`Activity not found: ${activityId}`);
    }

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (input.type !== undefined) {
      updates.push('type = ?');
      values.push(input.type);
    }
    if (input.subject !== undefined) {
      updates.push('subject = ?');
      values.push(input.subject);
    }
    if (input.notes !== undefined) {
      updates.push('notes = ?');
      values.push(input.notes || null);
    }
    if (input.outcome !== undefined) {
      updates.push('outcome = ?');
      values.push(input.outcome || null);
    }
    if (input.duration !== undefined) {
      updates.push('duration = ?');
      values.push(input.duration || null);
    }

    if (updates.length === 0) {
      return activity;
    }

    updates.push('updatedAt = ?');
    values.push(now);
    values.push(activityId);

    const stmt = db.prepare(`
      UPDATE activities SET ${updates.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);

    return getActivity(activityId) as Activity;
  });
}

/**
 * Delete an activity (soft delete)
 * Sets deletedAt timestamp, doesn't remove from database
 * @param activityId Activity ID
 */
export function deleteActivity(activityId: string): void {
  transaction((db) => {
    const activity = getActivity(activityId);
    if (!activity) {
      throw new Error(`Activity not found: ${activityId}`);
    }

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE activities SET deletedAt = ?, updatedAt = ? WHERE id = ?
    `);

    stmt.run(now, now, activityId);
  });
}

/**
 * List all active (non-deleted) activities
 * @param limit Maximum number of results (default 100)
 * @param offset Pagination offset (default 0)
 * @returns Array of activities
 */
export function listActivities(limit: number = 100, offset: number = 0): Activity[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM activities
    WHERE deletedAt IS NULL
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);

  return (stmt.all(limit, offset) as Activity[]) || [];
}

/**
 * Get all activities for a deal
 * @param dealId Deal ID
 * @param limit Maximum number of results (default 100)
 * @param offset Pagination offset (default 0)
 * @returns Array of activities
 */
export function getActivitiesByDealId(
  dealId: string,
  limit: number = 100,
  offset: number = 0
): Activity[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM activities
    WHERE dealId = ? AND deletedAt IS NULL
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);

  return (stmt.all(dealId, limit, offset) as Activity[]) || [];
}

/**
 * Get activity count for a deal
 * @param dealId Deal ID
 * @returns Number of activities
 */
export function getActivityCountByDealId(dealId: string): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM activities
    WHERE dealId = ? AND deletedAt IS NULL
  `);

  const result = stmt.get(dealId) as { count: number };
  return result?.count || 0;
}

/**
 * Get activities by type (e.g., "call", "email", "meeting")
 * @param type Activity type
 * @param limit Maximum number of results (default 50)
 * @returns Array of activities
 */
export function getActivitiesByType(type: string, limit: number = 50): Activity[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM activities
    WHERE type = ? AND deletedAt IS NULL
    ORDER BY createdAt DESC
    LIMIT ?
  `);

  return (stmt.all(type, limit) as Activity[]) || [];
}

/**
 * Get activities by contact
 * @param contactId Contact ID
 * @param limit Maximum number of results (default 50)
 * @returns Array of activities
 */
export function getActivitiesByContactId(contactId: string, limit: number = 50): Activity[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM activities
    WHERE contactId = ? AND deletedAt IS NULL
    ORDER BY createdAt DESC
    LIMIT ?
  `);

  return (stmt.all(contactId, limit) as Activity[]) || [];
}

/**
 * Get recent activities (last N days)
 * @param days Number of days to look back (default 7)
 * @param limit Maximum number of results (default 50)
 * @returns Array of activities
 */
export function getRecentActivities(days: number = 7, limit: number = 50): Activity[] {
  const db = getDatabase();
  const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const stmt = db.prepare(`
    SELECT * FROM activities
    WHERE deletedAt IS NULL AND createdAt >= ?
    ORDER BY createdAt DESC
    LIMIT ?
  `);

  return (stmt.all(sinceDate, limit) as Activity[]) || [];
}

/**
 * Search activities by subject or notes
 * @param query Search query
 * @param limit Maximum number of results (default 50)
 * @returns Array of matching activities
 */
export function searchActivities(query: string, limit: number = 50): Activity[] {
  const db = getDatabase();
  const searchTerm = `%${query}%`;
  const stmt = db.prepare(`
    SELECT * FROM activities
    WHERE deletedAt IS NULL AND (
      subject LIKE ? OR notes LIKE ?
    )
    ORDER BY createdAt DESC
    LIMIT ?
  `);

  return (stmt.all(searchTerm, searchTerm, limit) as Activity[]) || [];
}
