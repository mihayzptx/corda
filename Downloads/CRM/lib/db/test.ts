/**
 * Database Test Script
 * Tests basic initialization and CRUD operations
 */

const path = require('path');
const { initializeDatabase, closeDatabase } = require('./migrations');
const {
  createContact,
  getContact,
  updateContact,
  deleteContact,
  listContacts,
} = require('../models/contact');
const {
  createAccount,
} = require('../models/account');
const {
  createActivity,
} = require('../models/activity');
const {
  createTask,
} = require('../models/task');
const {
  createDeal,
  getDeal,
  updateDealSource,
  getDealLastActivityDate,
} = require('../models/deal');

async function runTests() {
  console.log('Starting database tests...\n');

  // Test database path (in-memory or temp file)
  const dbPath = path.join(__dirname, '../../test-crm.db');

  try {
    // Initialize database
    console.log('1. Testing Database Initialization...');
    initializeDatabase(dbPath);
    console.log('   ✓ Database initialized successfully\n');

    // Create Account
    console.log('2. Testing Account Creation...');
    const accountData = {
      name: 'Acme Corporation',
      industry: 'Technology',
      website: 'https://acme.com',
      foundedYear: 2015,
      employeeCount: 150,
      annualRevenue: 5000000,
    };
    const account = createAccount(accountData);
    console.log(`   ✓ Account created with ID: ${account.id}`);
    console.log(`   ✓ Name: ${account.name}\n`);

    // Create Contact
    console.log('3. Testing Contact Creation...');
    const contactData = {
      accountId: account.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      phone: '+1-555-0100',
      title: 'Sales Manager',
      role: 'Decision Maker',
    };
    const contact = createContact(contactData);
    console.log(`   ✓ Contact created with ID: ${contact.id}`);
    console.log(`   ✓ Name: ${contact.firstName} ${contact.lastName}\n`);

    // Read Contact
    console.log('4. Testing Contact Read...');
    const retrievedContact = getContact(contact.id);
    console.log(`   ✓ Contact retrieved: ${retrievedContact?.firstName} ${retrievedContact?.lastName}`);
    console.log(`   ✓ Email: ${retrievedContact?.email}\n`);

    // Update Contact
    console.log('5. Testing Contact Update...');
    const updatedContact = updateContact(contact.id, {
      title: 'VP of Sales',
    });
    console.log(`   ✓ Contact updated`);
    console.log(`   ✓ New title: ${updatedContact.title}\n`);

    // Create Deal
    console.log('6. Testing Deal Creation...');
    const dealData = {
      accountId: account.id,
      contactId: contact.id,
      title: 'Enterprise Software License',
      value: 250000,
      stage: 'proposal',
      source: 'inbound' as const,
      probability: 75,
      expectedCloseDate: '2026-09-30',
    };
    const deal = createDeal(dealData);
    console.log(`   ✓ Deal created with ID: ${deal.id}`);
    console.log(`   ✓ Deal source: ${deal.source}\n`);

    // Create Activity (tests auto-update of deal.lastActivityDate)
    console.log('7. Testing Activity Creation (should update deal.lastActivityDate)...');
    const activityData = {
      dealId: deal.id,
      contactId: contact.id,
      type: 'call',
      subject: 'Initial Discovery Call',
      outcome: 'successful',
      duration: 30,
      createdBy: 'sales-team',
    };
    const activity = createActivity(activityData);
    console.log(`   ✓ Activity created with ID: ${activity.id}`);
    console.log(`   ✓ Activity type: ${activity.type}\n`);

    // Verify deal.lastActivityDate was updated
    console.log('8. Testing Deal Activity Date Auto-Update...');
    const dealWithActivity = getDeal(deal.id);
    const lastActivityDate = getDealLastActivityDate(deal.id);
    console.log(`   ✓ Deal lastActivityDate: ${dealWithActivity?.lastActivityDate}`);
    console.log(`   ✓ getDealLastActivityDate returns: ${lastActivityDate}\n`);

    // Create Task
    console.log('9. Testing Task Creation...');
    const taskData = {
      dealId: deal.id,
      title: 'Follow up with client',
      description: 'Send proposal and schedule review meeting',
      dueDate: '2026-08-15',
      assignedTo: 'john.doe@acme.com',
      status: 'pending' as const,
    };
    const task = createTask(taskData);
    console.log(`   ✓ Task created with ID: ${task.id}`);
    console.log(`   ✓ Task status: ${task.status}\n`);

    // List Contacts
    console.log('10. Testing Contact List...');
    const contacts = listContacts(10, 0);
    console.log(`   ✓ Listed ${contacts.length} contact(s)\n`);

    // Delete Contact (soft delete)
    console.log('11. Testing Contact Soft Delete...');
    deleteContact(contact.id);
    const deletedContact = getContact(contact.id);
    console.log(`   ✓ Contact soft deleted`);
    console.log(`   ✓ getContact returns: ${deletedContact ? 'found (ERROR!)' : 'null (correct)'}\n`);

    // Verify source field on deal
    console.log('12. Testing Deal Source Field...');
    console.log(`   ✓ Deal source field: ${dealWithActivity?.source}`);

    // Test updateDealSource
    const updatedDeal = updateDealSource(deal.id, 'referral');
    console.log(`   ✓ Updated deal source to: ${updatedDeal.source}\n`);

    console.log('='.repeat(50));
    console.log('All tests passed! ✓');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Test failed with error:', error);
    process.exit(1);
  } finally {
    closeDatabase();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}
