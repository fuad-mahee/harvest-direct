import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Create new order from cart
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get user's cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                farmer: true
              }
            }
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate total and validate stock
    let total = 0;
    const orderItems = [];
    const notifications = [];

    for (const item of cart.items) {
      const product = item.product;
      
      // Check stock availability
      if (!product.inStock || product.quantity < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        farmerId: product.farmerId
      });

      // Prepare notification for farmer
      notifications.push({
        userId: product.farmerId,
        type: 'ORDER_RECEIVED',
        title: 'New Order Received!',
        message: `You received an order for ${item.quantity} ${product.unit} of ${product.name}`,
      });
    }

    // Create order with items in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          userId,
          total,
          items: {
            create: orderItems
          }
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  farmer: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      // Update product quantities
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });
      }

      // Create notifications for farmers
      for (const notification of notifications) {
        await tx.notification.create({
          data: {
            ...notification,
            orderId: order.id
          }
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return order;
    });

    return NextResponse.json({ 
      success: true, 
      order: result,
      message: 'Order placed successfully!' 
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET - Get user's orders
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const farmerId = searchParams.get('farmerId');

    if (!userId && !farmerId) {
      return NextResponse.json(
        { success: false, error: 'User ID or Farmer ID required' },
        { status: 400 }
      );
    }

    let orders;

    if (farmerId) {
      // Get orders containing farmer's products
      orders = await prisma.order.findMany({
        where: {
          items: {
            some: {
              farmerId: farmerId
            }
          }
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
                  imageUrl: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      // Get user's orders
      orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  farmer: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    return NextResponse.json({ success: true, orders });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// PUT - Update order status (for farmers)
export async function PUT(req: NextRequest) {
  try {
    const { orderId, status, farmerId } = await req.json();

    if (!orderId || !status || !farmerId) {
      return NextResponse.json(
        { success: false, error: 'Order ID, status, and farmer ID required' },
        { status: 400 }
      );
    }

    // Verify farmer has items in this order
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        orderId,
        farmerId
      },
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!orderItem) {
      return NextResponse.json(
        { success: false, error: 'Order not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                farmer: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Create notification for customer
    let notificationType;
    let notificationTitle;
    let notificationMessage;

    switch (status) {
      case 'CONFIRMED':
        notificationType = 'ORDER_CONFIRMED';
        notificationTitle = 'Order Confirmed!';
        notificationMessage = 'Your order has been confirmed and is being prepared.';
        break;
      case 'SHIPPED':
        notificationType = 'ORDER_SHIPPED';
        notificationTitle = 'Order Shipped!';
        notificationMessage = 'Your order has been shipped and is on the way.';
        break;
      case 'DELIVERED':
        notificationType = 'ORDER_DELIVERED';
        notificationTitle = 'Order Delivered!';
        notificationMessage = 'Your order has been delivered successfully.';
        break;
      case 'CANCELLED':
        notificationType = 'ORDER_CANCELLED';
        notificationTitle = 'Order Cancelled';
        notificationMessage = 'Your order has been cancelled.';
        break;
      default:
        notificationType = 'ORDER_CONFIRMED';
        notificationTitle = 'Order Updated';
        notificationMessage = 'Your order status has been updated.';
    }

    await prisma.notification.create({
      data: {
        userId: orderItem.order.user.id,
        type: notificationType,
        title: notificationTitle,
        message: notificationMessage,
        orderId
      }
    });

    return NextResponse.json({ 
      success: true, 
      order: updatedOrder,
      message: 'Order status updated successfully' 
    });
    
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
