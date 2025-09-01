import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating test data for financial tracking...')

  // Create farmer user
  const farmerUser = await prisma.user.upsert({
    where: { email: 'farmer@example.com' },
    update: {},
    create: {
      email: 'farmer@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test Farmer',
      role: 'FARMER',
      status: 'APPROVED',
    },
  })

  // Create consumer users
  const consumer1 = await prisma.user.upsert({
    where: { email: 'consumer1@example.com' },
    update: {},
    create: {
      email: 'consumer1@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Alice Consumer',
      role: 'CONSUMER',
      status: 'APPROVED',
    },
  })

  const consumer2 = await prisma.user.upsert({
    where: { email: 'consumer2@example.com' },
    update: {},
    create: {
      email: 'consumer2@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Bob Consumer',
      role: 'CONSUMER',
      status: 'APPROVED',
    },
  })

  // Create farmer profile
  await prisma.farmerProfile.upsert({
    where: { farmerId: farmerUser.id },
    update: {},
    create: {
      farmerId: farmerUser.id,
      farmName: 'Green Valley Farm',
      farmAddress: 'California, USA',
      farmSize: '50 acres',
      farmingPractices: ['Organic', 'Sustainable'],
      certifications: ['USDA Organic'],
      aboutFarm: 'Sustainable farming practices since 1990',
      contactPhone: '+1-555-0123',
      specialization: ['Vegetables', 'Fruits'],
      experience: 30
    },
  })

  // Create sample products
  const products = [
    {
      name: 'Organic Tomatoes',
      description: 'Fresh organic tomatoes grown without pesticides',
      price: 4.99,
      quantity: 100,
      unit: 'lb',
      category: 'Vegetables',
      imageUrl: '/images/tomatoes.jpg',
      farmerId: farmerUser.id
    },
    {
      name: 'Free Range Eggs',
      description: 'Farm fresh eggs from free-range chickens',
      price: 6.50,
      quantity: 200,
      unit: 'dozen',
      category: 'Dairy & Eggs',
      imageUrl: '/images/eggs.jpg',
      farmerId: farmerUser.id
    },
    {
      name: 'Organic Spinach',
      description: 'Fresh organic spinach leaves',
      price: 3.99,
      quantity: 50,
      unit: 'bunch',
      category: 'Vegetables',
      imageUrl: '/images/spinach.jpg',
      farmerId: farmerUser.id
    },
    {
      name: 'Organic Apples',
      description: 'Crisp organic apples, variety mix',
      price: 2.99,
      quantity: 150,
      unit: 'lb',
      category: 'Fruits',
      imageUrl: '/images/apples.jpg',
      farmerId: farmerUser.id
    },
    {
      name: 'Raw Honey',
      description: 'Pure raw honey from our beehives',
      price: 12.99,
      quantity: 30,
      unit: 'jar',
      category: 'Pantry',
      imageUrl: '/images/honey.jpg',
      farmerId: farmerUser.id
    }
  ]

  const createdProducts = []
  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData
    })
    createdProducts.push(product)
  }

  console.log(`Created ${createdProducts.length} products`)

  // Create sample orders with different dates for trend analysis
  const orders = []
  const now = new Date()

  // Create orders from different time periods
  for (let monthsBack = 0; monthsBack < 6; monthsBack++) {
    for (let orderNum = 0; orderNum < 4; orderNum++) {
      const orderDate = new Date(now)
      orderDate.setMonth(orderDate.getMonth() - monthsBack)
      orderDate.setDate(Math.floor(Math.random() * 28) + 1)

      const consumer = Math.random() > 0.5 ? consumer1 : consumer2
      const orderItems = []
      const numItems = Math.floor(Math.random() * 3) + 1

      // Select random products for this order
      const selectedProducts = createdProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, numItems)

      let orderTotal = 0
      for (const product of selectedProducts) {
        const quantity = Math.floor(Math.random() * 5) + 1
        const itemPrice = product.price
        const itemTotal = itemPrice * quantity
        orderTotal += itemTotal

        orderItems.push({
          product: {
            connect: { id: product.id }
          },
          farmer: {
            connect: { id: farmerUser.id }
          },
          quantity: quantity,
          price: itemPrice
        })
      }

      const order = await prisma.order.create({
        data: {
          userId: consumer.id,
          total: orderTotal,
          status: Math.random() > 0.1 ? 'DELIVERED' : 'PENDING',
          createdAt: orderDate,
          items: {
            create: orderItems
          }
        }
      })

      orders.push(order)
    }
  }

  console.log(`Created ${orders.length} sample orders`)

  console.log('Test data created successfully!')
  console.log(`Farmer user: farmer@example.com / password123`)
  console.log(`Consumer users: consumer1@example.com, consumer2@example.com / password123`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
