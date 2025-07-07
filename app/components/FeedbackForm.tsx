'use client';

import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FeedbackFormProps {
  courseId: string;
  lessonId?: string;
  receiverId: string;
  onFeedbackSubmitted?: () => void;
}

export function FeedbackForm({ courseId, lessonId, receiverId, onFeedbackSubmitted }: FeedbackFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          courseId,
          lessonId,
          receiverId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast({
        title: "تم إرسال الملاحظات",
        description: "تم إرسال ملاحظاتك بنجاح",
      });

      setContent('');
      onFeedbackSubmitted?.();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الملاحظات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="feedback" className="text-sm font-medium text-gray-700">
          الملاحظات
        </label>
        <Textarea
          id="feedback"
          placeholder="اكتب ملاحظاتك هنا..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading || !content.trim()}
        className="w-full"
      >
        {loading ? 'جاري الإرسال...' : 'إرسال الملاحظات'}
      </Button>
    </form>
  );
} 