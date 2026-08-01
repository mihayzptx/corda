/**
 * Database and Models Export Index
 * Central export point for all database operations and models
 */

// Database initialization
export {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  transaction,
} from './migrations';

// Schema
export { schema, tables } from './schema';

// Contact model
export type {
  Contact,
  CreateContactInput,
  UpdateContactInput,
} from '../models/contact';
export {
  createContact,
  getContact,
  updateContact,
  deleteContact,
  listContacts,
  findContactByEmail,
  findContactsByAccountId,
  getContactCountByAccountId,
  searchContacts,
} from '../models/contact';

// Account model
export type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
} from '../models/account';
export {
  createAccount,
  getAccount,
  updateAccount,
  deleteAccount,
  listAccounts,
  findAccountByName,
  getAccountHierarchy,
  findSimilarAccounts,
  getAccountCount,
  searchAccounts,
} from '../models/account';

// Activity model
export type {
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
} from '../models/activity';
export {
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity,
  listActivities,
  getActivitiesByDealId,
  getActivityCountByDealId,
  getActivitiesByType,
  getActivitiesByContactId,
  getRecentActivities,
  searchActivities,
} from '../models/activity';

// Task model
export type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
} from '../models/task';
export {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  listTasks,
  getTasksByDealId,
  getTaskCountByDealId,
  getTasksAssignedTo,
  getOverdueTasks,
  getTasksByStatus,
  completeTask,
  getUpcomingTasks,
  searchTasks,
} from '../models/task';

// Deal model
export type {
  Deal,
  CreateDealInput,
  UpdateDealInput,
} from '../models/deal';
export {
  createDeal,
  getDeal,
  updateDeal,
  deleteDeal,
  listDeals,
  getDealsByAccountId,
  getDealCountByAccountId,
  getDealsByStage,
  getDealsBySource,
  updateDealSource,
  getDealLastActivityDate,
  getTotalDealValueByAccountId,
  getAverageDealValue,
  searchDeals,
} from '../models/deal';
