import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUsers() {
  console.log('Creating test users...')

  try {
    // Create test farmer user
    const hashedPassword1 = await bcrypt.hash('testpass123', 10)
    const testFarmer = await prisma.user.upsert({
      where: { email: 'farmer@test.com' },
      update: {},
      create: {
        email: 'farmer@test.com',
        password: hashedPassword1,
        name: 'Test Farmer',
        role: 'FARMER',
        status: 'APPROVED',
      },
    })

    // Create test consumer user
    const hashedPassword2 = await bcrypt.hash('testpass123', 10)
    const testConsumer = await prisma.user.upsert({
      where: { email: 'consumer@test.com' },
      update: {},
      create: {
        email: 'consumer@test.com',
        password: hashedPassword2,
        name: 'Test Consumer',
        role: 'CONSUMER',
        status: 'APPROVED',
      },
    })

    console.log('Test users created successfully!')
    console.log('Farmer:', testFarmer.email, '- ID:', testFarmer.id)
    console.log('Consumer:', testConsumer.email, '- ID:', testConsumer.id)
    console.log('Password for both: testpass123')
  } catch (error) {
    console.error('Error creating test users:', error)
  }
}

createTestUsers()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
