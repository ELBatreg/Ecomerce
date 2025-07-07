'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function AddCoursePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'BEGINNER',
    price: '0',
    duration: '',
    categoryId: '',
    image: null as File | null
  });

  // Check if user is authorized
  if (!session || (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN')) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Minimal frontend check for required fields
    if (!formData.title || !formData.description || !formData.level || !formData.price || !formData.duration || !formData.image) {
      setError('يرجى تعبئة جميع الحقول المطلوبة');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'image' && value) {
          formDataToSend.append('image', value);
        } else if (key === 'price') {
          formDataToSend.append(key, parseFloat(value as string).toString());
        } else if (key === 'duration') {
          formDataToSend.append(key, parseInt(value as string).toString());
        } else {
          // Always send a string, never null or undefined
          formDataToSend.append(key, value != null ? value as string : '');
        }
      });

      const response = await fetch('/api/courses', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        // Show backend validation error details if available
        if (data.details && Array.isArray(data.details)) {
          setError(data.details.map((d: any) => d.message).join(', '));
        } else {
          setError(data.error || data.details || 'Failed to create course');
        }
        setLoading(false);
        return;
      }

      setSuccess('تم إضافة الدورة بنجاح! جاري التحويل...');
      setTimeout(() => {
        router.push('/dashboard/courses');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">إضافة دورة جديدة</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-500 p-4 rounded-md mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان الدورة
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full"
              placeholder="أدخل عنوان الدورة"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف الدورة
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full"
              placeholder="أدخل وصف الدورة"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المستوى
            </label>
            <Select
              value={formData.level}
              onValueChange={(value) => handleSelectChange('level', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر المستوى" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">مبتدئ</SelectItem>
                <SelectItem value="INTERMEDIATE">متوسط</SelectItem>
                <SelectItem value="ADVANCED">متقدم</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              السعر
            </label>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="w-full"
              placeholder="أدخل سعر الدورة"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المدة (بالدقائق)
            </label>
            <Input
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              className="w-full"
              placeholder="أدخل مدة الدورة بالدقائق"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورة الدورة
            </label>
            <Input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'جاري الإضافة...' : 'إضافة الدورة'}
          </Button>
        </form>
      </Card>
    </div>
  );
} 