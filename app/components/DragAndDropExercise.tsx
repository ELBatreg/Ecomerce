'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';

interface DragAndDropExerciseProps {
  exercise: {
    id: string;
    title: string;
    titleAr: string;
    content: any;
  };
}

export default function DragAndDropExercise({ exercise }: DragAndDropExerciseProps) {
  const { language } = useLanguage();
  const [blocks, setBlocks] = useState<any[]>([]);
  const [targetAreas, setTargetAreas] = useState<any[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize exercise data
    if (exercise.content) {
      setBlocks(exercise.content.blocks || []);
      setTargetAreas(exercise.content.targetAreas || []);
    }
  }, [exercise]);

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData('blockId', blockId);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData('blockId');
    
    // Update the target area with the dropped block
    setTargetAreas(prev => 
      prev.map(area => 
        area.id === targetId 
          ? { ...area, blockId }
          : area
      )
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const checkSolution = () => {
    const isSolutionCorrect = targetAreas.every(area => 
      area.correctBlockId === area.blockId
    );
    setIsCorrect(isSolutionCorrect);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {language === 'ar' ? exercise.titleAr : exercise.title}
      </h2>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">
          {language === 'ar' ? 'الكتل البرمجية' : 'Code Blocks'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {blocks.map(block => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, block.id)}
              className="p-2 bg-blue-100 rounded cursor-move"
            >
              {language === 'ar' ? block.textAr : block.text}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">
          {language === 'ar' ? 'منطقة الهدف' : 'Target Area'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {targetAreas.map(area => (
            <div
              key={area.id}
              onDrop={(e) => handleDrop(e, area.id)}
              onDragOver={handleDragOver}
              className="p-4 border-2 border-dashed border-gray-300 rounded min-h-[100px]"
            >
              {area.blockId && (
                <div className="p-2 bg-blue-100 rounded">
                  {blocks.find(b => b.id === area.blockId)?.text}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={checkSolution}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {language === 'ar' ? 'تحقق من الحل' : 'Check Solution'}
      </button>

      {isCorrect !== null && (
        <div className={`mt-4 p-2 rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isCorrect
            ? (language === 'ar' ? 'حل صحيح! أحسنت!' : 'Correct solution! Well done!')
            : (language === 'ar' ? 'حل غير صحيح. حاول مرة أخرى!' : 'Incorrect solution. Try again!')}
        </div>
      )}
    </div>
  );
} 