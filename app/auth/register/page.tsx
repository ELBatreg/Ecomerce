'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { z } from 'zod';


const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
  age: z.string(),
  agreeToTerms: z.boolean(),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).default('STUDENT')
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
}).refine((data) => {
  const age = parseInt(data.age);
  return !isNaN(age) && age >= 8 && age <= 100;
}, {
  message: "العمر يجب أن يكون بين 8 و 100 سنة",
  path: ["age"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    agreeToTerms: false,
    role: 'STUDENT'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const validatedData = registerSchema.parse(formData);
      console.log('Validated data:', validatedData);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: validatedData.name,
          email: validatedData.email,
          password: validatedData.password,
          age: parseInt(validatedData.age),
          role: validatedData.role
        }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء إنشاء الحساب');
      }

      if (!data.success) {
        throw new Error(data.error || 'فشل في إنشاء الحساب');
      }

      if (data.success && data.message) {
        router.push('/auth/login?registered=true');
      } else {
        throw new Error('حدث خطأ غير متوقع');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إنشاء الحساب');
      }
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center px-4 md:px-0">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
          <p className="text-gray-500">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
              تسجيل الدخول
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              الاسم الكامل
            </label>
            <Input
              id="name"
              name="name"
              placeholder="محمد أحمد"
              type="text"
              required
              className="w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <Input
              id="email"
              name="email"
              placeholder="example@example.com"
              type="email"
              required
              className="w-full"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="age" className="text-sm font-medium text-gray-700">
              العمر
            </label>
            <Input
              id="age"
              name="age"
              placeholder="العمر"
              type="number"
              min="8"
              max="100"
              required
              className="w-full"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              كلمة المرور
            </label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              required
              className="w-full"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              تأكيد كلمة المرور
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
              required
              className="w-full"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              أوافق على{" "}
              <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                شروط الخدمة
              </Link>{" "}
              و{" "}
              <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                سياسة الخصوصية
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.agreeToTerms}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
          </button>
          
        </form>
      </div>
    </div>
  );
} 