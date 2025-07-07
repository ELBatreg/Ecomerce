import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create an instructor user if it doesn't exist
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {},
    create: {
      email: 'instructor@example.com',
      name: 'Test Instructor',
      role: 'INSTRUCTOR',
      hashedPassword: 'dummy-password', // You should hash this in production
    },
  });

  // Create the course
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

  // Create a lesson
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

  // Create the drag-and-drop exercise
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
            explanation: 'المتغير مثل الصندوق الذي نضع فيه الألعاب! يمكننا وضع أي شيء فيه وتغييره متى نريد'
          },
          {
            id: '2',
            code: 'let score = 10',
            type: 'variable',
            description: 'إنشاء متغير لتخزين النقاط',
            explanation: 'هنا نخزن الأرقام في المتغير، مثل عدد النقاط في لعبتك المفضلة'
          },
          {
            id: '3',
            code: 'function jump() {\n  console.log("القفز!")',
            type: 'function',
            description: 'دالة للقفز في اللعبة',
            explanation: 'الدالة مثل زر التحكم في اللعبة، عندما تضغط عليه يقوم بحركة معينة'
          },
          {
            id: '4',
            code: 'function moveLeft() {\n  player.x -= 5',
            type: 'function',
            description: 'دالة للتحرك يساراً',
            explanation: 'هذه الدالة تجعل اللاعب يتحرك إلى اليسار في اللعبة'
          },
          {
            id: '5',
            code: 'for (let i = 0; i < 3; i++) {\n  collectStar()',
            type: 'loop',
            description: 'تكرار جمع النجوم',
            explanation: 'الحلقة مثل تكرار نفس الحركة، مثل جمع النجوم في اللعبة مرة بعد مرة'
          },
          {
            id: '6',
            code: 'while (hasEnergy) {\n  run()',
            type: 'loop',
            description: 'الجري طالما لديك طاقة',
            explanation: 'هذه الحلقة تجعل اللاعب يجري طالما لديه طاقة في اللعبة'
          },
          {
            id: '7',
            code: 'if (score > 100) {\n  win()',
            type: 'condition',
            description: 'التحقق من الفوز',
            explanation: 'الشرط مثل قاعدة اللعبة: إذا جمعت أكثر من 100 نقطة، تفوز!'
          },
          {
            id: '8',
            code: 'if (health < 3) {\n  getPotion()',
            type: 'condition',
            description: 'التحقق من الصحة',
            explanation: 'إذا كانت صحة اللاعب قليلة، يحصل على جرعة صحة'
          }
        ],
        categories: ['variable', 'function', 'loop', 'condition']
      },
      lessonId: lesson.id,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 