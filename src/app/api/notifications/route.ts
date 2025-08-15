import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get user's notifications
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { read: false })
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        read: false
      }
    });

    return NextResponse.json({ 
      success: true, 
      notifications,
      unreadCount 
    });
    
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// PUT - Mark notification as read
export async function PUT(req: NextRequest) {
  try {
    const { notificationId, userId, markAllAsRead } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    if (markAllAsRead) {
      // Mark all notifications as read for user
      await prisma.notification.updateMany({
        where: { userId },
        data: { read: true }
      });
    } else if (notificationId) {
      // Mark specific notification as read
      await prisma.notification.update({
        where: { 
          id: notificationId,
          userId // Ensure user owns the notification
        },
        data: { read: true }
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Notification ID required or use markAllAsRead' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Notification(s) marked as read' 
    });
    
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
