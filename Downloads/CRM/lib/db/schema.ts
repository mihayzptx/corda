/**
 * Database Schema Definitions
 * Defines all SQL table structures for the CRM system
 */

export const schema = {
  /**
   * Contacts table
   * Stores individual contact information within accounts
   */
  contacts: `
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      accountId TEXT NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      role TEXT,
      title TEXT,
      notes TEXT,
      lastContactDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      deletedAt TEXT,
      FOREIGN KEY (accountId) REFERENCES accounts(id)
    );
  `,

  /**
   * Accounts table
   * Stores company/organization information
   */
  accounts: `
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      industry TEXT,
      website TEXT,
      parentAccountId TEXT,
      foundedYear INTEGER,
      employeeCount INTEGER,
      annualRevenue REAL,
      notes TEXT,
      lastContactDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      deletedAt TEXT,
      FOREIGN KEY (parentAccountId) REFERENCES accounts(id)
    );
  `,

  /**
   * Activities table
   * Tracks interactions with contacts/deals (calls, emails, meetings, etc.)
   */
  activities: `
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      dealId TEXT NOT NULL,
      contactId TEXT,
      type TEXT NOT NULL,
      subject TEXT NOT NULL,
      notes TEXT,
      outcome TEXT,
      duration INTEGER,
      createdBy TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      deletedAt TEXT,
      FOREIGN KEY (dealId) REFERENCES deals(id),
      FOREIGN KEY (contactId) REFERENCES contacts(id)
    );
  `,

  /**
   * Tasks table
   * Manages action items and follow-ups
   */
  tasks: `
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      dealId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT,
      assignedTo TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      completedAt TEXT,
      remindAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      deletedAt TEXT,
      FOREIGN KEY (dealId) REFERENCES deals(id)
    );
  `,

  /**
   * Deals table
   * Main sales opportunities (must already exist from prior work)
   * We will add source and lastActivityDate columns if they don't exist
   */
  deals: `
    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      accountId TEXT NOT NULL,
      contactId TEXT,
      title TEXT NOT NULL,
      value REAL,
      stage TEXT NOT NULL,
      source TEXT,
      probability INTEGER,
      expectedCloseDate TEXT,
      lastActivityDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      deletedAt TEXT,
      FOREIGN KEY (accountId) REFERENCES accounts(id),
      FOREIGN KEY (contactId) REFERENCES contacts(id)
    );
  `,

  // Index definitions for performance
  indices: [
    'CREATE INDEX IF NOT EXISTS idx_contacts_accountId ON contacts(accountId);',
    'CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);',
    'CREATE INDEX IF NOT EXISTS idx_contacts_deletedAt ON contacts(deletedAt);',
    'CREATE INDEX IF NOT EXISTS idx_accounts_deletedAt ON accounts(deletedAt);',
    'CREATE INDEX IF NOT EXISTS idx_activities_dealId ON activities(dealId);',
    'CREATE INDEX IF NOT EXISTS idx_activities_contactId ON activities(contactId);',
    'CREATE INDEX IF NOT EXISTS idx_activities_deletedAt ON activities(deletedAt);',
    'CREATE INDEX IF NOT EXISTS idx_tasks_dealId ON tasks(dealId);',
    'CREATE INDEX IF NOT EXISTS idx_tasks_assignedTo ON tasks(assignedTo);',
    'CREATE INDEX IF NOT EXISTS idx_tasks_deletedAt ON tasks(deletedAt);',
    'CREATE INDEX IF NOT EXISTS idx_deals_accountId ON deals(accountId);',
    'CREATE INDEX IF NOT EXISTS idx_deals_contactId ON deals(contactId);',
    'CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);',
    'CREATE INDEX IF NOT EXISTS idx_deals_deletedAt ON deals(deletedAt);',
  ],
};

export const tables = [
  'contacts',
  'accounts',
  'activities',
  'tasks',
  'deals',
];
