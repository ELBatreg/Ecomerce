-- Create the drag and drop exercise
INSERT INTO "Exercise" (id, title, "titleAr", type, content, "createdAt", "updatedAt", "lessonId")
VALUES (
  'drag-and-drop-exercise-1',
  'Drag and Drop Basics',
  'أساسيات السحب والإفلات',
  'DRAG_AND_DROP',
  '{
    "blocks": [
      {
        "id": "1",
        "code": "let name = \"أحمد\"",
        "type": "variable",
        "description": "إنشاء متغير لتخزين الاسم",
        "explanation": "المتغير مثل الصندوق الذي نضع فيه الألعاب! يمكننا وضع أي شيء فيه وتغييره متى نريد"
      },
      {
        "id": "2",
        "code": "let score = 10",
        "type": "variable",
        "description": "إنشاء متغير لتخزين النقاط",
        "explanation": "هنا نخزن الأرقام في المتغير، مثل عدد النقاط في لعبتك المفضلة"
      },
      {
        "id": "3",
        "code": "function jump() {\n  console.log(\"القفز!\")",
        "type": "function",
        "description": "دالة للقفز في اللعبة",
        "explanation": "الدالة مثل زر التحكم في اللعبة، عندما تضغط عليه يقوم بحركة معينة"
      },
      {
        "id": "4",
        "code": "function moveLeft() {\n  player.x -= 5",
        "type": "function",
        "description": "دالة للتحرك يساراً",
        "explanation": "هذه الدالة تجعل اللاعب يتحرك إلى اليسار في اللعبة"
      },
      {
        "id": "5",
        "code": "for (let i = 0; i < 3; i++) {\n  collectStar()",
        "type": "loop",
        "description": "تكرار جمع النجوم",
        "explanation": "الحلقة مثل تكرار نفس الحركة، مثل جمع النجوم في اللعبة مرة بعد مرة"
      },
      {
        "id": "6",
        "code": "while (hasEnergy) {\n  run()",
        "type": "loop",
        "description": "الجري طالما لديك طاقة",
        "explanation": "هذه الحلقة تجعل اللاعب يجري طالما لديه طاقة في اللعبة"
      },
      {
        "id": "7",
        "code": "if (score > 100) {\n  win()",
        "type": "condition",
        "description": "التحقق من الفوز",
        "explanation": "الشرط مثل قاعدة اللعبة: إذا جمعت أكثر من 100 نقطة، تفوز!"
      },
      {
        "id": "8",
        "code": "if (health < 3) {\n  getPotion()",
        "type": "condition",
        "description": "التحقق من الصحة",
        "explanation": "إذا كانت صحة اللاعب قليلة، يحصل على جرعة صحة"
      }
    ],
    "categories": ["variable", "function", "loop", "condition"]
  }',
  NOW(),
  NOW(),
  'drag-and-drop-lesson-1'
);

-- Create the lesson if it doesn't exist
INSERT INTO "Lesson" (id, title, "titleAr", content, "contentAr", duration, "order", "courseId", "createdAt", "updatedAt", "isPublished")
VALUES (
  'drag-and-drop-lesson-1',
  'Drag and Drop Basics',
  'أساسيات السحب والإفلات',
  'Learn the basics of drag and drop programming',
  'تعلم أساسيات البرمجة باستخدام السحب والإفلات',
  30,
  1,
  'drag-and-drop-basics',
  NOW(),
  NOW(),
  true
)
ON CONFLICT (id) DO NOTHING; 