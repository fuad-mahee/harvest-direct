import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all events for admin management
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
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

    // Get events with optional status filter
    const events = await prisma.event.findMany({
      where: status ? { status: status as any } : undefined,
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
    console.error('Error fetching events for admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
