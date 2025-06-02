'use client';
import React, { useState, useEffect } from 'react';


export default function DailyPlanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const db = getFirestore(app);
  const [date, setDate] = useState('');
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleSave = async () => {
    try {
      const q = query(collection(db, 'daily_plans'), where('date', '==', date));
      const snap = await getDocs(q);
      if (snap.empty) {
        await addDoc(collection(db, 'daily_plans'), { date, entries });
      } else {
        const docId = snap.docs[0].id;
        await updateDoc(doc(db, 'daily_plans', docId), { entries });
      }
      toast.success('План успешно сохранён');
    } catch (error) {
      toast.error('Ошибка сохранения плана');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">План на день</h1>
      <button onClick={handleSave} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Сохранить
      </button>
    </main>
  );
}