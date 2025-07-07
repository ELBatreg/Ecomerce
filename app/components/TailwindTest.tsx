export default function TailwindTest() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-blue-500 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Tailwind Test</h2>
        <p className="text-gray-600">If you can see this styled properly, Tailwind is working!</p>
      </div>
    </div>
  );
} 