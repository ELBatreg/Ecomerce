import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  // Return mock data directly
  const mockData = {
    id: 'drag-and-drop-basics',
    title: 'أساسيات البرمجة للأطفال',
    description: 'تعلم أساسيات البرمجة بطريقة ممتعة وسهلة',
    codeBlocks: [
      {
        id: '1',
        code: 'let name = "أحمد"',
        type: 'variable',
        description: 'إنشاء متغير لتخزين الاسم',
        explanation: 'المتغير مثل الصندوق الذي نضع فيه الألعاب!'
      },
      {
        id: '2',
        code: 'let score = 0',
        type: 'variable',
        description: 'إنشاء متغير لتخزين النتيجة',
        explanation: 'نستخدم هذا المتغير لتتبع نقاط اللاعب'
      },
      {
        id: '3',
        code: 'function jump() {\n  console.log("القفز!")',
        type: 'function',
        description: 'دالة للقفز في اللعبة',
        explanation: 'الدالة مثل زر التحكم في اللعبة'
      },
      {
        id: '4',
        code: 'function collectCoin() {\n  score = score + 1\n  console.log("عملة جديدة!")',
        type: 'function',
        description: 'دالة لجمع العملات',
        explanation: 'هذه الدالة تزيد النتيجة عندما يجمع اللاعب عملة'
      },
      {
        id: '5',
        code: 'if (score > 10) {\n  console.log("أحسنت!")',
        type: 'condition',
        description: 'شرط للتحقق من النتيجة',
        explanation: 'نستخدم الشرط لاتخاذ قرارات في البرنامج'
      },
      {
        id: '6',
        code: 'if (name === "أحمد") {\n  console.log("مرحباً أحمد!")',
        type: 'condition',
        description: 'شرط للتحقق من الاسم',
        explanation: 'نستخدم هذا الشرط للترحيب باللاعب باسمه'
      },
      {
        id: '7',
        code: 'for (let i = 0; i < 3; i++) {\n  console.log("قفز!")',
        type: 'loop',
        description: 'تكرار القفز ثلاث مرات',
        explanation: 'الحلقة تكرر نفس العملية عدة مرات'
      },
      {
        id: '8',
        code: 'while (score < 5) {\n  collectCoin()',
        type: 'loop',
        description: 'جمع العملات حتى النتيجة 5',
        explanation: 'هذه الحلقة تستمر حتى نحقق هدف معين'
      }
    ],
    categories: ['variable', 'function', 'condition', 'loop']
  };

  return NextResponse.json(mockData);
} 