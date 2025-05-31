'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Log {
  email: string;
  action: string;
  time: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filtered, setFiltered] = useState<Log[]>([]);
  const [emailFilter, setEmailFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(query(collection(db, 'logs'), orderBy('time', 'desc')));
      const data = snap.docs.map(doc => doc.data() as Log);
      setLogs(data);
      setFiltered(data);
    };
    load();
  }, []);

  useEffect(() => {
    let result = logs;
    if (emailFilter) {
      result = result.filter(l => l.email.toLowerCase().includes(emailFilter.toLowerCase()));
    }
    if (startDate) {
      result = result.filter(l => l.time >= startDate);
    }
    if (endDate) {
      result = result.filter(l => l.time <= endDate + 'T23:59:59');
    }
    setFiltered(result);
  }, [emailFilter, startDate, endDate, logs]);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <main className="p-4 max-w-5xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Журнал событий</h1>
        <div className="mb-4 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Поиск по email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
          <a href="/api/logs/export/excel" className="bg-green-600 text-white px-3 py-1 rounded">📥 Excel</a>
          <a href="/api/logs/export/pdf" className="bg-red-600 text-white px-3 py-1 rounded">📄 PDF</a>
        </div>
        <ul>
          {filtered.map((log, i) => (
            <li key={i} className="mb-2 border p-2 rounded">
              <div><strong>{log.email}</strong></div>
              <div>{log.action}</div>
              <div className="text-xs text-gray-500">{log.time}</div>
            </li>
          ))}
        </ul>
      </main>
    </ProtectedRoute>
  );
}
