'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface CourseContent {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  totalProgress: number;
}

// Mock course content data
const courseContent: Record<string, CourseContent> = {
  'drag-and-drop-basics': {
    id: 'drag-and-drop-basics',
    title: 'أساسيات السحب والإفلات',
    description: 'تعلم كيفية إنشاء عناصر تفاعلية باستخدام تقنيات السحب والإفلات',
    lessons: [
      {
        id: 'lesson-1',
        title: 'مقدمة إلى السحب والإفلات',
        duration: '30 دقيقة',
        completed: true
      },
      {
        id: 'lesson-2',
        title: 'إنشاء العناصر القابلة للسحب',
        duration: '45 دقيقة',
        completed: true
      },
      {
        id: 'lesson-3',
        title: 'التعامل مع الأحداث',
        duration: '60 دقيقة',
        completed: false
      },
      {
        id: 'lesson-4',
        title: 'تحسين تجربة المستخدم',
        duration: '45 دقيقة',
        completed: false
      }
    ],
    totalProgress: 50
  },
  'interactive-game-dev': {
    id: 'interactive-game-dev',
    title: 'تطوير الألعاب التفاعلية',
    description: 'تعلم كيفية تصميم وبرمجة ألعاب تفاعلية ممتعة',
    lessons: [
      {
        id: 'lesson-1',
        title: 'مقدمة إلى تطوير الألعاب',
        duration: '45 دقيقة',
        completed: true
      },
      {
        id: 'lesson-2',
        title: 'تصميم الشخصيات',
        duration: '60 دقيقة',
        completed: true
      },
      {
        id: 'lesson-3',
        title: 'برمجة الحركة',
        duration: '90 دقيقة',
        completed: true
      },
      {
        id: 'lesson-4',
        title: 'إضافة التفاعل',
        duration: '75 دقيقة',
        completed: true
      }
    ],
    totalProgress: 100
  },
  'coding-challenges': {
    id: 'coding-challenges',
    title: 'تحديات البرمجة',
    description: 'سلسلة من التحديات البرمجية لتطوير مهاراتك',
    lessons: [
      {
        id: 'lesson-1',
        title: 'التحدي الأول: المتغيرات والحلقات',
        duration: '45 دقيقة',
        completed: true
      },
      {
        id: 'lesson-2',
        title: 'التحدي الثاني: الدوال',
        duration: '60 دقيقة',
        completed: false
      },
      {
        id: 'lesson-3',
        title: 'التحدي الثالث: المصفوفات',
        duration: '75 دقيقة',
        completed: false
      },
      {
        id: 'lesson-4',
        title: 'التحدي الرابع: حل المشكلات المعقدة',
        duration: '90 دقيقة',
        completed: false
      }
    ],
    totalProgress: 25
  }
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseContent | null>(null);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseProgress = async () => {
      try {
        const response = await fetch(`/api/courses/${params.courseId}/progress`);
        if (!response.ok) {
          throw new Error('فشل في تحميل بيانات الدورة');
        }
        const data = await response.json();
        
        setCourse({
          id: data.course.id,
          title: data.course.title,
          description: data.course.description,
          lessons: data.course.lessons,
          totalProgress: data.progress
        });

        // Find the first incomplete lesson
        const firstIncompleteLesson = data.course.lessons.find(
          (lesson: Lesson) => !lesson.completed
        );
        setCurrentLesson(firstIncompleteLesson?.id || data.course.lessons[0].id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseProgress();
  }, [params.courseId]);

  const handleLessonComplete = async (lessonId: string) => {
    if (!course) return;

    try {
      const response = await fetch(`/api/courses/${course.id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId, completed: true }),
      });

      if (!response.ok) {
        throw new Error('فشل في تحديث التقدم');
      }

      const data = await response.json();

      // Update the course state with new progress
      setCourse(prev => {
        if (!prev) return null;
        return {
          ...prev,
          lessons: prev.lessons.map(lesson =>
            lesson.id === lessonId ? { ...lesson, completed: true } : lesson
          ),
          totalProgress: data.progress
        };
      });

      // Find the next incomplete lesson
      const nextIncompleteLesson = course.lessons.find(
        lesson => !lesson.completed && lesson.id !== lessonId
      );
      if (nextIncompleteLesson) {
        setCurrentLesson(nextIncompleteLesson.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-blue-900">جاري التحميل...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/my-courses"
            className="text-blue-600 hover:text-blue-800"
          >
            العودة إلى دوراتي
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">لم يتم العثور على الدورة</h1>
          <Link
            href="/my-courses"
            className="text-blue-600 hover:text-blue-800"
          >
            العودة إلى دوراتي
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/my-courses"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 w-fit"
          >
            <span>←</span>
            <span>العودة إلى دوراتي</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-4 text-right">{course.title}</h1>
          <p className="text-gray-600 mb-6 text-right">{course.description}</p>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>التقدم الكلي</span>
              <span>{course.totalProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  course.totalProgress === 100 ? 'bg-green-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${course.totalProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-right">الدروس</h2>
          <div className="space-y-4">
            {course.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`p-4 rounded-lg border ${
                  lesson.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      lesson.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      {lesson.completed ? (
                        <span className="text-white">✓</span>
                      ) : (
                        <span className="text-gray-400">○</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-right">{lesson.title}</h3>
                      <p className="text-sm text-gray-500">{lesson.duration}</p>
                    </div>
                  </div>
                  {!lesson.completed && (
                    <button
                      onClick={() => handleLessonComplete(lesson.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                      إكمال الدرس
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 