import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update event
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const body = await request.json();
    const {
      farmerId,
      title,
      description,
      location,
      date,
      duration,
      maxAttendees,
      eventType,
      category,
      tags,
      imageUrl
    } = body;

    if (!farmerId) {
      return NextResponse.json({ error: 'Farmer ID is required' }, { status: 400 });
    }

    // Verify user is a farmer and owns this event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.organizerId !== farmerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Only allow updates if event is pending or approved (not rejected)
    if (event.status === 'REJECTED') {
      return NextResponse.json({ error: 'Cannot update rejected event' }, { status: 400 });
    }

    // Update event (reset to pending if it was approved)
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        location,
        date: date ? new Date(date) : undefined,
        duration,
        maxAttendees,
        eventType,
        category,
        tags,
        imageUrl,
        status: 'PENDING', // Reset to pending after update
        adminNotes: null,
        approvedBy: null,
        approvedAt: null
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete event
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId');

    if (!farmerId) {
      return NextResponse.json({ error: 'Farmer ID is required' }, { status: 400 });
    }

    // Verify user is a farmer and owns this event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.organizerId !== farmerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete event
    await prisma.event.delete({
      where: { id: eventId }
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
