import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { quizId, score, answers } = body;

    if (!quizId || score === undefined || !answers) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId,
        score,
        answers,
      },
    });

    return NextResponse.json(quizAttempt);
  } catch (error) {
    console.error('Error creating quiz attempt:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');

    if (!quizId) {
      return new NextResponse('Quiz ID is required', { status: 400 });
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        quizId,
        userId: session.user.id,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 