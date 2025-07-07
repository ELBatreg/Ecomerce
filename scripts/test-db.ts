import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connection successful');

    // Create test instructor
    const instructor = await prisma.user.upsert({
      where: { email: 'instructor@example.com' },
      update: {},
      create: {
        email: 'instructor@example.com',
        name: 'Test Instructor',
        role: 'INSTRUCTOR',
        hashedPassword: 'dummy-password',
      },
    });
    console.log('Created instructor:', instructor.id);

    // Create course
    const course = await prisma.course.upsert({
      where: { id: 'drag-and-drop-basics' },
      update: {},
      create: {
        id: 'drag-and-drop-basics',
        title: 'أساسيات البرمجة للأطفال',
        description: 'تعلم أساسيات البرمجة بطريقة ممتعة وسهلة',
        level: 'BEGINNER',
        price: 0,
        duration: 60,
        instructorId: instructor.id,
        isPublished: true,
      },
    });
    console.log('Created course:', course.id);

    // Create lesson
    const lesson = await prisma.lesson.upsert({
      where: { id: 'drag-and-drop-lesson-1' },
      update: {},
      create: {
        id: 'drag-and-drop-lesson-1',
        title: 'Drag and Drop Basics',
        titleAr: 'أساسيات السحب والإفلات',
        content: 'Learn the basics of drag and drop programming',
        contentAr: 'تعلم أساسيات البرمجة باستخدام السحب والإفلات',
        duration: 30,
        order: 1,
        courseId: course.id,
        isPublished: true,
      },
    });
    console.log('Created lesson:', lesson.id);

    // Create exercise
    const exercise = await prisma.exercise.upsert({
      where: { id: 'drag-and-drop-exercise-1' },
      update: {},
      create: {
        id: 'drag-and-drop-exercise-1',
        title: 'Drag and Drop Basics',
        titleAr: 'أساسيات السحب والإفلات',
        type: 'DRAG_AND_DROP',
        content: {
          blocks: [
            {
              id: '1',
              code: 'let name = "أحمد"',
              type: 'variable',
              description: 'إنشاء متغير لتخزين الاسم',
              explanation: 'المتغير مثل الصندوق الذي نضع فيه الألعاب!'
            },
            {
              id: '2',
              code: 'function jump() {\n  console.log("القفز!")',
              type: 'function',
              description: 'دالة للقفز في اللعبة',
              explanation: 'الدالة مثل زر التحكم في اللعبة'
            }
          ],
          categories: ['variable', 'function']
        },
        lessonId: lesson.id,
      },
    });
    console.log('Created exercise:', exercise.id);

    // Verify the data
    const createdCourse = await prisma.course.findUnique({
      where: { id: 'drag-and-drop-basics' },
      include: {
        lessons: {
          include: {
            exercises: true
          }
        }
      }
    });
    console.log('Verified course:', createdCourse);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 