import { NextRequest, NextResponse } from 'next/server';
import {
  getContact,
  updateContact,
  deleteContact,
  type UpdateContactInput,
} from '@/lib/models/contact';

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * GET /api/contacts/[id]
 * Get a single contact by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const contact = getContact(id);

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    console.error('GET /api/contacts/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/contacts/[id]
 * Update a contact
 * Body: { firstName?, lastName?, email?, phone?, role?, title?, notes?, lastContactDate? }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      title,
      notes,
      lastContactDate,
    } = body;

    // Validate that contact exists
    const contact = getContact(id);
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Validate firstName if provided
    if (firstName !== undefined) {
      if (typeof firstName !== 'string' || firstName.trim() === '') {
        return NextResponse.json(
          { error: 'firstName must be a non-empty string' },
          { status: 400 }
        );
      }
    }

    // Validate lastName if provided
    if (lastName !== undefined) {
      if (typeof lastName !== 'string' || lastName.trim() === '') {
        return NextResponse.json(
          { error: 'lastName must be a non-empty string' },
          { status: 400 }
        );
      }
    }

    // Validate email if provided
    if (email !== undefined && email !== null && email !== '') {
      if (typeof email !== 'string') {
        return NextResponse.json(
          { error: 'email must be a string' },
          { status: 400 }
        );
      }
      if (!isValidEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Build update input object with only provided fields
    const input: UpdateContactInput = {};

    if (firstName !== undefined) {
      input.firstName = firstName.trim();
    }
    if (lastName !== undefined) {
      input.lastName = lastName.trim();
    }
    if (email !== undefined) {
      input.email = email ? email.trim() : '';
    }
    if (phone !== undefined) {
      input.phone = phone ? (phone as string).trim() : '';
    }
    if (role !== undefined) {
      input.role = role ? (role as string).trim() : '';
    }
    if (title !== undefined) {
      input.title = title ? (title as string).trim() : '';
    }
    if (notes !== undefined) {
      input.notes = notes ? (notes as string).trim() : '';
    }
    if (lastContactDate !== undefined) {
      input.lastContactDate = lastContactDate;
    }

    // Check if there's anything to update
    if (Object.keys(input).length === 0) {
      return NextResponse.json(contact, { status: 200 });
    }

    // Update the contact
    const updatedContact = updateContact(id, input);

    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    console.error('PUT /api/contacts/[id] error:', error);
    if (error instanceof Error && error.message.includes('Contact not found')) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contacts/[id]
 * Soft delete a contact
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    // Verify contact exists
    const contact = getContact(id);
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Soft delete the contact
    deleteContact(id);

    // Return 204 No Content (standard for successful DELETE)
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE /api/contacts/[id] error:', error);
    if (error instanceof Error && error.message.includes('Contact not found')) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
