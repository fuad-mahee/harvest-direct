import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/farmers/[id]/ratings - Get farmer ratings
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: farmerId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    // Get ratings with user information
    const ratings = await prisma.farmerRating.findMany({
      where: {
        farmerId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        order: {
          select: {
            id: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Get total count
    const totalRatings = await prisma.farmerRating.count({
      where: { farmerId }
    });

    // Calculate rating statistics
    const ratingStats = await prisma.farmerRating.aggregate({
      where: { farmerId },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    // Get rating distribution
    const ratingDistribution = await prisma.farmerRating.groupBy({
      by: ['rating'],
      where: { farmerId },
      _count: {
        rating: true
      }
    });

    const distribution = [1, 2, 3, 4, 5].map(star => {
      const found = ratingDistribution.find(item => Math.floor(item.rating) === star);
      return {
        star,
        count: found ? found._count.rating : 0
      };
    });

    // Calculate category averages from JSON data
    let categoryAverages: any = {};
    if (ratings.length > 0) {
      const categoriesData = ratings
        .filter(r => r.categories)
        .map(r => r.categories as any);
      
      if (categoriesData.length > 0) {
        const categoryKeys = Object.keys(categoriesData[0] || {});
        categoryKeys.forEach(key => {
          const values = categoriesData
            .map(data => data[key])
            .filter(val => typeof val === 'number');
          categoryAverages[key] = values.length > 0 
            ? values.reduce((a, b) => a + b, 0) / values.length 
            : 0;
        });
      }
    }

    return NextResponse.json({
      success: true,
      ratings,
      pagination: {
        page,
        limit,
        total: totalRatings,
        totalPages: Math.ceil(totalRatings / limit)
      },
      stats: {
        averageRating: ratingStats._avg.rating || 0,
        totalRatings: ratingStats._count.rating || 0,
        distribution,
        categoryAverages
      }
    });

  } catch (error) {
    console.error('Error fetching farmer ratings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

// POST /api/farmers/[id]/ratings - Add farmer rating
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: farmerId } = params;
    const body = await request.json();
    const { userId, orderId, rating, comment, categories } = body;

    // Validation
    if (!userId || !rating) {
      return NextResponse.json(
        { success: false, error: 'User ID and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if farmer exists
    const farmer = await prisma.user.findUnique({
      where: { 
        id: farmerId,
        role: 'FARMER'
      }
    });

    if (!farmer) {
      return NextResponse.json(
        { success: false, error: 'Farmer not found' },
        { status: 404 }
      );
    }

    // Check if user exists and is a consumer
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.role !== 'CONSUMER') {
      return NextResponse.json(
        { success: false, error: 'Only consumers can rate farmers' },
        { status: 403 }
      );
    }

    // Verify order if orderId provided
    let verified = false;
    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId,
          status: 'DELIVERED',
          items: {
            some: {
              farmerId
            }
          }
        }
      });
      verified = !!order;
    }

    // Check if already rated for this order (if orderId provided)
    const whereClause: any = {
      farmerId,
      userId
    };
    
    if (orderId) {
      whereClause.orderId = orderId;
    }

    const existingRating = await prisma.farmerRating.findUnique({
      where: {
        farmerId_userId_orderId: whereClause
      }
    });

    if (existingRating) {
      return NextResponse.json(
        { success: false, error: 'You have already rated this farmer for this transaction' },
        { status: 409 }
      );
    }

    // Validate categories if provided
    let validatedCategories: Record<string, number> | null = null;
    if (categories && typeof categories === 'object') {
      const categoryObj: Record<string, number> = {};
      Object.keys(categories).forEach(key => {
        const value = categories[key];
        if (typeof value === 'number' && value >= 1 && value <= 5) {
          categoryObj[key] = value;
        }
      });
      validatedCategories = Object.keys(categoryObj).length > 0 ? categoryObj : null;
    }

    // Create the rating
    const farmerRating = await prisma.farmerRating.create({
      data: {
        farmerId,
        userId,
        orderId: orderId || null,
        rating,
        comment: comment?.trim() || null,
        categories: validatedCategories || undefined,
        verified
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      rating: farmerRating,
      message: 'Farmer rating added successfully'
    });

  } catch (error) {
    console.error('Error creating farmer rating:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create rating' },
      { status: 500 }
    );
  }
}
