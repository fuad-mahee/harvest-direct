import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/educational-resources - Get all educational resources for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const published = searchParams.get('published');
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (category) where.category = category;
    if (published !== null) where.published = published === 'true';
    
    const [resources, total] = await Promise.all([
      prisma.educationalResource.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.educationalResource.count({ where }),
    ]);

    return NextResponse.json({
      resources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching educational resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch educational resources' },
      { status: 500 }
    );
  }
}

// POST /api/admin/educational-resources - Create new educational resource
export async function POST(request: NextRequest) {
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
      publishedBy,
      published,
    } = body;

    // Validate required fields
    if (!title || !content || !category || !publishedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const resource = await prisma.educationalResource.create({
      data: {
        title,
        content,
        summary,
        category,
        tags: tags || [],
        imageUrl,
        author,
        publishedBy,
        published: published || false,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Error creating educational resource:', error);
    return NextResponse.json(
      { error: 'Failed to create educational resource' },
      { status: 500 }
    );
  }
}
