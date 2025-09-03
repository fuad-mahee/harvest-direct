import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Approve or reject event
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const body = await request.json();
    const { status, adminNotes, adminId } = body;

    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
    }

    // Verify user is an admin
    const user = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Validate status
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Update event status
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        status: status as any,
        adminNotes: adminNotes || null,
        approvedBy: status === 'APPROVED' ? adminId : null,
        approvedAt: status === 'APPROVED' ? new Date() : null,
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
                farmAddress: true
              }
            }
          }
        },
        _count: {
          select: { attendees: true }
        }
      }
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete event (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
    }

    // Verify user is an admin
    const user = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
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
