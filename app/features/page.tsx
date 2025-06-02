'use client';
import React, { useState, useEffect } from 'react';

const featureList = [
  { key: 'filters', label: 'Фильтры по дате и пользователю' },
  { key: 'notifications', label: 'Уведомления и напоминания' },
  { key: 'sentry', label: 'Sentry мониторинг' },
  { key: 'csvExport', label: 'Экспорт в CSV' },
  { key: 'auditLog', label: 'Журнал действий' },
];

export default function FeaturesPage() {
  const { user } = useAuth();
  const canToggle = hasPermission(user?.role || 'driver', 'canToggleFeatures');
  if (!canToggle) return <div className="p-6 text-red-600">Нет доступа</div>;

  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    filters: true,
    notifications: true,
    sentry: true,
    csvExport: true,
    auditLog: true,
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">⚙️ Управление функциями</h1>
      <ul className="space-y-4">
        {featureList.map(f => (
          <li key={f.key} className="flex justify-between items-center border p-4 rounded">
            <div>{f.label}</div>
            <input
              type="checkbox"
              checked={enabled[f.key]}
              onChange={e => setEnabled({ ...enabled, [f.key]: e.target.checked })}
              className="w-5 h-5"
            />
          </li>
        ))}
      </ul>
    </main>
  );
}