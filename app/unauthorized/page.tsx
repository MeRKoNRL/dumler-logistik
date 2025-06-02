'use client';

export default function Unauthorized() {
  return (
    <main className="p-4" className='max-w-xl mx-auto p-4 space-y-4 text-sm'>
      <h1 className="text-xl font-bold text-red-600">Доступ запрещён</h1>
      <p>У вас нет прав для просмотра этой страницы.</p>
    </main>
  );
}