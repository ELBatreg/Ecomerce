import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Enrollment, Lesson, LessonProgress } from '@prisma/client';

interface EnrollmentWithRelations extends Enrollment {
  course: {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    lessons: Lesson[];
  };
  lessonProgresses: (LessonProgress & {
    lesson: Lesson;
  })[];
  exercise: {
    id: string;
    title: string;
  };
}

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح لك' },
        { status: 401 }
      );
    }

    // Get user's enrollments with course details
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        course: {
          include: {
            lessons: true
          }
        },
        lessonProgresses: {
          include: {
            lesson: true,
          },
        },
        exercise: true,
      },
    }) as EnrollmentWithRelations[];

    // Transform the data to match the frontend interface
    const enrolledCourses = enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.lessons?.length || 0;
      const completedLessons = enrollment.lessonProgresses.filter((lp) => lp.completed).length;
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // Find the next incomplete lesson
      const nextLesson = enrollment.course.lessons?.find((lesson) => 
        !enrollment.lessonProgresses.find((lp) => lp.lessonId === lesson.id && lp.completed)
      );

      return {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        imageUrl: enrollment.course.imageUrl || '/default-course-image.jpg',
        progress,
        nextLesson: nextLesson ? `الدرس التالي: ${nextLesson.title}` : undefined,
        completed: progress === 100,
      };
    });

    return NextResponse.json(enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الدورات المسجلة' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح لك' },
        { status: 401 }
      );
    }

    const { courseId, exerciseId } = await request.json();

    if (!courseId || !exerciseId) {
      return NextResponse.json(
        { error: 'معرف الدورة والتمرين مطلوبان' },
        { status: 400 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId,
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'أنت مسجل بالفعل في هذه الدورة' },
        { status: 400 }
      );
    }

    // Create new enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
        exerciseId: exerciseId,
        status: 'IN_PROGRESS',
      },
      include: {
        course: true,
        exercise: true,
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التسجيل في الدورة' },
      { status: 500 }
    );
  }
} 