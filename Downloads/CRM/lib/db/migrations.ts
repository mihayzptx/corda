/**
 * Database Migrations and Initialization
 * Handles database setup and schema creation
 */

import type { Database as DatabaseType } from 'better-sqlite3';
const Database = require('better-sqlite3');
import { schema } from './schema';

let dbInstance: DatabaseType | null = null;

/**
 * Get or create database connection
 * Singleton pattern to ensure only one database instance
 */
export function getDatabase(): DatabaseType {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dbInstance;
}

/**
 * Initialize the database
 * Creates all tables, indexes, and enables foreign key constraints
 * @param dbPath - Path to the SQLite database file
 */
export function initializeDatabase(dbPath: string): DatabaseType {
  if (dbInstance) {
    return dbInstance;
  }

  // Create database connection
  dbInstance = new Database(dbPath);

  try {
    // Enable foreign key constraints
    dbInstance!.pragma('foreign_keys = ON');

    // Enable WAL mode for better concurrency
    dbInstance!.pragma('journal_mode = WAL');

    // Create all tables
    dbInstance!.exec(schema.contacts);
    dbInstance!.exec(schema.accounts);
    dbInstance!.exec(schema.deals);
    dbInstance!.exec(schema.activities);
    dbInstance!.exec(schema.tasks);

    // Create indexes
    schema.indices.forEach((indexSql) => {
      dbInstance!.exec(indexSql);
    });

    // Ensure deals table has source and lastActivityDate columns
    ensureDealColumns(dbInstance!);

    return dbInstance!;
  } catch (error) {
    if (dbInstance) {
      dbInstance.close();
      dbInstance = null;
    }
    throw error;
  }
}

/**
 * Ensure deals table has source and lastActivityDate columns
 * These are added if they don't already exist
 */
function ensureDealColumns(db: DatabaseType): void {
  try {
    const tableInfo = db.prepare("PRAGMA table_info(deals)").all() as any[];
    const columns = tableInfo.map((col) => col.name);

    const needsSource = !columns.includes('source');
    const needsLastActivityDate = !columns.includes('lastActivityDate');

    if (needsSource) {
      db.exec("ALTER TABLE deals ADD COLUMN source TEXT;");
    }

    if (needsLastActivityDate) {
      db.exec("ALTER TABLE deals ADD COLUMN lastActivityDate TEXT;");
    }
  } catch (error) {
    // Column might already exist or other schema issues
    // This is handled gracefully
    console.warn('Note: Could not add columns to deals table:', error);
  }
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

/**
 * Run a function within a database transaction
 * Ensures atomicity - either all changes are committed or all are rolled back
 * @param fn - Function to run within transaction
 * @returns Result of the function
 */
export function transaction<T>(fn: (db: DatabaseType) => T): T {
  const db = getDatabase();
  const tx = db.transaction(fn);
  return tx(db);
}
