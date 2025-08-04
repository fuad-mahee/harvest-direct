import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get products for a specific farmer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId');

    if (!farmerId) {
      return NextResponse.json(
        { success: false, error: 'Farmer ID is required' },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        farmerId: farmerId
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
      products
    });
  } catch (error) {
    console.error('Error fetching farmer products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Create a new product listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      category, 
      quantity, 
      unit, 
      imageUrl, 
      farmerId 
    } = body;

    // Validation
    if (!name || !price || !category || !quantity || !farmerId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, price, category, quantity, farmerId' },
        { status: 400 }
      );
    }

    // Verify farmer exists
    const farmer = await prisma.user.findUnique({
      where: { id: farmerId }
    });

    if (!farmer || farmer.role !== 'FARMER') {
      return NextResponse.json(
        { success: false, error: 'Invalid farmer ID' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        quantity: parseInt(quantity),
        unit: unit || 'kg',
        imageUrl,
        farmerId,
        inStock: parseInt(quantity) > 0,
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
      }
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Product listing created successfully and submitted for review'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product listing' },
      { status: 500 }
    );
  }
}

// Update a product listing
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      productId, 
      name, 
      description, 
      price, 
      category, 
      quantity, 
      unit, 
      imageUrl, 
      farmerId 
    } = body;

    if (!productId || !farmerId) {
      return NextResponse.json(
        { success: false, error: 'Product ID and Farmer ID are required' },
        { status: 400 }
      );
    }

    // Verify the product belongs to the farmer
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        farmerId: farmerId
      }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        category,
        quantity: quantity ? parseInt(quantity) : undefined,
        unit,
        imageUrl,
        inStock: quantity ? parseInt(quantity) > 0 : undefined,
        status: 'PENDING', // Reset to pending when updated
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
      message: 'Product listing updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product listing' },
      { status: 500 }
    );
  }
}
