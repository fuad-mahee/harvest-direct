import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('12345678', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'r@gmail.com' },
    update: {},
    create: {
      email: 'r@gmail.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      status: 'APPROVED',
    },
  })

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'John Doe',
      role: 'FARMER',
      status: 'PENDING',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Jane Smith',
      role: 'CONSUMER',
      status: 'PENDING',
    },
  })

  console.log('Database seeded successfully!')
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
