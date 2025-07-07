'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';

interface QuizProps {
  quiz: {
    id: string;
    title: string;
    titleAr: string;
    questions: any[];
  };
  onComplete: (score: number) => void;
}

export default function InstantQuiz({ quiz, onComplete }: QuizProps) {
  const { language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    const correctAnswers = quiz.questions.filter(question => 
      selectedAnswers[question.id] === question.correctAnswerId
    ).length;
    
    const score = (correctAnswers / quiz.questions.length) * 100;
    onComplete(score);
    setShowResults(true);
  };

  if (showResults) {
    const correctAnswers = quiz.questions.filter(question => 
      selectedAnswers[question.id] === question.correctAnswerId
    ).length;
    
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">
          {language === 'ar' ? 'نتيجة الاختبار' : 'Quiz Results'}
        </h2>
        <p className="mb-4">
          {language === 'ar' 
            ? `لقد أجبت على ${correctAnswers} من ${quiz.questions.length} سؤال بشكل صحيح!`
            : `You answered ${correctAnswers} out of ${quiz.questions.length} questions correctly!`}
        </p>
        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            setSelectedAnswers({});
            setShowResults(false);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {language === 'ar' ? 'إعادة الاختبار' : 'Retake Quiz'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {language === 'ar' ? quiz.titleAr : quiz.title}
      </h2>
      
      <div className="mb-4">
        <p className="font-semibold mb-2">
          {language === 'ar' ? currentQuestion.textAr : currentQuestion.text}
        </p>
        <div className="space-y-2">
          {currentQuestion.answers.map((answer: any) => (
            <label
              key={answer.id}
              className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={answer.id}
                checked={selectedAnswers[currentQuestion.id] === answer.id}
                onChange={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                className="mr-2"
              />
              {language === 'ar' ? answer.textAr : answer.text}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!selectedAnswers[currentQuestion.id]}
        className={`px-4 py-2 rounded ${
          selectedAnswers[currentQuestion.id]
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {currentQuestionIndex < quiz.questions.length - 1
          ? (language === 'ar' ? 'التالي' : 'Next')
          : (language === 'ar' ? 'إنهاء' : 'Finish')}
      </button>
    </div>
  );
} 