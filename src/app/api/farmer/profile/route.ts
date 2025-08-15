import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch farmer profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId');

    if (!farmerId) {
      return NextResponse.json({ success: false, error: 'Farmer ID is required' }, { status: 400 });
    }

    const profile = await prisma.farmerProfile.findUnique({
      where: { farmerId },
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

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching farmer profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// POST - Create farmer profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      farmerId,
      farmName,
      farmAddress,
      farmSize,
      farmingPractices,
      certifications,
      aboutFarm,
      contactPhone,
      website,
      specialization,
      experience
    } = body;

    // Validate required fields
    if (!farmerId || !farmName || !farmAddress || !farmSize) {
      return NextResponse.json({ 
        success: false, 
        error: 'Farm ID, name, address, and size are required' 
      }, { status: 400 });
    }

    // Check if profile already exists
    const existingProfile = await prisma.farmerProfile.findUnique({
      where: { farmerId }
    });

    if (existingProfile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile already exists. Use PUT to update.' 
      }, { status: 400 });
    }

    const profile = await prisma.farmerProfile.create({
      data: {
        farmerId,
        farmName,
        farmAddress,
        farmSize,
        farmingPractices: farmingPractices || [],
        certifications: certifications || [],
        aboutFarm,
        contactPhone,
        website,
        specialization: specialization || [],
        experience: experience ? parseInt(experience) : null,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Profile submitted for review!',
      profile 
    });
  } catch (error) {
    console.error('Error creating farmer profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to create profile' }, { status: 500 });
  }
}

// PUT - Update farmer profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      farmerId,
      farmName,
      farmAddress,
      farmSize,
      farmingPractices,
      certifications,
      aboutFarm,
      contactPhone,
      website,
      specialization,
      experience
    } = body;

    // Validate required fields
    if (!farmerId || !farmName || !farmAddress || !farmSize) {
      return NextResponse.json({ 
        success: false, 
        error: 'Farm ID, name, address, and size are required' 
      }, { status: 400 });
    }

    const profile = await prisma.farmerProfile.update({
      where: { farmerId },
      data: {
        farmName,
        farmAddress,
        farmSize,
        farmingPractices: farmingPractices || [],
        certifications: certifications || [],
        aboutFarm,
        contactPhone,
        website,
        specialization: specialization || [],
        experience: experience ? parseInt(experience) : null,
        status: 'PENDING' // Reset to pending when updated
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated and submitted for review!',
      profile 
    });
  } catch (error) {
    console.error('Error updating farmer profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}
