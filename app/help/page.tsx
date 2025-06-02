'use client';

const sections = {
  driver: [
    'Смотри назначенных клиентов и поездки на /my',
    'Отмечай отпуск и больничный на вкладке "Отгулы"',
    'Следи за статистикой своих поездок',
  ],
  dispatcher: [
    'Планируй день на /dailyplan',
    'Редактируй клиентов и авто',
    'Следи за отчётами и дашбордом',
    'Контролируй SLA и нагрузку',
  ],
  admin: [
    'Управляй пользователями на /adminpanel',
    'Включай и выключай функции на /features',
    'Смотри журнал действий на /auditlog',
    'Настраивай безопасность и мониторинг',
  ],
};

export default function HelpPage() {
  const { user } = useAuth();
  const role = user?.role || 'driver';

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">❓ Центр помощи ({role})</h1>
      <ul className="space-y-3">
        {sections[role].map((tip, i) => (
          <li key={i} className="p-3 border rounded bg-white shadow">{tip}</li>
        ))}
      </ul>
    </main>
  );
}