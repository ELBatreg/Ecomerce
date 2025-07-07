'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CodeBlock {
  id: string;
  code: string;
  type: 'variable' | 'function' | 'loop' | 'condition' | 'class' | 'async';
  description: string;
  explanation: string;
  fromCategory?: string;
}

interface Exercise {
  id: string;
  title: string;
  titleAr: string;
  content: {
    blocks: CodeBlock[];
    categories: string[];
  };
}

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLearningMode, setIsLearningMode] = useState(true);
  const [draggedBlock, setDraggedBlock] = useState<CodeBlock | null>(null);
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<CodeBlock[]>([]);
  const [droppedBlocks, setDroppedBlocks] = useState<Record<string, CodeBlock[]>>({});
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exercise, setExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    // Fetch exercise data
    const fetchExercise = async () => {
      try {
        const response = await fetch('/api/exercises?type=DRAG_AND_DROP&level=advanced');
        if (!response.ok) throw new Error('Failed to fetch exercise');
        const data = await response.json();
        
        if (!data || data.length === 0) {
          // If no exercise found, create a default one
          const defaultExercise: Exercise = {
            id: 'default-advanced',
            title: 'Advanced Drag and Drop',
            titleAr: 'السحب والإفلات المتقدم',
            content: {
              blocks: [
                {
                  id: '1',
                  code: 'class Car {\n  constructor(brand) {\n    this.brand = brand;\n  }\n}',
                  type: 'class' as const,
                  description: 'إنشاء فئة السيارة',
                  explanation: 'الفئة مثل قالب لإنشاء كائنات متعددة من نفس النوع'
                },
                {
                  id: '2',
                  code: 'async function fetchData() {\n  const response = await fetch(url);\n  return response.json();\n}',
                  type: 'async' as const,
                  description: 'دالة لجلب البيانات',
                  explanation: 'الدوال غير المتزامنة تتعامل مع العمليات التي تحتاج وقتاً'
                }
              ],
              categories: ['class', 'async']
            }
          };
          setExercise(defaultExercise);
          setCodeBlocks(defaultExercise.content.blocks);
          setAvailableBlocks(defaultExercise.content.blocks);
          setDroppedBlocks({
            'class': [],
            'async': []
          });
          return;
        }

        const exercise = data[0];
        setExercise(exercise);
        const blocks = [...exercise.content.blocks].sort(() => Math.random() - 0.5);
        setCodeBlocks(blocks);
        setAvailableBlocks(blocks);
        
        const initialDroppedBlocks: Record<string, CodeBlock[]> = {};
        exercise.content.categories.forEach((category: string) => {
          initialDroppedBlocks[category] = [];
        });
        setDroppedBlocks(initialDroppedBlocks);
      } catch (error) {
        console.error('Error fetching exercise:', error);
        setMessage('حدث خطأ أثناء تحميل التمرين');
      }
    };

    fetchExercise();

    // Start timer
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStartTest = () => {
    setIsLearningMode(false);
    const shuffled = [...codeBlocks].sort(() => Math.random() - 0.5);
    setCodeBlocks(shuffled);
    setAvailableBlocks(shuffled);
  };

  const handleDragStart = (block: CodeBlock, fromCategory?: string) => {
    setDraggedBlock({ ...block, fromCategory });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (category: string) => {
    if (!draggedBlock) return;

    if (draggedBlock.fromCategory) {
      setDroppedBlocks(prev => ({
        ...prev,
        [draggedBlock.fromCategory!]: prev[draggedBlock.fromCategory!].filter(
          block => block.id !== draggedBlock.id
        )
      }));
    } else {
      setAvailableBlocks(prev => prev.filter(block => block.id !== draggedBlock.id));
    }

    setDroppedBlocks(prev => ({
      ...prev,
      [category]: [...prev[category], { ...draggedBlock, fromCategory: undefined }]
    }));

    // Calculate score silently without showing it
    if (!draggedBlock.fromCategory) {
      if (draggedBlock.type === category) {
        setScore(prev => prev + 10);
      }
    }

    const totalDropped = Object.values(droppedBlocks).flat().length;
    if (totalDropped === codeBlocks.length - 1) {
      setIsTestCompleted(true);
    }

    setDraggedBlock(null);
  };

  const handleSubmit = async () => {
    if (!session || !exercise) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/exercises', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId: exercise.id,
          score,
          answers: droppedBlocks,
          timeSpent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit exercise');
      }

      setShowResults(true);
    } catch (error) {
      console.error('Error submitting exercise:', error);
      setMessage('حدث خطأ أثناء حفظ النتيجة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetGame = () => {
    if (!exercise) return;
    
    const shuffled = [...exercise.content.blocks].sort(() => Math.random() - 0.5);
    const initialDroppedBlocks: Record<string, CodeBlock[]> = {};
    exercise.content.categories.forEach(category => {
      initialDroppedBlocks[category] = [];
    });
    
    setDroppedBlocks(initialDroppedBlocks);
    setScore(0);
    setMessage('');
    setShowExplanation(false);
    setIsTestCompleted(false);
    setShowResults(false);
    setTimeSpent(0);
    setCodeBlocks(shuffled);
    setAvailableBlocks(shuffled);
  };

  const getCategoryName = (type: string) => {
    switch (type) {
      case 'variable':
        return '🎁 المتغيرات';
      case 'function':
        return '🎮 الدوال';
      case 'loop':
        return '🔄 الحلقات';
      case 'condition':
        return '🎯 الشروط';
      case 'class':
        return '🏗️ الفئات';
      case 'async':
        return '⏳ الدوال غير المتزامنة';
      default:
        return type;
    }
  };

  const getCategoryExplanation = (type: string) => {
    switch (type) {
      case 'variable':
        return 'المتغيرات تخزن البيانات في البرنامج';
      case 'function':
        return 'الدوال تقوم بتنفيذ مهام محددة';
      case 'loop':
        return 'الحلقات تكرر تنفيذ الكود عدة مرات';
      case 'condition':
        return 'الشروط تتحكم في مسار تنفيذ البرنامج';
      case 'class':
        return 'الفئات تسمح بإنشاء كائنات متعددة من نفس النوع';
      case 'async':
        return 'الدوال غير المتزامنة تتعامل مع العمليات التي تحتاج وقتاً';
      default:
        return '';
    }
  };

  if (!exercise) {
    return (
      <div className="min-h-screen bg-[#1a1625] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl">جاري تحميل التمرين...</p>
        </div>
      </div>
    );
  }

  if (isLearningMode) {
    return (
      <div className="min-h-screen bg-white text-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="bg-blue-500 text-white px-6 py-2 rounded-full text-lg mb-4 inline-block">
              🎉 المستوى المتقدم 🎉
            </span>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              {exercise.titleAr}
            </h1>
          </div>
          
          <div className="space-y-8">
            {exercise.content.categories.map(category => (
              <div key={category} 
                className="bg-gray-50 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform border border-blue-100">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">
                  {getCategoryName(category)}
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  {getCategoryExplanation(category)}
                </p>
                <div className="grid gap-4">
                  {exercise.content.blocks
                    .filter(block => block.type === category)
                    .map(block => (
                      <div key={block.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <pre className="bg-gray-50 text-blue-600 p-3 rounded-lg mb-2">
                          <code>{block.code}</code>
                        </pre>
                        <p className="text-gray-600 mt-2">{block.explanation}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleStartTest}
              className="bg-blue-500 text-white text-xl px-8 py-4 rounded-full hover:bg-blue-600 transform hover:scale-105 transition-all shadow-lg"
            >
              🎮 هيا نبدأ الاختبار! 🎮
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="bg-blue-500 text-white px-6 py-2 rounded-full text-lg mb-4 inline-block">
            🎉 المستوى المتقدم 🎉
          </span>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{exercise.titleAr}</h1>
          <p className="text-xl text-gray-600 mb-4">اسحب كل كود إلى المكان المناسب له</p>
          {!showResults && (
            <div className="flex justify-center gap-4">
              <button
                onClick={resetGame}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
              >
                🔄 إعادة اللعب
              </button>
              {isTestCompleted && (
                <button
                  onClick={() => setShowResults(true)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
                >
                  🎯 عرض النتيجة
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-blue-100">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">🎲 الأكواد البرمجية</h2>
            <div className="space-y-4">
              {availableBlocks.map(block => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => handleDragStart(block)}
                  className="cursor-move bg-white p-4 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 group border border-gray-200"
                >
                  <pre className="bg-gray-50 text-blue-600 p-3 rounded-lg mb-2 overflow-x-auto group-hover:border-blue-200 border border-transparent transition-colors">
                    <code>{block.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-blue-100">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">🎯 المناطق</h2>
            <div className="space-y-6">
              {exercise.content.categories.map(category => (
                <div
                  key={category}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(category)}
                  className="min-h-[200px] border-2 border-dashed border-blue-200 rounded-lg p-4 bg-white transition-all hover:border-blue-300"
                >
                  <h3 className="text-xl font-bold text-blue-600 mb-4">{getCategoryName(category)}</h3>
                  <div className="space-y-4">
                    {droppedBlocks[category]?.map(block => (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={() => handleDragStart(block, category)}
                        className="bg-gray-50 p-3 rounded-lg transform hover:scale-105 transition-all cursor-move group border border-gray-200"
                      >
                        <pre className="bg-white text-blue-600 p-2 rounded-lg overflow-x-auto group-hover:border-blue-200 border border-transparent transition-colors">
                          <code>{block.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showResults && (
          <div className="mt-8 bg-gray-50 p-6 rounded-xl shadow-lg border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">🌟 نتيجتك النهائية 🌟</h2>
            <p className="text-xl text-gray-600 mb-4">
              لقد حصلت على {score} من {exercise.content.blocks.length * 10} نقطة
            </p>
            <p className="text-xl text-gray-600 mb-4">
              الوقت المستغرق: {Math.floor(timeSpent / 60)} دقيقة و {timeSpent % 60} ثانية
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exercise.content.categories.map(category => (
                <div key={category} className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">{getCategoryName(category)}</h3>
                  <p className="text-gray-600 mb-4">{getCategoryExplanation(category)}</p>
                  {droppedBlocks[category]?.map(block => (
                    <div key={block.id} className="mb-4">
                      <pre className="bg-gray-50 text-blue-600 p-3 rounded-lg mb-2">
                        <code>{block.code}</code>
                      </pre>
                      <p className="text-sm text-gray-500">
                        {block.type === category ? '✅ صحيح' : '❌ غير صحيح'}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-8 text-center space-y-4">
              <button
                onClick={() => router.push('/courses/drag-and-drop-expert')}
                className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 text-xl w-full max-w-md"
              >
                🚀 الانتقال إلى المستوى التالي 🚀
              </button>
              <button
                onClick={() => router.push('/courses/drag-and-drop-advanced')}
                className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 text-xl w-full max-w-md"
              >
                🔄 إعادة المحاولة في المستوى المتقدم 🔄
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 