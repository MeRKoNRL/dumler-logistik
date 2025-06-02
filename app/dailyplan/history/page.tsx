'use client';
import React, { useState, useEffect } from 'react';

export default function HistoryPage() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const db = getFirestore(app);
    const fetchHistory = async () => {
      const history: any[] = [];
      const ref = collection(db, 'plan_history');
      const snapshot = await getDocs(ref);
      snapshot.forEach(doc => {
        history.push({ id: doc.id, ...doc.data() });
      });
      setPlans(history);
    };
    fetchHistory();
  }, []);

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-lg font-bold mb-4">История изменений</h1>
      <ul className="space-y-2 text-sm">
        {plans.map(plan => (
          <li key={plan.id} className="p-3 bg-gray-50 border rounded">
            <div>Дата: {plan.date}</div>
            <div>Количество записей: {plan.entries?.length || 0}</div>
            <div>Время сохранения: {new Date(plan.savedAt?.seconds * 1000).toLocaleString()}</div>
          <button
  className="mt-2 text-blue-600 underline text-xs"
  onClick={async () => {
    const db = getFirestore(app);
    if (!window.confirm('Вы уверены, что хотите откатить эту версию?')) return;
    await setDoc(doc(db, 'daily_plans', plan.date), {
      date: plan.date,
      entries: plan.entries
    });
    toast.success('Откат выполнен');
  }}
>
  Откатить
</button>
</li>
        ))}
      </ul>
    </main>
  );
}