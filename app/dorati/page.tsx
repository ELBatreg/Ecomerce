'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  image: string;
  progress: number;
  nextLesson?: string;
  completed: boolean;
}

export default function DoratiPage() {
  const { data: session, status } = useSession();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for enrolled courses
    const mockCourses: EnrolledCourse[] = [
      {
        id: 'drag-and-drop-basics',
        title: 'أساسيات السحب والإفلات',
        description: 'تعلم كيفية إنشاء عناصر تفاعلية باستخدام تقنيات السحب والإفلات',
        image: '/courses/drag-drop-basics.png',
        progress: 75,
        nextLesson: 'الدرس الخامس: إنشاء لعبة بسيطة',
        completed: false
      },
      {
        id: ' ',
        title: 'تعلم مع أرب',
        description: 'تعلم اللغة العربية بطريقة تفاعلية وممتعة',
        image: '/courses/arb.png',
        progress: 100,
        completed: true
      },
      {
        id: ' ',
        title: 'تطوير الألعاب التفاعلية',
        description: 'تعلم كيفية تصميم وبرمجة ألعاب تفاعلية ممتعة',
        image: '/courses/interactive-games.png',
        progress: 30,
        nextLesson: 'الدرس الثالث: إضافة الصوت والموسيقى',
        completed: false
      }
    ];

    setEnrolledCourses(mockCourses);
    setLoading(false);
  }, []);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#1a1625] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff4b6e]"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#1a1625] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">يرجى تسجيل الدخول</h1>
          <Link
            href="/auth/login"
            className="inline-flex items-center rounded-lg bg-[#ff4b6e] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff4b6e]/90 transition-all duration-200"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1625] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">دوراتي</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            تابع تقدمك في الدورات المسجلة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="bg-[#241b2f] border border-[#ff4b6e]/20 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-48">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                {course.completed && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    مكتمل
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                <p className="text-gray-300 mb-4">{course.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>التقدم</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-[#2d2139] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        course.completed ? 'bg-green-500' : 'bg-[#ff4b6e]'
                      }`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {course.nextLesson && (
                  <p className="text-sm text-gray-400 mb-4">
                    الدرس التالي: {course.nextLesson}
                  </p>
                )}

                <Link
                  href={`/courses/${course.id}`}
                  className="w-full bg-[#ff4b6e] text-white py-2 px-4 rounded-lg hover:bg-[#ff4b6e]/90 transition-colors duration-300 text-center block"
                >
                  {course.completed ? 'مراجعة الدورة' : 'متابعة التعلم'}
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {enrolledCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-300">لم تسجل في أي دورة بعد</p>
            <Link
              href="/courses"
              className="inline-flex items-center rounded-lg bg-[#ff4b6e] px-6 py-3 text-lg font-medium text-white hover:bg-[#ff4b6e]/90 transition-all duration-200 mt-4"
            >
              استعرض الدورات
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 