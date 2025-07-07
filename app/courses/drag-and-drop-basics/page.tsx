'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

interface CodeBlock {
  id: string;
  code: string;
  type: 'variable' | 'function' | 'loop' | 'condition';
  description: string;
  explanation: string;
  fromCategory?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  codeBlocks: CodeBlock[];
  categories: string[];
}

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = 'drag-and-drop-basics'; // Hardcode for now to test
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
  const [showRedirectButton, setShowRedirectButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        console.log('Fetching course data for:', courseId);
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch course data');
        }
        const courseData = await response.json();
        console.log('Received course data:', courseData);
        
        if (!courseData.codeBlocks || !courseData.categories) {
          console.error('Invalid course data structure:', courseData);
          throw new Error('Invalid course data structure');
        }

        setCourse(courseData);
        
        // Initialize dropped blocks with categories from the course
        const initialDroppedBlocks: Record<string, CodeBlock[]> = {};
        courseData.categories.forEach((category: string) => {
          initialDroppedBlocks[category] = [];
        });
        setDroppedBlocks(initialDroppedBlocks);

        // Shuffle and set code blocks
        const shuffledBlocks = [...courseData.codeBlocks].sort(() => Math.random() - 0.5);
        setCodeBlocks(shuffledBlocks);
        setAvailableBlocks(shuffledBlocks);
      } catch (error) {
        console.error('Error fetching course data:', error);
        setMessage('حدث خطأ أثناء تحميل بيانات الدورة');
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

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

    if (!draggedBlock.fromCategory) {
      if (draggedBlock.type === category) {
        setScore(prev => prev + 10);
        setMessage('أحسنت! 🌟');
      } else {
        setMessage('حاول مرة أخرى! 💪');
      }
    }

    const totalDropped = Object.values(droppedBlocks).flat().length;
    if (totalDropped === codeBlocks.length - 1) {
      setIsTestCompleted(true);
    }

    setDraggedBlock(null);
  };

  const resetGame = () => {
    if (!course) return;
    
    const shuffled = [...course.codeBlocks].sort(() => Math.random() - 0.5);
    const initialDroppedBlocks: Record<string, CodeBlock[]> = {};
    course.categories.forEach((category: string) => {
      initialDroppedBlocks[category] = [];
    });
    
    setDroppedBlocks(initialDroppedBlocks);
    setScore(0);
    setMessage('');
    setShowExplanation(false);
    setIsTestCompleted(false);
    setShowResults(false);
    setShowRedirectButton(false);
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
      default:
        return type;
    }
  };

  const getCategoryExplanation = (type: string) => {
    switch (type) {
      case 'variable':
        return 'المتغيرات مثل الصناديق السحرية! يمكنك تخزين أي شيء بداخلها';
      case 'function':
        return 'الدوال مثل الأزرار السحرية في لعبتك المفضلة';
      case 'loop':
        return 'الحلقات تكرر الأشياء مثل جمع النجوم مرة بعد مرة';
      case 'condition':
        return 'الشروط مثل قواعد اللعبة: إذا حدث كذا، نفعل كذا!';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f2f5ff] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff4b6e]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#f2f5ff] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-black">
            الدورة غير موجودة
          </h1>
        </div>
      </div>
    );
  }

  if (isLearningMode) {
    return (
      <div className="min-h-screen bg-[#f2f5ff] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
        
            <h1 className="text-4xl font-bold mb-3 text-black">
              🌟 مرحباً بك في عالم البرمجة المرح! 🌟
            </h1>
          </div>
          
          <div className="space-y-8">
            {course.categories.map(category => (
              <div key={category} 
                className="bg-[#241b2f] rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform border border-[#ff4b6e]/20">
                <h2 className="text-2xl font-bold mb-4 text-[#ff4b6e]">
                  {getCategoryName(category)}
                </h2>
                <p className="text-lg text-gray-300 mb-4">
                  {getCategoryExplanation(category)}
                </p>
                <div className="grid gap-4">
                  {course.codeBlocks
                    .filter(block => block.type === category)
                    .map(block => (
                      <div key={block.id} className="bg-[#2d2139] rounded-lg p-4">
                        <pre className="bg-[#1a1625] text-[#ff4b6e] p-3 rounded-lg mb-2">
                          <code>{block.code}</code>
                        </pre>
                        <p className="text-gray-400 mt-2">{block.explanation}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleStartTest}
              className="bg-[#ff4b6e] text-white text-xl px-8 py-4 rounded-full hover:bg-[#ff4b6e]/90 transform hover:scale-105 transition-all shadow-lg"
            >
              🎮 هيا نبدأ اللعب! 🎮
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f5ff] text-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="bg-[#ff4b6e] text-white px-6 py-2 rounded-full text-lg mb-4 inline-block">
            🎉 دورة مجانية 🎉
          </span>
          <h1 className="text-4xl font-bold mb-4">🎮 لعبة السحب والافلات 🎮</h1>
          <p className="text-xl text-gray-600 mb-4">اسحب كل كود إلى المكان المناسب له</p>
          <div className="text-2xl font-bold text-[#ff4b6e] mb-4 "></div>
          {message && (
            <div className={`text-xl font-bold mb-4 ${message.includes('') ? 'text-green-400' : 'text-yellow-400'}`}>
              {message}
            </div>
          )}
          <div className="flex justify-center gap-4">
            <button
              onClick={resetGame}
              className="bg-[#ff4b6e] text-white px-6 py-3 rounded-lg hover:bg-[#ff4b6e]/90 transition-all transform hover:scale-105"
            >
              🔄 إعادة اللعب
            </button>
            {isTestCompleted && (
              <button
                onClick={() => {
                  setShowResults(true);
                  setShowRedirectButton(true);
                }}
                className="bg-[#ff4b6e] text-white px-6 py-3 rounded-lg hover:bg-[#ff4b6e]/90 transition-all transform hover:scale-105"
              >
                🎯 عرض النتيجة
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#241b2f] p-6 rounded-xl shadow-lg border border-[#ff4b6e]/20">
            <h2 className="text-2xl font-bold mb-4 text-[#ff4b6e]">🎲 الأكواد البرمجية</h2>
            <div className="space-y-4">
              {availableBlocks.map(block => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => handleDragStart(block)}
                  className="cursor-move bg-[#2d2139] p-4 rounded-lg hover:bg-[#382a47] transition-all transform hover:scale-105 group"
                >
                  <pre className="bg-[#1a1625] text-[#ff4b6e] p-3 rounded-lg mb-2 overflow-x-auto group-hover:border-[#ff4b6e]/50 border border-transparent transition-colors">
                    <code>{block.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#241b2f] p-6 rounded-xl shadow-lg border border-[#ff4b6e]/20">
            <h2 className="text-2xl font-bold mb-4 text-[#ff4b6e]">🎯 المناطق</h2>
            <div className="space-y-6">
              {course.categories.map(category => (
                <div
                  key={category}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(category)}
                  className="min-h-[200px] border-2 border-dashed border-[#ff4b6e]/30 rounded-lg p-4 bg-[#2d2139] transition-all hover:border-[#ff4b6e]/50"
                >
                  <h3 className="text-xl font-bold text-[#ff4b6e] mb-4">{getCategoryName(category)}</h3>
                  <div className="space-y-4">
                    {droppedBlocks[category].map(block => (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={() => handleDragStart(block, category)}
                        className="bg-[#241b2f] p-3 rounded-lg transform hover:scale-105 transition-all cursor-move group"
                      >
                        <pre className="bg-[#1a1625] text-[#ff4b6e] p-2 rounded-lg overflow-x-auto group-hover:border-[#ff4b6e]/50 border border-transparent transition-colors">
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
          
          <div className="mt-8 bg-[#241b2f] p-6 rounded-xl shadow-lg border border-[#ff4b6e]/20">
            <h2 className="text-2xl font-bold text-[#ff4b6e] mb-4">🌟 نتيجتك النهائية 🌟</h2>
            <p className="text-xl text-gray-300 mb-4">
              لقد حصلت على {score} من {course.codeBlocks.length * 10} نقطة
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.categories.map(category => (
                <div key={category} className="bg-[#2d2139] p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-[#ff4b6e] mb-2">{getCategoryName(category)}</h3>
                  <p className="text-gray-300 mb-4">{getCategoryExplanation(category)}</p>
                  {droppedBlocks[category].map(block => (
                    <div key={block.id} className="mb-4">
                      <pre className="bg-[#1a1625] text-[#ff4b6e] p-3 rounded-lg mb-2">
                        <code>{block.code}</code>
                      </pre>
                      <p className="text-sm text-gray-400">
                        {block.type === category ? '✅ صحيح' : '❌ غير صحيح'}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {showRedirectButton && (
          <div className="text-center mt-8">
            <button
              onClick={() => window.location.href = '/courses/drag-and-drop-advanced'}
              className="bg-green-500 text-white text-xl px-8 py-4 rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all"
            >
              🚀 ابدأ المستوى المتقدم الآن 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}