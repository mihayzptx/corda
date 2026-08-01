/**
 * Contact Model
 * CRUD operations for contacts
 */

import { nanoid } from 'nanoid';
import { getDatabase, transaction } from '../db/migrations';

/**
 * Contact interface
 */
export interface Contact {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  title?: string;
  notes?: string;
  lastContactDate?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * Input type for creating contacts (without system fields)
 */
export interface CreateContactInput {
  accountId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  title?: string;
  notes?: string;
}

/**
 * Input type for updating contacts
 */
export interface UpdateContactInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  title?: string;
  notes?: string;
  lastContactDate?: string;
}

/**
 * Create a new contact
 * @param input Contact creation data
 * @returns Created contact
 */
export function createContact(input: CreateContactInput): Contact {
  return transaction((db) => {
    const id = nanoid();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO contacts (
        id, accountId, firstName, lastName, email, phone, role, title, notes, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      input.accountId,
      input.firstName,
      input.lastName,
      input.email || null,
      input.phone || null,
      input.role || null,
      input.title || null,
      input.notes || null,
      now,
      now
    );

    return getContact(id) as Contact;
  });
}

/**
 * Get a contact by ID
 * Returns null if contact not found or is soft-deleted
 * @param contactId Contact ID
 * @returns Contact or null
 */
export function getContact(contactId: string): Contact | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM contacts WHERE id = ? AND deletedAt IS NULL
  `);

  return (stmt.get(contactId) as Contact) || null;
}

/**
 * Update a contact
 * @param contactId Contact ID
 * @param input Update data
 * @returns Updated contact
 */
export function updateContact(contactId: string, input: UpdateContactInput): Contact {
  return transaction((db) => {
    const contact = getContact(contactId);
    if (!contact) {
      throw new Error(`Contact not found: ${contactId}`);
    }

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (input.firstName !== undefined) {
      updates.push('firstName = ?');
      values.push(input.firstName);
    }
    if (input.lastName !== undefined) {
      updates.push('lastName = ?');
      values.push(input.lastName);
    }
    if (input.email !== undefined) {
      updates.push('email = ?');
      values.push(input.email || null);
    }
    if (input.phone !== undefined) {
      updates.push('phone = ?');
      values.push(input.phone || null);
    }
    if (input.role !== undefined) {
      updates.push('role = ?');
      values.push(input.role || null);
    }
    if (input.title !== undefined) {
      updates.push('title = ?');
      values.push(input.title || null);
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
      return contact;
    }

    updates.push('updatedAt = ?');
    values.push(now);
    values.push(contactId);

    const stmt = db.prepare(`
      UPDATE contacts SET ${updates.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);

    return getContact(contactId) as Contact;
  });
}

/**
 * Delete a contact (soft delete)
 * Sets deletedAt timestamp, doesn't remove from database
 * @param contactId Contact ID
 */
export function deleteContact(contactId: string): void {
  transaction((db) => {
    const contact = getContact(contactId);
    if (!contact) {
      throw new Error(`Contact not found: ${contactId}`);
    }

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE contacts SET deletedAt = ?, updatedAt = ? WHERE id = ?
    `);

    stmt.run(now, now, contactId);
  });
}

/**
 * List all active (non-deleted) contacts
 * @param limit Maximum number of results (default 100)
 * @param offset Pagination offset (default 0)
 * @returns Array of contacts
 */
export function listContacts(limit: number = 100, offset: number = 0): Contact[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM contacts
    WHERE deletedAt IS NULL
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);

  return (stmt.all(limit, offset) as Contact[]) || [];
}

/**
 * Find a contact by email
 * @param email Contact email
 * @returns Contact or null
 */
export function findContactByEmail(email: string): Contact | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM contacts WHERE email = ? AND deletedAt IS NULL
  `);

  return (stmt.get(email) as Contact) || null;
}

/**
 * Find all contacts belonging to an account
 * @param accountId Account ID
 * @param limit Maximum number of results (default 100)
 * @param offset Pagination offset (default 0)
 * @returns Array of contacts
 */
export function findContactsByAccountId(
  accountId: string,
  limit: number = 100,
  offset: number = 0
): Contact[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM contacts
    WHERE accountId = ? AND deletedAt IS NULL
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);

  return (stmt.all(accountId, limit, offset) as Contact[]) || [];
}

/**
 * Get contact count for an account
 * @param accountId Account ID
 * @returns Number of active contacts
 */
export function getContactCountByAccountId(accountId: string): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM contacts
    WHERE accountId = ? AND deletedAt IS NULL
  `);

  const result = stmt.get(accountId) as { count: number };
  return result?.count || 0;
}

/**
 * Search contacts by name
 * @param query Search query (matched against firstName and lastName)
 * @param limit Maximum number of results (default 50)
 * @returns Array of matching contacts
 */
export function searchContacts(query: string, limit: number = 50): Contact[] {
  const db = getDatabase();
  const searchTerm = `%${query}%`;
  const stmt = db.prepare(`
    SELECT * FROM contacts
    WHERE deletedAt IS NULL AND (
      firstName LIKE ? OR lastName LIKE ? OR email LIKE ?
    )
    ORDER BY firstName, lastName
    LIMIT ?
  `);

  return (stmt.all(searchTerm, searchTerm, searchTerm, limit) as Contact[]) || [];
}
