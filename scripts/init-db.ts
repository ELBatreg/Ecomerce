const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin user exists
    const adminExists = await prisma.user.findFirst({
      where: {
        email: 'admin@example.com'
      }
    });

    if (!adminExists) {
      // Create admin user
      const adminPassword = await hash('admin123', 12);
      const admin = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Admin User',
          hashedPassword: adminPassword,
          role: 'ADMIN',
        },
      });
      console.log('Admin user created:', admin.email);
    } else {
      console.log('Admin user already exists');
    }

    // Check total users
    const userCount = await prisma.user.count();
    console.log('Total users in database:', userCount);

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 