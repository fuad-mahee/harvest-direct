import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get all pending products for admin review
export async function GET() {
  try {
    const pendingProducts = await prisma.product.findMany({
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

    return NextResponse.json({
      success: true,
      products: pendingProducts
    });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pending products' },
      { status: 500 }
    );
  }
}

// Update product status (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const { productId, status } = await request.json();

    // Validation
    if (!productId || !status) {
      return NextResponse.json(
        { success: false, error: 'Product ID and status are required' },
        { status: 400 }
      );
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be APPROVED or REJECTED' },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { 
        status,
        updatedAt: new Date()
      },
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
      product: updatedProduct,
      message: `Product ${status.toLowerCase()} successfully`
    });
  } catch (error) {
    console.error('Error updating product status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product status' },
      { status: 500 }
    );
  }
}
