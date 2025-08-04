import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestProducts() {
  console.log('Creating test products...')

  try {
    // Get the test farmer
    const testFarmer = await prisma.user.findFirst({
      where: { 
        email: 'farmer@test.com',
        role: 'FARMER'
      }
    })

    if (!testFarmer) {
      console.error('Test farmer not found. Please run create-test-users.ts first.')
      return
    }

    // Create sample products with different categories
    const products = [
      {
        name: 'Fresh Organic Tomatoes',
        description: 'Vine-ripened organic tomatoes, perfect for salads and cooking',
        price: 4.99,
        category: 'Vegetables',
        quantity: 50,
        unit: 'kg',
        inStock: true,
        status: 'APPROVED' as const,
        farmerId: testFarmer.id
      },
      {
        name: 'Sweet Corn',
        description: 'Fresh sweet corn, harvested this morning',
        price: 3.50,
        category: 'Vegetables',
        quantity: 100,
        unit: 'ears',
        inStock: true,
        status: 'APPROVED' as const,
        farmerId: testFarmer.id
      },
      {
        name: 'Red Apples',
        description: 'Crisp and sweet red apples, great for snacking',
        price: 3.99,
        category: 'Fruits',
        quantity: 75,
        unit: 'kg',
        inStock: true,
        status: 'APPROVED' as const,
        farmerId: testFarmer.id
      },
      {
        name: 'Fresh Spinach',
        description: 'Organic baby spinach leaves, perfect for salads',
        price: 5.99,
        category: 'Leafy Greens',
        quantity: 30,
        unit: 'bunches',
        inStock: true,
        status: 'APPROVED' as const,
        farmerId: testFarmer.id
      },
      {
        name: 'Carrots',
        description: 'Fresh orange carrots, grown without pesticides',
        price: 2.99,
        category: 'Vegetables',
        quantity: 40,
        unit: 'kg',
        inStock: true,
        status: 'APPROVED' as const,
        farmerId: testFarmer.id
      },
      {
        name: 'Strawberries',
        description: 'Sweet and juicy strawberries, perfect for desserts',
        price: 6.99,
        category: 'Fruits',
        quantity: 25,
        unit: 'pints',
        inStock: true,
        status: 'APPROVED' as const,
        farmerId: testFarmer.id
      },
      {
        name: 'Lettuce',
        description: 'Fresh iceberg lettuce, perfect for salads and sandwiches',
        price: 2.49,
        category: 'Leafy Greens',
        quantity: 35,
        unit: 'heads',
        inStock: true,
        status: 'APPROVED' as const,
        farmerId: testFarmer.id
      },
      {
        name: 'Potatoes',
        description: 'Russet potatoes, perfect for baking and frying',
        price: 1.99,
        category: 'Vegetables',
        quantity: 100,
        unit: 'kg',
        inStock: true,
        status: 'APPROVED' as const,
        farmerId: testFarmer.id
      },
      {
        name: 'Pending Broccoli',
        description: 'Fresh broccoli crowns (this one is pending approval)',
        price: 4.49,
        category: 'Vegetables',
        quantity: 20,
        unit: 'heads',
        inStock: true,
        status: 'PENDING' as const,
        farmerId: testFarmer.id
      }
    ]

    for (const product of products) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: product.name,
          farmerId: product.farmerId
        }
      })

      if (!existingProduct) {
        await prisma.product.create({
          data: product
        })
      }
    }

    console.log('Test products created successfully!')
    console.log(`Created ${products.length} products for farmer: ${testFarmer.name}`)
    console.log('Note: One product is in PENDING status to test admin approval flow')
  } catch (error) {
    console.error('Error creating test products:', error)
  }
}

createTestProducts()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
