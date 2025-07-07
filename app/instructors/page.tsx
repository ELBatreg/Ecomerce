import Image from 'next/image'
import sarah from "../assets/Images/sara.jpg"
import ahmed from "../assets/Images/ahmedali.jpg"
import noor from "../assets/Images/nourhady.jpeg"
import yasser from "../assets/Images/yaser.jpeg"

export default function InstructorsPage() {
  // Mock instructors data
  const instructors = [
    {
      id: 1,
      name: "محمد المطرافي",
      role: "مدرب سكراتش الرئيسية",
      Image: "",
      expertise: ["سكراتش", "الألعاب التعليمية", "البرمجة للمبتدئين"],
      bio: "مدرب متخصص في تعليم البرمجة للأطفال بطريقة ممتعة وسهلة. لديه خبرة 8 سنوات في التدريس.",
      rating: 4.9,
      totalStudents: 12500,
      courses: 6,
      achievements: ["أفضل مدرب 2023", "جائزة اختيار الطلاب"],
      socialLinks: {
        github: "https://github.com/",
        linkedin: "https://linkedin.com/in/",
        twitter: "https://twitter.com/"
      }
    },
    {
      id: 2,
      name: "أنس عبدالله",
      role: "خبير البرمجة التفاعلية",
      Image : "",
      expertise: ["بلوكلي", "الألعاب البرمجية", "التفكير المنطقي"],
      bio: "متخصص في جعل تعلم البرمجة متعة للأطفال من خلال الألعاب والتحديات الممتعة.",
      rating: 4.8,
      totalStudents: 9800,
      courses: 4,
      achievements: ["نجم صاعد 2023", "الأكثر تفاعلاً"],
      socialLinks: {
        github: "https://github.com/",
        linkedin: "https://linkedin.com/in/",
        twitter: "https://twitter.com/"
      }
    },
    {
      id: 3,
      name: "عبدالله الجابري ",
      role: "مدرب الروبوتات التعليمية",
      Image: "",
      expertise: ["الروبوتات", "البرمجة الأساسية", "المشاريع العملية"],
      bio: "مهندس روبوتات تحول الأفكار المعقدة إلى مشاريع ممتعة للأطفال.",
      rating: 4.9,
      totalStudents: 7200,
      courses: 3,
      achievements: ["جائزة الابتكار", "أفضل مدرب "],
      socialLinks: {
        github: "https://github.com/",
        linkedin: "https://linkedin.com/in/",
        twitter: "https://twitter.com/"
      }
    },
    {
      id: 4,
      name: "معاذ ابراهيم ",
      role: "خبير الألعاب التعليمية",
      Image: "",
      expertise: ["تصميم الألعاب", "البرمجة للأطفال", "التعلم التفاعلي"],
      bio: "مصمم ألعاب تعليمية يساعد الأطفال على تعلم البرمجة من خلال اللعب والمرح.",
      rating: 4.7,
      totalStudents: 5600,
      courses: 4,
      achievements: ["التميز التقني", "قائد المجتمع"],
      socialLinks: {
        github: "https://github.com/",
        linkedin: "https://linkedin.com/in/y",
        twitter: "https://twitter.com/"
      }
    }
  ];
  
  const email = 'mohamed.elgendy@gmail.com';
  const subject = 'Inquiry about your course';
  const body = 'Hello, I would like to ask about...';

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;


  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">تعرف على مدربينا المتميزين</h1>
        <p className="mt-2 text-lg text-gray-700">نخبة من المدربين المتخصصين في تعليم البرمجة للأطفال بطريقة ممتعة</p>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {instructors.map((instructor) => (
          <div key={instructor.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
                <Image src={instructor.Image} alt={instructor.name} className="w-23 h-24 rounded-full" />
                </div>  
                <div className="mr-6">
                  <h3 className="text-xl font-semibold text-gray-900">{instructor.name}</h3>
                  <p className="text-indigo-600 font-medium">{instructor.role}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="mr-1 text-sm text-gray-600">تقييم المدرب {instructor.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 text-right">{instructor.bio}</p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {instructor.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{instructor.totalStudents.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">طالب وطالبة</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{instructor.courses}</div>
                  <div className="text-sm text-gray-600">دورات تعليمية</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{instructor.rating}</div>
                  <div className="text-sm text-gray-600">التقييم</div>
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">الإنجازات</h4>
                <div className="flex flex-wrap gap-2">
                  {instructor.achievements.map((achievement) => (
                    <span
                      key={achievement}
                      className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                    >
                      🏆 {achievement}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
                <a href={instructor.socialLinks.github} className="text-gray-600 hover:text-indigo-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href={instructor.socialLinks.linkedin} className="text-gray-600 hover:text-indigo-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href={instructor.socialLinks.twitter} className="text-gray-600 hover:text-indigo-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>




      {/* Call to Action */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">هل تريد الانضمام إلى فريق المدربين؟</h2>
        <p className="text-gray-600 mb-6">شارك خبرتك في تعليم البرمجة وألهم الجيل القادم من المبرمجين الصغار</p>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300" >
        <a   href={mailtoLink}>
          
        انضم إلينا كمدرب
        </a>
        </button>
      </div>
    </div>
  );
} 