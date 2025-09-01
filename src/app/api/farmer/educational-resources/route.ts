import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/farmer/educational-resources - Get published educational resources for farmers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    const where: any = { published: true };
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }
    
    const [resources, total] = await Promise.all([
      prisma.educationalResource.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          summary: true,
          category: true,
          tags: true,
          imageUrl: true,
          author: true,
          viewCount: true,
          createdAt: true,
        },
      }),
      prisma.educationalResource.count({ where }),
    ]);

    // Get unique categories for filtering
    const categories = await prisma.educationalResource.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ['category'],
    });

    return NextResponse.json({
      resources,
      categories: categories.map(c => c.category),
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
