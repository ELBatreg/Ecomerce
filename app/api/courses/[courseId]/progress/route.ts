import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح لك' },
        { status: 401 }
      );
    }

    const { lessonId, completed } = await request.json();

    // Update or create progress record
    await prisma.userProgress.upsert({
      where: {
        id: `${session.user.id}_${lessonId}`,
      },
      update: {
        completed: completed,
      },
      create: {
        id: `${session.user.id}_${lessonId}`,
        userId: session.user.id,
        courseId: params.courseId,
        exerciseId: lessonId,
        completed: completed,
        score: 0,
        attempts: 0,
      },
    });

    // Calculate total progress
    const totalLessons = await prisma.course.findUnique({
      where: { id: params.courseId },
      include: { lessons: true },
    });

    const completedLessons = await prisma.userProgress.count({
      where: {
        userId: session.user.id,
        courseId: params.courseId,
        completed: true,
      },
    });

    const progress = totalLessons 
      ? Math.round((completedLessons / totalLessons.lessons.length) * 100)
      : 0;

    return NextResponse.json({ 
      success: true,
      progress,
      completedLessons,
    });
  } catch (error) {
    console.error('Error updating course progress:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث التقدم' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح لك' },
        { status: 401 }
      );
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
      include: { lessons: true },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'الدورة غير موجودة' },
        { status: 404 }
      );
    }

    // Get user's progress
    const userProgress = await prisma.userProgress.findMany({
      where: {
        userId: session.user.id,
        courseId: params.courseId,
      },
    });

    const completedLessons = userProgress
      .filter(progress => progress.completed)
      .map(progress => progress.lessonId);

    const progress = course.lessons.length > 0
      ? Math.round((completedLessons.length / course.lessons.length) * 100)
      : 0;

    return NextResponse.json({
      courseId: params.courseId,
      progress,
      completedLessons,
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        lessons: course.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          completed: completedLessons.includes(lesson.id),
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب التقدم' },
      { status: 500 }
    );
  }
} 