'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import gameimage from "../../assets/Images/ProgrammingGames.png";

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  projects: string[];
}

const courseModules: Module[] = [
  {
    id: 'basics',
    title: 'أساسيات برمجة ماين كرافت',
    description: 'تعلم المفاهيم الأساسية للبرمجة من خلال ماين كرافت',
    duration: '2 ساعات',
    projects: [
      'إنشاء أول تعديل بسيط',
      'تغيير مظهر الشخصية',
      'إضافة كتل جديدة'
    ]
  },
  {
    id: 'mobs',
    title: 'تصميم الكائنات',
    description: 'تعلم كيفية إنشاء وتعديل سلوك الكائنات في اللعبة',
    duration: '3 ساعات',
    projects: [
      'إنشاء كائن صديق',
      'برمجة سلوك الكائنات',
      'تصميم كائنات متحركة'
    ]
  },
  {
    id: 'items',
    title: 'صناعة الأدوات والأسلحة',
    description: 'تعلم كيفية إضافة أدوات وأسلحة جديدة إلى اللعبة',
    duration: '2 ساعات',
    projects: [
      'تصميم سيف سحري',
      'إنشاء أدوات خاصة',
      'برمجة تأثيرات الأسلحة'
    ]
  },
  {
    id: 'worlds',
    title: 'تصميم العوالم',
    description: 'تعلم كيفية إنشاء عوالم مخصصة وإضافة ميزات جديدة',
    duration: '3 ساعات',
    projects: [
      'إنشاء عالم سحري',
      'برمجة أحداث خاصة',
      'إضافة تحديات وألغاز'
    ]
  }
];

export default function MinecraftCoursePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          <div className="h-96 relative">
            <Image
              src={gameimage.src}
              alt="برمجة ماين كرافت للأطفال"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h1 className="text-5xl font-bold mb-4">برمجة ماين كرافت للأطفال</h1>
                <p className="text-xl mb-8">تعلم البرمجة بطريقة ممتعة من خلال لعبة ماين كرافت المفضلة</p>
                <Button size="lg" className="bg-green-500 hover:bg-green-600">
                  ابدأ التعلم مجاناً
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold mb-2">تعلم من خلال اللعب</h3>
            <p className="text-gray-600">اكتشف مفاهيم البرمجة من خلال تجربة عملية وممتعة</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">مشاريع عملية</h3>
            <p className="text-gray-600">قم بإنشاء تعديلات وإضافات خاصة بك في اللعبة</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">شهادة إتمام</h3>
            <p className="text-gray-600">احصل على شهادة بعد إكمال جميع المشاريع</p>
          </div>
        </div>

        {/* Course Modules */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">محتوى الدورة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courseModules.map((module) => (
              <Card key={module.id} className="p-6">
                <h3 className="text-2xl font-bold mb-4">{module.title}</h3>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <div className="mb-4">
                  <span className="text-sm font-medium text-green-600">
                    المدة: {module.duration}
                  </span>
                </div>
                <ul className="space-y-2">
                  {module.projects.map((project, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">✅</span>
                      {project}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">ابدأ رحلتك في عالم البرمجة مع ماين كرافت</h2>
          <p className="text-xl text-gray-600 mb-8">
            انضم إلى أكثر من 18,000 طالب يتعلمون البرمجة بطريقة ممتعة
          </p>
          <Button size="lg" className="bg-green-500 hover:bg-green-600">
            سجل الآن مجاناً
          </Button>
        </div>
      </div>
    </div>
  );
} 