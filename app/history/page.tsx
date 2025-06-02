'use client';
import React, { useState, useEffect } from 'react';


export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries([{ id: 1, text: 'Пример истории' }]);
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">История</h1>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>{entry.text}</li>
        ))}
      </ul>
    </main>
  );
}