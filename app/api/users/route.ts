import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log('Fetching users for admin:', session.user.email);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Found users:', users.length);

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('prisma')) {
        return NextResponse.json(
          { error: 'Database error', details: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 