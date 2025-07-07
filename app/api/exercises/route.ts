import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';
import  getServerSession  from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const level = searchParams.get('level');

    // If no exercises found, return a default one
    const defaultExercise = {
      id: 'default-advanced',
      title: 'Advanced Drag and Drop',
      titleAr: 'السحب والإفلات المتقدم',
      content: {
        blocks: [
          {
            id: '1',
            code: 'class Car {\n  constructor(brand) {\n    this.brand = brand;\n  }\n}',
            type: 'class',
            description: 'إنشاء فئة السيارة',
            explanation: 'الفئة مثل قالب لإنشاء كائنات متعددة من نفس النوع'
          },
          {
            id: '2',
            code: 'async function fetchData() {\n  const response = await fetch(url);\n  return response.json();\n}',
            type: 'async',
            description: 'دالة لجلب البيانات',
            explanation: 'الدوال غير المتزامنة تتعامل مع العمليات التي تحتاج وقتاً'
          }
        ],
        categories: ['class', 'async']
      }
    };

    return NextResponse.json([defaultExercise]);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { title, titleAr, type, content, lessonId } = body;

    if (!title || !type || !content || !lessonId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const exercise = await prisma.exercise.create({
      data: {
        title,
        titleAr,
        type,
        content,
        lessonId,
      },
    });

    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Error creating exercise:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { exerciseId, score, answers, timeSpent } = body;

    if (!exerciseId || score === undefined || !answers) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Create exercise attempt
    const attempt = await prisma.exerciseAttempt.create({
      data: {
        userId: session.user.id,
        exerciseId,
        score,
        answers,
        timeSpent: timeSpent || 0,
      },
    });

    // Update lesson progress if this is part of a lesson
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: { lesson: true },
    });

    if (exercise?.lesson) {
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          userId: session.user.id,
          courseId: exercise.lesson.courseId,
        },
      });

      if (enrollment) {
        await prisma.lessonProgress.upsert({
          where: {
            enrollmentId_lessonId: {
              enrollmentId: enrollment.id,
              lessonId: exercise.lesson.id,
            },
          },
          update: {
            completed: true,
            score: score,
            timeSpent: timeSpent || 0,
          },
          create: {
            enrollmentId: enrollment.id,
            lessonId: exercise.lesson.id,
            completed: true,
            score: score,
            timeSpent: timeSpent || 0,
          },
        });
      }
    }

    return NextResponse.json(attempt);
  } catch (error) {
    console.error('Error creating exercise attempt:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 