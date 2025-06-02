'use client';
import React, { useState, useEffect } from 'react';

export default function MyProfile() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [future, setFuture] = useState<any[]>([]);
  const [absences, setAbsences] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchExtra = async () => {
      const db = getFirestore(app);
      const planSnap = await getDocs(collection(db, 'daily_plans'));
      const absSnap = await getDocs(collection(db, 'absences'));

      const name = user?.uid || user?.email || '';

      const tripsData: any[] = [];
      const futureData: any[] = [];
      const today = new Date().toISOString().split('T')[0];

      planSnap.forEach(doc => {
        const d = doc.data();
        const date = d.date;
        if (!d.entries) return;
        d.entries.forEach((e: any) => {
          if (e.name === name || e.assignedTo === name) {
            const record = { date, tour: e.tour, auto: e.auto, kunden: e.kunden1 };
            if (date === today) tripsData.push({ ...record, today: true });
            else if (date > today) futureData.push({ ...record });
            else tripsData.push(record);
          }
        });
      });

      const absMap: Record<string, number> = { отпуск: 0, больничный: 0, отгул: 0 };
      absSnap.forEach(doc => {
        const a = doc.data();
        if (a.userId === name && absMap[a.type] !== undefined) absMap[a.type] += 1;
      });

      setTrips(tripsData);
      setFuture(futureData);
      setAbsences(absMap);
    };

    const fetchPackages = async () => {
      const db = getFirestore(app);
      const ref = collection(db, 'lost_packages');
      const q = query(ref, where('driverId', '==', user?.uid || ''));
      const snap = await getDocs(q);
      const lost: any[] = [];
      snap.forEach(doc => lost.push(doc.data()));
      setPackages(lost);
    };

    if (user) {
      fetchExtra();
      fetchPackages();
    }
  }, [user]);

  return (
    <main className="px-4 py-6 sm:px-6 max-w-3xl mx-auto max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Личный кабинет</h1>

      <section>
        <h2 className="text-lg font-medium">Клиенты на сегодня</h2>
        <ul className="list-disc ml-5">
          {trips.filter(t => t.today).map((t, i) => (
            <li key={i}>{t.kunden} ({t.tour}, {t.auto})</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium">История поездок</h2>
        <ul className="list-disc ml-5">
          {trips.filter(t => !t.today).map((t, i) => (
            <li key={i}>{t.date}: {t.tour} ({t.auto})</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium">Будущие поездки</h2>
        <ul className="list-disc ml-5">
          {future.map((t, i) => (
            <li key={i}>{t.date}: {t.tour} ({t.auto})</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium">Оставшиеся дни</h2>
        <p>Отпуск: {absences['отпуск'] ?? 0}</p>
        <p>Отгул: {absences['отгул'] ?? 0}</p>
        <p>Больничный: {absences['больничный'] ?? 0}</p>
      </section>

      <section>
        <h2 className="text-lg font-medium">Пропавшие посылки</h2>
        <ul className="list-disc ml-5">
          {packages.map((p, i) => (
            <li key={i}>{p.title} — {p.price}€ ({p.comment})</li>
          ))}
        </ul>
      </section>
    </main>
  );
}