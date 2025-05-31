'use client';

import { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import ProtectedRoute from '@/components/ProtectedRoute';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RoutesReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'routes'));
      const items = snap.docs.map(doc => doc.data());
      const map: Record<string, number> = {};
      for (const r of items) {
        if (r.date) {
          map[r.date] = (map[r.date] || 0) + 1;
        }
      }
      const chart = Object.entries(map)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
      setData(chart);
    })();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['admin', 'dispatcher']}>
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">📈 Активность маршрутов по дням</h1>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#0070f3" />
          </BarChart>
        </ResponsiveContainer>
      </main>
    </ProtectedRoute>
  );
}
