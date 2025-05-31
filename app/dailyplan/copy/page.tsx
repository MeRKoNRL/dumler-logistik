import { useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';

'use client';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { OnlyPermission } from '@/components/Access';

  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && (!user || !['admin', 'dispatcher'].includes(user.role))) {
      router.push('/');
    }
  }, [user, loading]);

export default function CopyPlanPage() {
  const [latest, setLatest] = useState<any>(null);
  const [preserve, setPreserve] = useState({
    name: true,
    tour: true,
    auto: true,
    info: true,
    kunden: false,
    extras: false,
    abhol: false,
  });

  const router = useRouter();
  const db = getFirestore(app);

  useEffect(() => {
    const fetchLatest = async () => {
      const ref = collection(db, 'daily_plans');
      const snap = await getDocs(ref);
      let newest = null;
      snap.forEach(d => {
        if (!newest || d.id > newest.id) newest = d;
      });
      setLatest(newest?.data());
    };
    fetchLatest();
  }, []);

  const handleCopy = async () => {
    if (!latest) return;
    const newDate = new Date().toISOString().split('T')[0];

    const newEntries = latest.entries.map((e: any) => ({
      name: preserve.name ? e.name : '',
      tour: preserve.tour ? e.tour : '',
      auto: preserve.auto ? e.auto : '',
      info: preserve.info ? e.info : '',
      kunden1: preserve.kunden ? e.kunden1 : '',
      kunden2: preserve.kunden ? e.kunden2 : '',
    }));

    await setDoc(doc(db, 'daily_plans', newDate), {
      date: newDate,
      entries: newEntries,
      extras: preserve.extras ? latest.extras || [] : [{},{},{}],
      pickupNotes: preserve.abhol ? latest.pickupNotes || '' : '',
      abholkunden: preserve.abhol ? latest.abholkunden || [] : [],
    });

    toast.success('Скопировано на ' + newDate);
    router.push('/dailyplan');
  };

  return (
    <OnlyPermission permission="dailyplan"><main className="max-w-xl mx-auto p-4 text-sm">
      <h1 className="text-lg font-bold mb-4">Копировать план</h1>
      {latest ? (
        <>
          <p className="mb-2">Выберите, что сохранить из последнего дня:</p>
          <div className="space-y-2 mb-4">
            {Object.entries(preserve).map(([key, val]) => (
              <label key={key} className="block">
                <input
                  type="checkbox"
                  checked={val}
                  onChange={() => setPreserve(p => ({ ...p, [key]: !p[key] }))}
                  className="mr-2"
                />
                {key}
              </label>
            ))}
          </div>
          <button onClick={handleCopy} className="bg-blue-600 text-white px-4 py-1 rounded text-sm">
            Копировать на сегодня
          </button>
        </>
      ) : (
        <p>Загрузка...</p>
      )}
    </main></OnlyPermission>
  );
}
