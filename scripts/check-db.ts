import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: 'drag-and-drop-basics' },
      include: {
        lessons: {
          include: {
            exercises: true
          }
        }
      }
    });

    console.log('Course:', course);

    // Check all courses
    const allCourses = await prisma.course.findMany();
    console.log('All courses:', allCourses);

    // Check all lessons
    const allLessons = await prisma.lesson.findMany();
    console.log('All lessons:', allLessons);

    // Check all exercises
    const allExercises = await prisma.exercise.findMany();
    console.log('All exercises:', allExercises);

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase(); 