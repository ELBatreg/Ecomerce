import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'PARENT' && session.user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let students = [];

    if (session.user.role === 'PARENT') {
      // Get children's progress for parents
      students = await prisma.user.findMany({
        where: {
          parentId: session.user.id
        },
        include: {
          enrolledCourses: {
            include: {
              course: true,
              lessonProgress: true
            }
          }
        }
      });
    } else {
      // Get all students' progress for instructors
      const instructorCourses = await prisma.course.findMany({
        where: {
          instructorId: session.user.id
        },
        include: {
          enrollments: {
            include: {
              user: true,
              lessonProgress: true
            }
          }
        }
      });

      students = instructorCourses.flatMap(course =>
        course.enrollments.map(enrollment => ({
          ...enrollment.user,
          enrolledCourses: [{
            ...enrollment,
            course: course
          }]
        }))
      );
    }

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 