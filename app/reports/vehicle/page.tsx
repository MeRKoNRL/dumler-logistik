'use client';
import React, { useState, useEffect } from 'react';


export default function ReportClient() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [data, setData] = useState<any>(null);

  const load = async () => {
    const res = await fetch('/api/stats/vehicle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start, end })
    });
    const json = await res.json();
    setData(json);
  };

  return (
    <ProtectedRoute allowedRoles={['dispatcher', 'admin']}>
      <main className="p-4 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Отчёт по автомобилям</h1>
        <div className="flex gap-4 mb-4">
          <input type="date" value={start} onChange={e => setStart(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="border p-2 rounded" />
          <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded">📊 Показать</button>
        </div>
        {data && (
          <>
            <p className="mb-2">Всего: <strong>{data.total}</strong></p>
            <ul>
              {Object.entries(data.counts).map(([k, v]) => (
                <li key={k}>{k}: <strong>{v}</strong></li>
              ))}
            </ul>
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}