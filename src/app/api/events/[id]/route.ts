import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get single event details
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;

    // Get event details (only approved events for public access)
    const event = await prisma.event.findFirst({
      where: { 
        id: eventId,
        status: 'APPROVED'
      },
      include: {
        organizer: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            farmerProfile: {
              select: {
                farmName: true,
                farmAddress: true,
                certificationBadge: true,
                aboutFarm: true,
                specialization: true
              }
            }
          }
        },
        attendees: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          }
        },
        _count: {
          select: { attendees: true }
        }
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found or not approved' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Register for event
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { userId } = body;
    const eventId = params.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if event exists and is approved
    const event = await prisma.event.findFirst({
      where: { 
        id: eventId,
        status: 'APPROVED'
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found or not available for registration' }, { status: 404 });
    }

    // Check if event is full
    const currentAttendees = await prisma.eventAttendee.count({
      where: { eventId: eventId }
    });

    if (event.maxAttendees && currentAttendees >= event.maxAttendees) {
      return NextResponse.json({ error: 'Event is full' }, { status: 400 });
    }

    // Check if user is already registered
    const existingRegistration = await prisma.eventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      }
    });

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered for this event' }, { status: 400 });
    }

    // Register user for event
    const registration = await prisma.eventAttendee.create({
      data: {
        eventId: eventId,
        userId: userId,
        status: 'REGISTERED'
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        event: {
          select: { title: true, date: true, location: true }
        }
      }
    });

    // Update current attendees count
    await prisma.event.update({
      where: { id: eventId },
      data: {
        currentAttendees: currentAttendees + 1
      }
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error('Error registering for event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Unregister from event
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const eventId = params.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if user is registered for this event
    const existingRegistration = await prisma.eventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      }
    });

    if (!existingRegistration) {
      return NextResponse.json({ error: 'Not registered for this event' }, { status: 400 });
    }

    // Remove registration
    await prisma.eventAttendee.delete({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      }
    });

    // Update current attendees count
    const currentAttendees = await prisma.eventAttendee.count({
      where: { eventId: eventId }
    });

    await prisma.event.update({
      where: { id: eventId },
      data: {
        currentAttendees: currentAttendees
      }
    });

    return NextResponse.json({ message: 'Successfully unregistered from event' });
  } catch (error) {
    console.error('Error unregistering from event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
