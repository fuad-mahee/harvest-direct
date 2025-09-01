import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/[id]/reviews - Get all reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: productId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'newest'; // newest, oldest, highest, lowest, helpful

    const skip = (page - 1) * limit;

    // Define sort order
    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'highest':
        orderBy = { rating: 'desc' };
        break;
      case 'lowest':
        orderBy = { rating: 'asc' };
        break;
      case 'helpful':
        orderBy = { helpful: 'desc' };
        break;
    }

    // Get reviews with user information
    const reviews = await prisma.productReview.findMany({
      where: {
        productId,
        reported: false // Don't show reported reviews
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: false // Don't expose email
          }
        }
      },
      orderBy,
      skip,
      take: limit
    });

    // Get total count for pagination
    const totalReviews = await prisma.productReview.count({
      where: {
        productId,
        reported: false
      }
    });

    // Calculate rating statistics
    const ratingStats = await prisma.productReview.aggregate({
      where: {
        productId,
        reported: false
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    // Get rating distribution
    const ratingDistribution = await prisma.productReview.groupBy({
      by: ['rating'],
      where: {
        productId,
        reported: false
      },
      _count: {
        rating: true
      }
    });

    const distribution = [1, 2, 3, 4, 5].map(star => {
      const found = ratingDistribution.find(item => item.rating === star);
      return {
        star,
        count: found ? found._count.rating : 0
      };
    });

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        total: totalReviews,
        totalPages: Math.ceil(totalReviews / limit)
      },
      stats: {
        averageRating: ratingStats._avg.rating || 0,
        totalReviews: ratingStats._count.rating || 0,
        distribution
      }
    });

  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/reviews - Add a new review
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: productId } = params;
    const body = await request.json();
    const { userId, rating, title, comment } = body;

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

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user exists and is a consumer
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.role !== 'CONSUMER') {
      return NextResponse.json(
        { success: false, error: 'Only consumers can write reviews' },
        { status: 403 }
      );
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.productReview.findUnique({
      where: {
        productId_userId: {
          productId,
          userId
        }
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this product' },
        { status: 409 }
      );
    }

    // Check if user has purchased this product (optional verification)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'DELIVERED'
        }
      }
    });

    // Create the review
    const review = await prisma.productReview.create({
      data: {
        productId,
        userId,
        rating,
        title: title?.trim() || null,
        comment: comment?.trim() || null,
        verified: !!hasPurchased
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
      review,
      message: 'Review added successfully'
    });

  } catch (error) {
    console.error('Error creating product review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
