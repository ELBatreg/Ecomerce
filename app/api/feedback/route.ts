import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'PARENT' && session.user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { content, courseId, lessonId, receiverId } = await request.json();

    // Validate input
    if (!content || !courseId || !receiverId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        content,
        courseId,
        lessonId,
        providerId: session.user.id,
        receiverId,
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');

    const feedback = await prisma.feedback.findMany({
      where: {
        courseId: courseId || undefined,
        lessonId: lessonId || undefined,
        OR: [
          { providerId: session.user.id },
          { receiverId: session.user.id },
        ],
      },
      include: {
        provider: {
          select: {
            name: true,
            imageUrl: true,
            role: true,
          },
        },
        receiver: {
          select: {
            name: true,
            imageUrl: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 