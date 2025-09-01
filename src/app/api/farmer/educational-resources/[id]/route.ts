import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/farmer/educational-resources/[id] - Get specific published resource and increment view count
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First check if resource exists and is published
    const resource = await prisma.educationalResource.findFirst({
      where: { 
        id: params.id,
        published: true,
      },
    });

    if (!resource) {
      return NextResponse.json(
        { error: 'Educational resource not found' },
        { status: 404 }
      );
    }

    // Increment view count
    const updatedResource = await prisma.educationalResource.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(updatedResource);
  } catch (error) {
    console.error('Error fetching educational resource:', error);
    return NextResponse.json(
      { error: 'Failed to fetch educational resource' },
      { status: 500 }
    );
  }
}
