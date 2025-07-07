'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  price: number;
  duration: number;
  imageUrl: string;
  isPublished: boolean;
  instructor: {
    name: string;
    email: string;
  };
  category: {
    name: string;
  };
}

export default function CoursesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, router]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/courses');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.details || 'Failed to fetch courses');
        }

        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الدورة؟')) {
      return;
    }

    try {
      setDeletingCourseId(courseId);
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete course');
      }

      // Remove the deleted course from the state
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (err) {
      console.error('Error deleting course:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    } finally {
      setDeletingCourseId(null);
    }
  };

  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الدورات</h1>
        {(session.user.role === 'INSTRUCTOR' || session.user.role === 'ADMIN') && (
          <Link href="/dashboard/add-course">
            <Button>إضافة دورة جديدة</Button>
          </Link>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="text-center text-gray-500">لا توجد دورات متاحة</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={course.imageUrl || '/placeholder-course.jpg'}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {course.instructor.name}
                  </span>
                  <span className="text-sm font-medium">
                    {course.price === 0 ? 'مجاني' : `${course.price} ريال`}
                  </span>
                </div>
                {(session.user.role === 'INSTRUCTOR' || session.user.role === 'ADMIN') && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCourse(course.id)}
                      disabled={deletingCourseId === course.id}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {deletingCourseId === course.id ? 'جاري الحذف...' : 'حذف الدورة'}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 