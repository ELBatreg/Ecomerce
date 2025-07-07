import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: true,
      },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, description, courseId, questions } = body;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        courseId,
        questions: {
          create: questions,
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 