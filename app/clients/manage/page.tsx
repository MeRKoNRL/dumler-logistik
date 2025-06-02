'use client';


export default function ManageClientsPage() {
  const features = useFeatures();
  if (features['clients'] === false) {
    return (
      <main className='max-w-xl mx-auto p-4 space-y-4 text-sm'>
        ⛔ Функция отключена администратором
      </main>
    );
  }

  return (
    <main className='p-4'>
      <h1>Управление клиентами</h1>
      {/* Здесь может быть форма или таблица */}
    </main>
  );
}