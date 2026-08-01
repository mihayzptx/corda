/**
 * Deal Model
 * CRUD operations for sales deals/opportunities
 */

import { nanoid } from 'nanoid';
import { getDatabase, transaction } from '../db/migrations';

/**
 * Deal interface
 */
export interface Deal {
  id: string;
  accountId: string;
  contactId?: string;
  title: string;
  value?: number;
  stage: string;
  source?: 'inbound' | 'outbound' | 'referral' | 'partner';
  probability?: number;
  expectedCloseDate?: string;
  lastActivityDate?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * Input type for creating deals
 */
export interface CreateDealInput {
  accountId: string;
  contactId?: string;
  title: string;
  value?: number;
  stage: string;
  source?: 'inbound' | 'outbound' | 'referral' | 'partner';
  probability?: number;
  expectedCloseDate?: string;
}

/**
 * Input type for updating deals
 */
export interface UpdateDealInput {
  title?: string;
  value?: number;
  stage?: string;
  source?: 'inbound' | 'outbound' | 'referral' | 'partner';
  probability?: number;
  expectedCloseDate?: string;
  lastActivityDate?: string;
}

/**
 * Create a new deal
 * @param input Deal creation data
 * @returns Created deal
 */
export function createDeal(input: CreateDealInput): Deal {
  return transaction((db) => {
    const id = nanoid();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO deals (
        id, accountId, contactId, title, value, stage, source, probability,
        expectedCloseDate, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      input.accountId,
      input.contactId || null,
      input.title,
      input.value || null,
      input.stage,
      input.source || null,
      input.probability || null,
      input.expectedCloseDate || null,
      now,
      now
    );

    return getDeal(id) as Deal;
  });
}

/**
 * Get a deal by ID
 * Returns null if deal not found or is soft-deleted
 * @param dealId Deal ID
 * @returns Deal or null
 */
export function getDeal(dealId: string): Deal | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM deals WHERE id = ? AND deletedAt IS NULL
  `);

  return (stmt.get(dealId) as Deal) || null;
}

/**
 * Update a deal
 * @param dealId Deal ID
 * @param input Update data
 * @returns Updated deal
 */
export function updateDeal(dealId: string, input: UpdateDealInput): Deal {
  return transaction((db) => {
    const deal = getDeal(dealId);
    if (!deal) {
      throw new Error(`Deal not found: ${dealId}`);
    }

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (input.title !== undefined) {
      updates.push('title = ?');
      values.push(input.title);
    }
    if (input.value !== undefined) {
      updates.push('value = ?');
      values.push(input.value || null);
    }
    if (input.stage !== undefined) {
      updates.push('stage = ?');
      values.push(input.stage);
    }
    if (input.source !== undefined) {
      updates.push('source = ?');
      values.push(input.source || null);
    }
    if (input.probability !== undefined) {
      updates.push('probability = ?');
      values.push(input.probability || null);
    }
    if (input.expectedCloseDate !== undefined) {
      updates.push('expectedCloseDate = ?');
      values.push(input.expectedCloseDate || null);
    }
    if (input.lastActivityDate !== undefined) {
      updates.push('lastActivityDate = ?');
      values.push(input.lastActivityDate || null);
    }

    if (updates.length === 0) {
      return deal;
    }

    updates.push('updatedAt = ?');
    values.push(now);
    values.push(dealId);

    const stmt = db.prepare(`
      UPDATE deals SET ${updates.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);

    return getDeal(dealId) as Deal;
  });
}

/**
 * Delete a deal (soft delete)
 * Sets deletedAt timestamp, doesn't remove from database
 * @param dealId Deal ID
 */
export function deleteDeal(dealId: string): void {
  transaction((db) => {
    const deal = getDeal(dealId);
    if (!deal) {
      throw new Error(`Deal not found: ${dealId}`);
    }

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE deals SET deletedAt = ?, updatedAt = ? WHERE id = ?
    `);

    stmt.run(now, now, dealId);
  });
}

/**
 * List all active (non-deleted) deals
 * @param limit Maximum number of results (default 100)
 * @param offset Pagination offset (default 0)
 * @returns Array of deals
 */
export function listDeals(limit: number = 100, offset: number = 0): Deal[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM deals
    WHERE deletedAt IS NULL
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);

  return (stmt.all(limit, offset) as Deal[]) || [];
}

/**
 * Get all deals for an account
 * @param accountId Account ID
 * @param limit Maximum number of results (default 100)
 * @param offset Pagination offset (default 0)
 * @returns Array of deals
 */
export function getDealsByAccountId(
  accountId: string,
  limit: number = 100,
  offset: number = 0
): Deal[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM deals
    WHERE accountId = ? AND deletedAt IS NULL
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);

  return (stmt.all(accountId, limit, offset) as Deal[]) || [];
}

/**
 * Get deal count for an account
 * @param accountId Account ID
 * @returns Number of deals
 */
export function getDealCountByAccountId(accountId: string): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM deals
    WHERE accountId = ? AND deletedAt IS NULL
  `);

  const result = stmt.get(accountId) as { count: number };
  return result?.count || 0;
}

/**
 * Get deals by stage
 * @param stage Deal stage (e.g., "lead", "qualified", "proposal", "won")
 * @param limit Maximum number of results (default 100)
 * @returns Array of deals
 */
export function getDealsByStage(stage: string, limit: number = 100): Deal[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM deals
    WHERE stage = ? AND deletedAt IS NULL
    ORDER BY createdAt DESC
    LIMIT ?
  `);

  return (stmt.all(stage, limit) as Deal[]) || [];
}

/**
 * Get deals by source
 * @param source Deal source (inbound, outbound, referral, partner)
 * @param limit Maximum number of results (default 100)
 * @returns Array of deals
 */
export function getDealsBySource(
  source: 'inbound' | 'outbound' | 'referral' | 'partner',
  limit: number = 100
): Deal[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM deals
    WHERE source = ? AND deletedAt IS NULL
    ORDER BY createdAt DESC
    LIMIT ?
  `);

  return (stmt.all(source, limit) as Deal[]) || [];
}

/**
 * Update deal source
 * @param dealId Deal ID
 * @param source Deal source
 * @returns Updated deal
 */
export function updateDealSource(
  dealId: string,
  source: 'inbound' | 'outbound' | 'referral' | 'partner'
): Deal {
  return updateDeal(dealId, { source });
}

/**
 * Get deal's last activity date
 * @param dealId Deal ID
 * @returns Last activity date or null
 */
export function getDealLastActivityDate(dealId: string): string | null {
  const deal = getDeal(dealId);
  return deal?.lastActivityDate || null;
}

/**
 * Get total deal value for an account
 * @param accountId Account ID
 * @returns Total value of all deals in specific stage or all stages
 */
export function getTotalDealValueByAccountId(accountId: string): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT SUM(value) as total FROM deals
    WHERE accountId = ? AND deletedAt IS NULL
  `);

  const result = stmt.get(accountId) as { total: number | null };
  return result?.total || 0;
}

/**
 * Get average deal value
 * @returns Average value of all active deals
 */
export function getAverageDealValue(): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT AVG(value) as avg FROM deals
    WHERE deletedAt IS NULL AND value IS NOT NULL
  `);

  const result = stmt.get() as { avg: number | null };
  return result?.avg || 0;
}

/**
 * Search deals by title
 * @param query Search query
 * @param limit Maximum number of results (default 50)
 * @returns Array of matching deals
 */
export function searchDeals(query: string, limit: number = 50): Deal[] {
  const db = getDatabase();
  const searchTerm = `%${query}%`;
  const stmt = db.prepare(`
    SELECT * FROM deals
    WHERE deletedAt IS NULL AND title LIKE ?
    ORDER BY createdAt DESC
    LIMIT ?
  `);

  return (stmt.all(searchTerm, limit) as Deal[]) || [];
}
