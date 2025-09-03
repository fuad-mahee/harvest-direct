import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get approved events (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const eventType = searchParams.get('eventType');
    const search = searchParams.get('search');
    const upcoming = searchParams.get('upcoming');

    // Build where clause
    const where: any = {
      status: 'APPROVED'
    };

    if (category) {
      where.category = category;
    }

    if (eventType) {
      where.eventType = eventType;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (upcoming === 'true') {
      where.date = {
        gte: new Date()
      };
    }

    // Get approved events
    const events = await prisma.event.findMany({
      where,
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
                certificationBadge: true
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
      },
      orderBy: { date: 'asc' }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching public events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
