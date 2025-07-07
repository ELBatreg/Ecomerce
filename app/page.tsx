import Image from "next/image";
import Link from 'next/link';
import programo from "./program.jpg"

export default function HomePage() {
  const features = [
    {
      id: 1,
      title: "دروس تفاعلية",
      description: "تعلم البرمجة من خلال الألعاب والتحديات الممتعة",
      icon: "🎮",
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 2,
      title: "السحب والإفلات",
      description: "اكتب البرامج بسهولة عن طريق سحب وإفلات الأوامر",
      icon: "🎯",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 3,
      title: "شخصيات مرحة",
      description: "تعلم مع شخصيات كرتونية تساعدك في رحلتك",
      icon: "🦸‍♂️",
      color: "bg-green-100 text-green-600",
    },
    {
      id: 4,
      title: "مكافآت وجوائز",
      description: "اجمع النقاط والميداليات كلما تعلمت أكثر",
      icon: "🏆",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const levels = [
    {
      id: 1,
      title: "المستوى المبتدئ",
      description: "ابدأ رحلتك في عالم البرمجة",
      icon: "🌱",
      color: "bg-green-500",
    },
    {
      id: 2,
      title: "المستوى المتوسط",
      description: "طور مهاراتك وابني مشاريع أكبر",
      icon: "🚀",
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: "المستوى المتقدم",
      description: "أصبح محترف برمجة صغير",
      icon: "⭐",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-indigo-50 to-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8" >
              تعلم البرمجة بطريقة
              <span className="text-indigo-600"> ممتعة </span>
              وسهلة
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              منصة تعليمية تفاعلية تساعد الأطفال على تعلم البرمجة من خلال الألعاب والتحديات الشيقة
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/courses" 
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg"
              >
                ابدأ التعلم مجاناً
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-medium border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-300"
              >
                اعرف المزيد
              </Link>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative w-full h-[500px]">
              <Image
                src= {programo}
                alt="أطفال يتعلمون البرمجة"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              لماذا تتعلم معنا؟
            </h2>
            <p className="text-xl text-gray-600">
              نوفر لك تجربة تعلم فريدة ومميزة
            </p>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              مستويات التعلم
            </h2>
            <p className="text-xl text-gray-600">
              نقدم مسارات تعليمية تناسب جميع المستويات
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level) => (
              <div
                key={level.id}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 ${level.color} text-white rounded-xl flex items-center justify-center text-2xl mb-6`}>
                  {level.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {level.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {level.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              هل أنت مستعد لبدء رحلة البرمجة؟
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              انضم إلى آلاف الأطفال الذين يتعلمون البرمجة بطريقة ممتعة
            </p>
            <Link 
              href="/auth/register" 
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-medium hover:bg-indigo-50 transition-all duration-300 hover:shadow-lg inline-block"
            >
              سجل الآن مجاناً
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
