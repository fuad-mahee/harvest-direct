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

    // Get all orders containing farmer's products (only completed orders count for revenue)
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            farmerId: farmerId
          }
        },
        status: {
          in: ['DELIVERED', 'CONFIRMED'] // Only count completed orders
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

    // Calculate financial metrics
    let totalRevenue = 0;
    let totalItems = 0;
    const productPerformanceMap = new Map();
    const monthlyRevenueMap = new Map();

    // Get previous period data for growth calculation
    const previousPeriodStart = new Date();
    previousPeriodStart.setDate(previousPeriodStart.getDate() - (parseInt(days) * 2));
    const previousPeriodEnd = new Date();
    previousPeriodEnd.setDate(previousPeriodEnd.getDate() - parseInt(days));

    const previousOrders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            farmerId: farmerId
          }
        },
        status: {
          in: ['DELIVERED', 'CONFIRMED']
        },
        createdAt: {
          gte: previousPeriodStart,
          lt: previousPeriodEnd
        }
      },
      include: {
        items: {
          where: {
            farmerId: farmerId
          }
        }
      }
    });

    let previousRevenue = 0;
    previousOrders.forEach(order => {
      order.items.forEach(item => {
        previousRevenue += item.price * item.quantity;
      });
    });

    // Process current period orders
    orders.forEach(order => {
      order.items.forEach(item => {
        const itemRevenue = item.price * item.quantity;
        totalRevenue += itemRevenue;
        totalItems += item.quantity;

        // Product performance tracking
        const productKey = item.product.id;
        if (productPerformanceMap.has(productKey)) {
          const existing = productPerformanceMap.get(productKey);
          productPerformanceMap.set(productKey, {
            ...existing,
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + itemRevenue
          });
        } else {
          productPerformanceMap.set(productKey, {
            productName: item.product.name,
            quantity: item.quantity,
            revenue: itemRevenue
          });
        }

        // Monthly revenue tracking
        const orderDate = new Date(order.createdAt);
        const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
        const monthName = orderDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        
        if (monthlyRevenueMap.has(monthKey)) {
          const existing = monthlyRevenueMap.get(monthKey);
          monthlyRevenueMap.set(monthKey, {
            ...existing,
            revenue: existing.revenue + itemRevenue,
            orders: existing.orders + 1
          });
        } else {
          monthlyRevenueMap.set(monthKey, {
            month: monthName,
            revenue: itemRevenue,
            orders: 1
          });
        }
      });
    });

    // Calculate revenue growth
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    // Get top products
    const topProducts = Array.from(productPerformanceMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Get monthly revenue data
    const monthlyRevenue = Array.from(monthlyRevenueMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([_, data]) => data)
      .slice(-12);

    const financialData = {
      totalRevenue,
      totalOrders: orders.length,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      revenueGrowth,
      topProducts,
      monthlyRevenue,
      orders: orders.slice(0, 50) // Limit to recent 50 orders
    };

    return NextResponse.json(financialData);

  } catch (error) {
    console.error('Error fetching financial data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch financial data' },
      { status: 500 }
    );
  }
}
