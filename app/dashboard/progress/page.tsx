'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface ProgressData {
  studentId: string;
  studentName: string;
  courseName: string;
  progress: number;
  lastAccessed: string;
  score?: number;
  timeSpent?: number;
}

export default function ProgressMonitoringPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }

    if (session?.user?.role !== 'PARENT' && session?.user?.role !== 'INSTRUCTOR') {
      router.push('/');
    }

    // Fetch progress data
    const fetchProgressData = async () => {
      try {
        const response = await fetch('/api/progress');
        const data = await response.json();
        setProgressData(data);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [session, status, router]);

  const filteredData = progressData.filter(data => {
    const matchesStudent = selectedStudent === 'all' || data.studentId === selectedStudent;
    const matchesSearch = data.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         data.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStudent && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">متابعة التقدم</h1>

      <div className="grid gap-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="البحث عن طالب أو دورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          
          <Select
            value={selectedStudent}
            onValueChange={setSelectedStudent}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="اختر الطالب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الطلاب</SelectItem>
              {/* Add student options dynamically */}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((data, index) => (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{data.studentName}</h3>
                  <p className="text-gray-600">{data.courseName}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>التقدم:</span>
                    <span>{Math.round(data.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${data.progress}%` }}
                    ></div>
                  </div>
                </div>

                {data.score !== undefined && (
                  <div className="flex justify-between">
                    <span>الدرجة:</span>
                    <span>{data.score}%</span>
                  </div>
                )}

                {data.timeSpent !== undefined && (
                  <div className="flex justify-between">
                    <span>الوقت المستغرق:</span>
                    <span>{Math.round(data.timeSpent / 60)} ساعة</span>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  آخر نشاط: {new Date(data.lastAccessed).toLocaleDateString('ar-SA')}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لم يتم العثور على بيانات تقدم
          </div>
        )}
      </div>
    </div>
  );
} 