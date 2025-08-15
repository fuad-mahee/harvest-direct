import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestFarmerProfile() {
  try {
    // Find an existing farmer user
    const farmer = await prisma.user.findFirst({
      where: { role: 'FARMER', status: 'APPROVED' }
    });

    if (!farmer) {
      console.log('No approved farmer found. Creating one...');
      const newFarmer = await prisma.user.create({
        data: {
          email: 'testfarmer@example.com',
          password: 'hashedpassword',
          name: 'Test Farmer',
          role: 'FARMER',
          status: 'APPROVED'
        }
      });
      console.log('Created farmer:', newFarmer);
      
      // Create farmer profile
      const profile = await prisma.farmerProfile.create({
        data: {
          farmerId: newFarmer.id,
          farmName: 'Green Valley Organic Farm',
          farmAddress: '123 Farm Road, Springfield, IL 62701',
          farmSize: '25 acres',
          farmingPractices: ['Organic', 'Sustainable', 'Crop Rotation'],
          certifications: ['USDA Organic', 'Certified Naturally Grown'],
          aboutFarm: 'We are a family-owned organic farm dedicated to growing the freshest, healthiest produce using sustainable farming practices. Our farm has been in the family for three generations.',
          contactPhone: '(555) 123-4567',
          website: 'https://greenvalleyorganicfarm.com',
          specialization: ['Vegetables', 'Herbs'],
          experience: 15,
          status: 'APPROVED',
          certificationBadge: 'Verified Organic Farmer',
          approvedAt: new Date(),
          approvedBy: 'admin'
        }
      });
      console.log('Created farmer profile:', profile);

      // Create a test product
      const product = await prisma.product.create({
        data: {
          name: 'Fresh Organic Tomatoes',
          description: 'Vine-ripened organic tomatoes grown with sustainable practices. Perfect for salads, cooking, and making fresh sauces.',
          price: 4.99,
          category: 'Vegetables',
          quantity: 50,
          unit: 'lbs',
          imageUrl: 'https://images.unsplash.com/photo-1592841200221-471ff38edbec?w=400',
          farmerId: newFarmer.id,
          status: 'APPROVED'
        }
      });
      console.log('Created test product:', product);
    } else {
      console.log('Found existing farmer:', farmer);
      
      // Check if profile exists
      const existingProfile = await prisma.farmerProfile.findUnique({
        where: { farmerId: farmer.id }
      });

      if (!existingProfile) {
        const profile = await prisma.farmerProfile.create({
          data: {
            farmerId: farmer.id,
            farmName: 'Green Valley Organic Farm',
            farmAddress: '123 Farm Road, Springfield, IL 62701',
            farmSize: '25 acres',
            farmingPractices: ['Organic', 'Sustainable', 'Crop Rotation'],
            certifications: ['USDA Organic', 'Certified Naturally Grown'],
            aboutFarm: 'We are a family-owned organic farm dedicated to growing the freshest, healthiest produce using sustainable farming practices. Our farm has been in the family for three generations.',
            contactPhone: '(555) 123-4567',
            website: 'https://greenvalleyorganicfarm.com',
            specialization: ['Vegetables', 'Herbs'],
            experience: 15,
            status: 'APPROVED',
            certificationBadge: 'Verified Organic Farmer',
            approvedAt: new Date(),
            approvedBy: 'admin'
          }
        });
        console.log('Created farmer profile for existing farmer:', profile);
      } else {
        console.log('Farmer profile already exists:', existingProfile);
      }
    }

    console.log('Test data setup complete!');
  } catch (error) {
    console.error('Error setting up test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestFarmerProfile();
