import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get events for farmer (their own events)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId');

    if (!farmerId) {
      return NextResponse.json({ error: 'Farmer ID is required' }, { status: 400 });
    }

    // Verify user is a farmer
    const user = await prisma.user.findUnique({
      where: { id: farmerId },
    });

    if (!user || user.role !== 'FARMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get farmer's events
    const events = await prisma.event.findMany({
      where: { organizerId: farmerId },
      include: {
        organizer: {
          select: { id: true, name: true, email: true }
        },
        attendees: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        _count: {
          select: { attendees: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching farmer events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create new event
export async function POST(request: NextRequest) {
  try {
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

    // Verify user is a farmer
    const user = await prisma.user.findUnique({
      where: { id: farmerId },
    });

    if (!user || user.role !== 'FARMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Validate required fields
    if (!title || !description || !location || !date || !eventType || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        duration,
        maxAttendees,
        eventType,
        category,
        tags: tags || [],
        imageUrl,
        organizerId: farmerId,
        status: 'PENDING'
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
