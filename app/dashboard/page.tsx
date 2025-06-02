'use client';
import React, { useState, useEffect } from 'react';


export default function DashboardPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const daily = { '2024-01-01': 10 };
    const result = Object.entries(daily).map(([date, value]) => ({ date, value }));
    setData(result);
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Дашборд</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}