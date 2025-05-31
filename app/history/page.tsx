import { useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';

'use client';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';

  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && (!user || !['admin', 'dispatcher'].includes(user.role))) {
      router.push('/');
    }
  }, [user, loading]);

export default function HistoryPage() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const db = getFirestore(app);
      const snap = await getDocs(collection(db, 'plan_history'));
      const data: any[] = [];
      snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.savedAt?.seconds - a.savedAt?.seconds);
      setRecords(data);
    };
    fetchHistory();
  }, []);

  return (
    <OnlyPermission permission="history"><main className="max-w-screen-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">История изменений</h1>
      <ul className="text-sm space-y-2">
        {records.map((r, i) => (
          <li key={i} className="border p-2">
            <strong>{r.date}</strong> — сохранено {new Date((r.savedAt?.seconds || 0) * 1000).toLocaleString()}
            <br />
            Записей: {r.entries?.length || 0}
          </li>
        ))}
      </ul>
    </main></OnlyPermission>
  );
}
