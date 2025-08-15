import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch pending farmer profiles for admin review
export async function GET() {
  try {
    const pendingProfiles = await prisma.farmerProfile.findMany({
      where: {
        status: 'PENDING'
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, profiles: pendingProfiles });
  } catch (error) {
    console.error('Error fetching pending profiles:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch profiles' }, { status: 500 });
  }
}

// PUT - Approve or reject farmer profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, status, adminNotes, certificationBadge, approvedBy } = body;

    if (!profileId || !status) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile ID and status are required' 
      }, { status: 400 });
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Status must be APPROVED or REJECTED' 
      }, { status: 400 });
    }

    const updateData: any = {
      status,
      adminNotes,
      approvedBy
    };

    if (status === 'APPROVED') {
      updateData.approvedAt = new Date();
      updateData.certificationBadge = certificationBadge || 'Verified Farmer';
    }

    const profile = await prisma.farmerProfile.update({
      where: { id: profileId },
      data: updateData,
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Profile ${status.toLowerCase()} successfully`,
      profile 
    });
  } catch (error) {
    console.error('Error updating profile status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile status' }, { status: 500 });
  }
}
