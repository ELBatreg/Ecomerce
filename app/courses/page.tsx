'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CourseCard } from '@/app/components/CourseCard';
import  Dragimage  from "../assets/Images/maxresdefault.jpg";
import  gameimage  from "../assets/Images/ProgrammingGames.png";
import  challengeimage  from "../assets/Images/challange.webp";
import  animationimage  from "../assets/Images/animationcoding.jpeg";

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  author: string;
  category: string;
  level: string;
  price: number;
}

const courses: Course[] = [
  {
    id: 'drag-and-drop-basics',
    title: 'أساسيات السحب والإفلات',
    description: 'تعلم كيفية إنشاء عناصر تفاعلية باستخدام تقنيات السحب والإفلات',
    image: Dragimage.src,
    duration: '4 ساعات',
    author: 'فريق KidsCode',
    category: 'السحب والإفلات',
    level: 'مبتدئ',
    price: 0,
  },
  {
    id: '',
    title: 'تطوير الألعاب التفاعلية',
    description: 'تعلم كيفية تصميم وبرمجة ألعاب تفاعلية ممتعة',
    image: gameimage.src,
    duration: '6 ساعات',
    author: 'فريق KidsCode',
    category: 'الألعاب التفاعلية',
    level: 'متوسط',
    price: 0,
  },
  {
    id: '',
    title: 'تحديات البرمجة',
    description: 'سلسلة من التحديات البرمجية لتطوير مهاراتك',
    image: challengeimage.src,
    duration: '8 ساعات',
    author: 'فريق KidsCode',
    category: 'التحديات',
    level: 'متقدم',
    price: 0,
  },
  {
    id: '',
    title: 'أساسيات الرسوم المتحركة',
    description: 'تعلم كيفية إنشاء رسوم متحركة جذابة',
    image: animationimage.src,
    duration: '5 ساعات',
    author: 'فريق KidsCode',
    category: 'الرسوم المتحركة',
    level: 'مبتدئ',
    price: 0,
  },

];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">الدورات التعليمية</h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            اكتشف مجموعة متنوعة من الدورات التعليمية في مختلف المجالات التقنية
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <Input
            type="text"
            placeholder="ابحث عن الدورات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-right"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              image={course.image}
              author={course.author}
              price={course.price}
              duration={course.duration}
              level={course.level}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-blue-600">لم يتم العثور على دورات مطابقة لبحثك</p>
          </div>
        )}
      </div>
    </div>
  );
} 