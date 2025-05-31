'use client';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';

export default function MyProfile() {
  const { user } = useAuth();
  const [packages, setPackages]; const [trips, setTrips] = useState<any[]>([]); const [future, setFuture] = useState<any[]>([]); const [absences, setAbsences] = useState<any>({}) = useState<any[]>([]);

  useEffect(() => {
    const fetchExtra = async () => {
      const db = getFirestore(app);
      const planSnap = await getDocs(collection(db, 'daily_plans'));
      const absSnap = await getDocs(collection(db, 'absences'));

      const name = user?.uid || user?.email;

      const trips: any[] = [];
      const future: any[] = [];
      const today = new Date().toISOString().split('T')[0];

      planSnap.forEach(doc => {
        const d = doc.data();
        const date = d.date;
        if (!d.entries) return;
        d.entries.forEach((e: any) => {
          if (e.name === name || e.assignedTo === name) {
            const record = { date, tour: e.tour, auto: e.auto, kunden: e.kunden1 };
            if (date === today) trips.push({ ...record, today: true });
            else if (date > today) future.push({ ...record });
            else trips.push(record);
          }
        });
      });

      const absMap: Record<string, number> = { отпуск: 0, больничный: 0, отгул: 0 };
      absSnap.forEach(doc => {
        const a = doc.data();
        if (a.userId === name) absMap[a.type] += 1;
      });

      setTrips(trips);
      setFuture(future);
      setAbsences(absMap);
    };

    fetchExtra();
    if (!user) return;
    const fetchData = async () => {
      const db = getFirestore(app);
      const ref = collection(db, 'lost_packages');
      const q = query(ref, where('driverId', '==', user.uid));
      const snap = await getDocs(q);
      const lost: any[] = [];
      snap.forEach(doc => lost.push(doc.data()));
      setPackages(lost);
    };
    fetchData();
  }, [user]);

  const total = packages.reduce((sum, p) => sum + (p.cost || 0), 0);

  return (
    <main className="max-w-screen-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-2">Моя информация</h1>
      <p className="mb-4 text-sm">Водитель: {user?.email}</p>

      <div className="mb-4">
        <h2 className="font-semibold text-sm">Пропавшие посылки</h2>
        <p>Всего: {packages.length}</p>
        <p>Общая стоимость: {total} €</p>
      </div>

      <table className="table-auto border w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Дата</th>
            <th className="border px-2 py-1">Описание</th>
            <th className="border px-2 py-1">Стоимость (€)</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((p, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{p.date}</td>
              <td className="border px-2 py-1">{p.note}</td>
              <td className="border px-2 py-1">{p.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    
      <div className="mt-6 mb-4 border-t pt-4">
        <h2 className="font-semibold text-sm mb-2">
      <div className="mt-6">
        <h2 className="font-semibold text-sm mb-2">Сегодня</h2>
        <ul className="text-sm list-disc pl-4">
          {trips.filter(t => t.today).map((t, i) => (
            <li key={i}>{t.date}: Тур {t.tour}, {t.kunden} клиентов, авто {t.auto}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold text-sm mb-2">Будущие поездки</h2>
        <ul className="text-sm list-disc pl-4">
          {future.map((t, i) => (
            <li key={i}>{t.date}: Тур {t.tour}, авто {t.auto}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold text-sm mb-2">История поездок</h2>
        <ul className="text-sm list-disc pl-4">
          {trips.filter(t => !t.today && t.date < new Date().toISOString().split('T')[0]).map((t, i) => (
            <li key={i}>{t.date}: Тур {t.tour}, {t.kunden} клиентов, авто {t.auto}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold text-sm mb-2">Остатки отпусков и отгулов</h2>
        <p className="text-sm">Отпусков: {absences['отпуск'] || 0}</p>
        <p className="text-sm">Больничных: {absences['больничный'] || 0}</p>
        <p className="text-sm">Отгулов: {absences['отгул'] || 0}</p>
      </div>
    </main>