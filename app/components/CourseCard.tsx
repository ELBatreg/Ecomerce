import Image from 'next/image';
import Link from 'next/link';
import { Card } from "@/components/ui/card";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  author: string;
  price: number;
  duration: string;
  level: string;
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'BEGINNER':
      return 'bg-green-100 text-green-800';
    case 'INTERMEDIATE':
      return 'bg-yellow-100 text-yellow-800';
    case 'ADVANCED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MDAgMjUwQzQwMCAyNTAgNDAwIDI1MCA0MDAgMjUwQzQwMCAyNTAgNDAwIDI1MCA0MDAgMjUwQzQwMCAyNTAgNDAwIDI1MCA0MDAgMjUwQzQwMCAyNTAgNDAwIDI1MCA0MDAgMjUwWiIgZmlsbD0iI0Q1RDZEQiIvPgo8dGV4dCB4PSI0MDAiIHk9IjMwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZCN0NCNCIgPgpDb3Vyc2UgSW1hZ2UKPC90ZXh0Pgo8L3N2Zz4=';

export function CourseCard({
  id,
  title,
  description,
  image,
  author,
  price,
  duration,
  level,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <Card className="group relative overflow-hidden rounded-lg transition-all hover:shadow-lg">
        {/* Free Course Badge */}
        {price === 0 && (
          <div className="absolute left-2 top-2 z-10 rounded-full bg-green-500 px-3 py-1 text-sm font-semibold text-white">
            مجاني
          </div>
        )}
        
        <div className="aspect-video relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-xl font-bold">{title}</h3>
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{duration}</span>
              <span>•</span>
              <span>{level}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-bold text-indigo-600">
              {price === 0 ? 'مجاني' : `${price} ج.م`}
            </div>
            <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
              ابدأ التعلم
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
} 