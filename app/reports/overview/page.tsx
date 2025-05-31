'use client';

import { useEffect, useState } from 'react';
import { logAction } from '@/lib/logger';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ReportOverview() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [data, setData] = useState<any>({});

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
        <div className="flex gap-4 mb-4">
          <a href="#" onClick={() => {
            fetch('/api/stats/overview/excel', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ start, end })
            })
            .then(res => res.blob().catch(err => console.error('Ошибка при выполнении:', err)))
            .then(async blob => {
              await logAction('Экспорт в Excel');
              const url = window.URL.createObjectURL(blob);
