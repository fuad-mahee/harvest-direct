import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/educational-resources/[id] - Get specific resource
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await prisma.educationalResource.findUnique({
      where: { id: params.id },
    });

    if (!resource) {
      return NextResponse.json(
        { error: 'Educational resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error fetching educational resource:', error);
    return NextResponse.json(
      { error: 'Failed to fetch educational resource' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/educational-resources/[id] - Update specific resource
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      summary,
      category,
      tags,
      imageUrl,
      author,
      published,
    } = body;

    const resource = await prisma.educationalResource.update({
      where: { id: params.id },
      data: {
        title,
        content,
        summary,
        category,
        tags,
        imageUrl,
        author,
        published,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error updating educational resource:', error);
    return NextResponse.json(
      { error: 'Failed to update educational resource' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/educational-resources/[id] - Delete specific resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.educationalResource.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Educational resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting educational resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete educational resource' },
      { status: 500 }
    );
  }
}
