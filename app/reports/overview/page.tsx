'use client';
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { logAction } from '@/lib/logger';

export default function ReportOverview() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [data, setData] = useState<any>({});

  const stats = ['drivers', 'autos', 'kunden'];

  const loadAll = async () => {
    const results: any = {};
    for (const type of stats) {
      const res = await fetch(`/api/stats/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start, end }),
      });
      results[type] = await res.json();
    }
    setData(results);
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Сводный отчёт</h1>
        <button onClick={loadAll} className="bg-blue-500 text-white px-4 py-2 mb-4 rounded">Загрузить</button>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </main>
    </ProtectedRoute>
  );
}
