'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

// Define the user type with role
interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-white/10' : '';
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg font-cairo sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center gap-10">
            <Link href="/" className="text-white text-2xl font-bold hover:text-indigo-200 transition-colors">
              Code Camp Junior
            </Link>
            <div className="flex items-center gap-1">
              <Link 
                href="/courses"
                className={`text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 ease-in-out ${isActive('/courses')}`}
              >
                جميع الدورات
              </Link>
              <Link 
                href="/trending"
                className={`text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 ease-in-out ${isActive('/trending')}`}
              >
                الرائجة
              </Link>
              <Link 
                href="/instructors"
                className={`text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 ease-in-out ${isActive('/instructors')}`}
              >
                المدربين
              </Link>
              {session?.user && session?.user?.role === 'INSTRUCTOR' && (
                <Link 
                  href="/dashboard/courses"
                  className={`text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 ease-in-out ${isActive('/dashboard/courses')}`}
                >
                  إدارة الدورات
                </Link>
              )}
              {session?.user && session?.user?.role === 'ADMIN' && (
                <Link 
                  href="/dashboard/users"
                  className={`text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 ease-in-out ${isActive('/dashboard/users')}`}
                >
                  إدارة المستخدمين
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session?.user && (
              <span className="text-xs text-yellow-200 bg-yellow-700 rounded px-2 py-1 mr-2">الدور: {session?.user?.role || 'غير محدد'}</span>
            )}
            {status === 'loading' ? (
              <div className="animate-pulse bg-white/20 rounded-lg w-24 h-9"></div>
            ) : session ? (
              <>
                <Link
                  href="/my-courses"
                  className={`text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 ease-in-out ${isActive('/my-courses')}`}
                >
                  دوراتي
                </Link>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 