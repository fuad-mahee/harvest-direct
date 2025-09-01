import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get all approved products for consumers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    // Build the where clause
    const whereClause: any = {
      status: 'APPROVED',
      inStock: true,
    };

    // Add category filter
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) {
        whereClause.price.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        whereClause.price.lte = parseFloat(maxPrice);
      }
    }

    // Add search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            farmerProfile: {
              select: {
                id: true,
                farmName: true,
                farmAddress: true,
                farmSize: true,
                farmingPractices: true,
                certifications: true,
                aboutFarm: true,
                contactPhone: true,
                website: true,
                specialization: true,
                experience: true,
                status: true,
                certificationBadge: true,
                approvedAt: true
              }
            }
          }
        },
        reviews: {
          where: {
            reported: false
          },
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate rating statistics for each product
    const productsWithRatings = products.map(product => {
      const ratings = product.reviews.map(r => r.rating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0;
      
      return {
        ...product,
        averageRating,
        totalReviews: ratings.length,
        reviews: undefined // Remove reviews array from response
      };
    });

    // Get unique categories for filter options
    const categories = await prisma.product.findMany({
      where: {
        status: 'APPROVED',
        inStock: true,
      },
      select: {
        category: true
      },
      distinct: ['category']
    });

    const uniqueCategories = categories.map(c => c.category);

    return NextResponse.json({
      success: true,
      products: productsWithRatings,
      categories: uniqueCategories
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
