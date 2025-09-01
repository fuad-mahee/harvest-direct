import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = searchParams.get('days') || '30';
    const farmerId = searchParams.get('farmerId');
    
    if (!farmerId) {
      return NextResponse.json(
        { error: 'Farmer ID is required' },
        { status: 400 }
      );
    }

    // Calculate date filter
    let dateFilter = {};
    if (days !== 'all') {
      const daysNum = parseInt(days);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);
      dateFilter = {
        createdAt: {
          gte: startDate
        }
      };
    }

    // Get all orders containing farmer's products (only completed orders)
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            farmerId: farmerId
          }
        },
        status: {
          in: ['DELIVERED', 'CONFIRMED'] // Only completed orders
        },
        ...dateFilter
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          where: {
            farmerId: farmerId
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                unit: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Create CSV content
    let csvContent = 'Order ID,Customer Name,Customer Email,Product Name,Category,Quantity,Unit Price,Total Price,Order Date,Status\n';
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const row = [
          order.id,
          order.user.name,
          order.user.email,
          item.product.name,
          item.product.category,
          item.quantity,
          item.price.toFixed(2),
          (item.price * item.quantity).toFixed(2),
          new Date(order.createdAt).toLocaleDateString(),
          order.status
        ].map(field => `"${field}"`).join(',');
        csvContent += row + '\n';
      });
    });

    // Create response with CSV content
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="financial-report-${days}days.csv"`
      }
    });

    return response;

  } catch (error) {
    console.error('Error exporting financial data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export financial data' },
      { status: 500 }
    );
  }
}
