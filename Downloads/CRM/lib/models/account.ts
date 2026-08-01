/**
 * Account Model
 * CRUD operations for accounts (companies/organizations)
 */

import { nanoid } from 'nanoid';
import { getDatabase, transaction } from '../db/migrations';

/**
 * Account interface
 */
export interface Account {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  parentAccountId?: string;
  foundedYear?: number;
  employeeCount?: number;
  annualRevenue?: number;
  notes?: string;
  lastContactDate?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * Input type for creating accounts
 */
export interface CreateAccountInput {
  name: string;
  industry?: string;
  website?: string;
  parentAccountId?: string;
  foundedYear?: number;
  employeeCount?: number;
  annualRevenue?: number;
  notes?: string;
}

/**
 * Input type for updating accounts
 */
export interface UpdateAccountInput {
  name?: string;
  industry?: string;
  website?: string;
  parentAccountId?: string;
  foundedYear?: number;
  employeeCount?: number;
  annualRevenue?: number;
  notes?: string;
  lastContactDate?: string;
}

/**
 * Create a new account
 * @param input Account creation data
 * @returns Created account
 */
export function createAccount(input: CreateAccountInput): Account {
  return transaction((db) => {
    const id = nanoid();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO accounts (
        id, name, industry, website, parentAccountId, foundedYear,
        employeeCount, annualRevenue, notes, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      input.name,
      input.industry || null,
      input.website || null,
      input.parentAccountId || null,
      input.foundedYear || null,
      input.employeeCount || null,
      input.annualRevenue || null,
      input.notes || null,
      now,
      now
    );

    return getAccount(id) as Account;
  });
}

/**
 * Get an account by ID
 * Returns null if account not found or is soft-deleted
 * @param accountId Account ID
 * @returns Account or null
 */
export function getAccount(accountId: string): Account | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM accounts WHERE id = ? AND deletedAt IS NULL
  `);

  return (stmt.get(accountId) as Account) || null;
}

/**
 * Update an account
 * @param accountId Account ID
 * @param input Update data
 * @returns Updated account
 */
export function updateAccount(accountId: string, input: UpdateAccountInput): Account {
  return transaction((db) => {
    const account = getAccount(accountId);
    if (!account) {
      throw new Error(`Account not found: ${accountId}`);
    }

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      updates.push('name = ?');
      values.push(input.name);
    }
    if (input.industry !== undefined) {
      updates.push('industry = ?');
      values.push(input.industry || null);
    }
    if (input.website !== undefined) {
      updates.push('website = ?');
      values.push(input.website || null);
    }
    if (input.parentAccountId !== undefined) {
      updates.push('parentAccountId = ?');
      values.push(input.parentAccountId || null);
    }
    if (input.foundedYear !== undefined) {
      updates.push('foundedYear = ?');
      values.push(input.foundedYear || null);
    }
    if (input.employeeCount !== undefined) {
      updates.push('employeeCount = ?');
      values.push(input.employeeCount || null);
    }
    if (input.annualRevenue !== undefined) {
      updates.push('annualRevenue = ?');
      values.push(input.annualRevenue || null);
    }
    if (input.notes !== undefined) {
      updates.push('notes = ?');
      values.push(input.notes || null);
    }
    if (input.lastContactDate !== undefined) {
      updates.push('lastContactDate = ?');
      values.push(input.lastContactDate || null);
    }

    if (updates.length === 0) {
      return account;
    }

    updates.push('updatedAt = ?');
    values.push(now);
    values.push(accountId);

    const stmt = db.prepare(`
      UPDATE accounts SET ${updates.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);

    return getAccount(accountId) as Account;
  });
}

/**
 * Delete an account (soft delete)
 * Sets deletedAt timestamp, doesn't remove from database
 * @param accountId Account ID
 */
export function deleteAccount(accountId: string): void {
  transaction((db) => {
    const account = getAccount(accountId);
    if (!account) {
      throw new Error(`Account not found: ${accountId}`);
    }

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE accounts SET deletedAt = ?, updatedAt = ? WHERE id = ?
    `);

    stmt.run(now, now, accountId);
  });
}

/**
 * List all active (non-deleted) accounts
 * @param limit Maximum number of results (default 100)
 * @param offset Pagination offset (default 0)
 * @returns Array of accounts
 */
export function listAccounts(limit: number = 100, offset: number = 0): Account[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM accounts
    WHERE deletedAt IS NULL
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);

  return (stmt.all(limit, offset) as Account[]) || [];
}

/**
 * Find an account by name
 * @param name Account name
 * @returns Account or null
 */
export function findAccountByName(name: string): Account | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM accounts WHERE name = ? AND deletedAt IS NULL
  `);

  return (stmt.get(name) as Account) || null;
}

/**
 * Get account hierarchy (parent and child accounts)
 * @param accountId Account ID
 * @returns Object with parent account and child accounts
 */
export function getAccountHierarchy(accountId: string): {
  account: Account | null;
  parent: Account | null;
  children: Account[];
} {
  const account = getAccount(accountId);

  let parent = null;
  if (account?.parentAccountId) {
    parent = getAccount(account.parentAccountId);
  }

  const db = getDatabase();
  const childStmt = db.prepare(`
    SELECT * FROM accounts
    WHERE parentAccountId = ? AND deletedAt IS NULL
    ORDER BY name
  `);
  const children = (childStmt.all(accountId) as Account[]) || [];

  return { account, parent, children };
}

/**
 * Find similar accounts by name (for duplicate detection)
 * @param name Account name
 * @param limit Maximum number of results (default 5)
 * @returns Array of similar accounts
 */
export function findSimilarAccounts(name: string, limit: number = 5): Account[] {
  const db = getDatabase();
  const searchTerm = `%${name}%`;
  const stmt = db.prepare(`
    SELECT * FROM accounts
    WHERE deletedAt IS NULL AND name LIKE ?
    ORDER BY name
    LIMIT ?
  `);

  return (stmt.all(searchTerm, limit) as Account[]) || [];
}

/**
 * Get account count
 * @returns Total number of active accounts
 */
export function getAccountCount(): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM accounts WHERE deletedAt IS NULL
  `);

  const result = stmt.get() as { count: number };
  return result?.count || 0;
}

/**
 * Search accounts by name or industry
 * @param query Search query
 * @param limit Maximum number of results (default 50)
 * @returns Array of matching accounts
 */
export function searchAccounts(query: string, limit: number = 50): Account[] {
  const db = getDatabase();
  const searchTerm = `%${query}%`;
  const stmt = db.prepare(`
    SELECT * FROM accounts
    WHERE deletedAt IS NULL AND (
      name LIKE ? OR industry LIKE ? OR website LIKE ?
    )
    ORDER BY name
    LIMIT ?
  `);

  return (stmt.all(searchTerm, searchTerm, searchTerm, limit) as Account[]) || [];
}
