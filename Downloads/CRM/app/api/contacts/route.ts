import { NextRequest, NextResponse } from 'next/server';
import {
  createContact,
  listContacts,
  findContactsByAccountId,
  type CreateContactInput,
  type Contact,
} from '@/lib/models/contact';

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * GET /api/contacts
 * List all contacts with optional account filter and pagination
 * Query parameters:
 *   - accountId: filter by account (optional)
 *   - limit: number of results (default 10, max 100)
 *   - offset: pagination offset (default 0)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');
    const limitStr = searchParams.get('limit') || '10';
    const offsetStr = searchParams.get('offset') || '0';

    // Parse and validate pagination parameters
    let limit = parseInt(limitStr, 10);
    let offset = parseInt(offsetStr, 10);

    if (isNaN(limit) || limit < 1) limit = 10;
    if (isNaN(offset) || offset < 0) offset = 0;
    if (limit > 100) limit = 100; // Cap at 100

    // Fetch contacts
    let contacts: Contact[];
    if (accountId) {
      contacts = findContactsByAccountId(accountId, limit, offset);
    } else {
      contacts = listContacts(limit, offset);
    }

    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.error('GET /api/contacts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contacts
 * Create a new contact
 * Body: { accountId, firstName, lastName, email?, phone?, role?, title?, notes? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, firstName, lastName, email, phone, role, title, notes } = body;

    // Validate required fields
    if (!accountId || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: accountId, firstName, lastName' },
        { status: 400 }
      );
    }

    // Validate firstName and lastName are non-empty strings
    if (typeof firstName !== 'string' || firstName.trim() === '') {
      return NextResponse.json(
        { error: 'firstName must be a non-empty string' },
        { status: 400 }
      );
    }

    if (typeof lastName !== 'string' || lastName.trim() === '') {
      return NextResponse.json(
        { error: 'lastName must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (email && typeof email === 'string' && email.trim() !== '') {
      if (!isValidEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Create the contact
    const input: CreateContactInput = {
      accountId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ...(email && { email: email.trim() }),
      ...(phone && { phone: phone.trim() }),
      ...(role && { role: role.trim() }),
      ...(title && { title: title.trim() }),
      ...(notes && { notes: notes.trim() }),
    };

    const contact = createContact(input);

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('POST /api/contacts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
