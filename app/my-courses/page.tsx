'use client';

import { useState, useEffect } from 'react';
import { CourseCard } from '../components/CourseCard';
import Dragimage from "../assets/Images/maxresdefault.jpg";
import gameimage from "../assets/Images/ProgrammingGames.png";
import challengeimage from "../assets/Images/challange.webp";
import animationimage from "../assets/Images/animationcoding.jpeg";
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  progress: number;
  nextLesson?: string;
  completed?: boolean;
}

export default function MyCoursesPage() {
  const { data: session, status } = useSession();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch('/api/enrollments');
        if (!response.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }
        const data = await response.json();
        setEnrolledCourses(data);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchEnrolledCourses();
    }
  }, [session]);

  const filteredCourses = enrolledCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">لوحة التعلم الخاصة بي</h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            تابع تقدمك واستمر في التعلم
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white shadow rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-right">نظرة عامة على التقدم</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-4 rounded-lg text-right">
              <p className="text-sm text-indigo-600 font-medium">الدورات المسجلة</p>
              <p className="text-2xl font-bold text-indigo-900">{enrolledCourses.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-right">
              <p className="text-sm text-green-600 font-medium">الدورات المكتملة</p>
              <p className="text-2xl font-bold text-green-900">
                {enrolledCourses.filter(course => course.progress === 100).length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-right">
              <p className="text-sm text-yellow-600 font-medium">قيد التقدم</p>
              <p className="text-2xl font-bold text-yellow-900">
                {enrolledCourses.filter(course => course.progress < 100).length}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <input
            type="text"
            placeholder="ابحث في دوراتك..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-right"
          />
        </div>

        {/* Enrolled Courses */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-right">دوراتي</h2>
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-300">لم تسجل في أي دورة بعد</p>
              <Link
                href="/courses"
                className="inline-flex items-center rounded-lg bg-[#ff4b6e] px-6 py-3 text-lg font-medium text-white hover:bg-[#ff4b6e]/90 transition-all duration-200 mt-4"
              >
                استعرض الدورات
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2 text-right">{course.title}</h3>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>التقدم</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            course.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    {course.nextLesson && (
                      <p className="text-sm text-gray-600 mb-4 text-right">
                        {course.nextLesson}
                      </p>
                    )}
                    <Link
                      href={`/${course.id}`}
                      className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 text-center"
                    >
                      {course.progress === 100 ? 'مراجعة الدورة' : 'متابعة التعلم'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Courses */}
        <div>
          <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-right">دورات موصى بها</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CourseCard
              id="drag-and-drop-basics"
              title="أساسيات السحب والإفلات"
              description="تعلم كيفية إنشاء عناصر تفاعلية باستخدام تقنيات السحب والإفلات"
              image={Dragimage.src}
              author="فريق KidsCode"
              price={0}
              duration="5 ساعات"
              level="مبتدئ"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 