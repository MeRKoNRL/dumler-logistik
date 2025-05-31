'use client';
import { PlanEntry, useEffect, useState } from 'react';
import { PlanEntry, getFirestore, collection, getDocs } from 'firebase/firestore';
import { PlanEntry, app } from '@/lib/firebase';

export default function DashboardPage() {
  const [dailyStats, setDailyStats] = useState<Record<string, number>>({});
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [driverTotals, setDriverTotals] = useState<Record<string, number>>({});
  const [autoTotals, setAutoTotals] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);

      const plansSnap = await getDocs(collection(db, 'daily_plans'));
      const absenceSnap = await getDocs(collection(db, 'absences'));

      const daily: Record<string, number> = {};
      const driverMap: Record<string, number> = {};
      const autoMap: Record<string, number> = {};

      const status: Record<string, string> = {};

      absenceSnap.forEach(doc => {
        const a = doc.data();
        const from = new Date(a.startDate);
        const to = new Date(a.endDate);
        for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
          const key = d.toISOString().split('T')[0];
          status[\`\${a.userId}_\${key}\`] = a.type;
        }
      });

      plansSnap.forEach(doc => {
        const { date, entries } = doc.data();
        if (!Array.isArray(entries)) return;
        entries.forEach((e: any) => {
          const count = parseInt(e.kunden1 || '0');
          if (!daily[date]) daily[date] = 0;
          daily[date] += count;

          if (e.name) {
            if (!driverMap[e.name]) driverMap[e.name] = 0;
            driverMap[e.name] += count;
          }

          if (e.auto) {
            if (!autoMap[e.auto]) autoMap[e.auto] = 0;
            autoMap[e.auto] += count;
          }
        });
      });

      setDailyStats(daily);
      setDriverTotals(driverMap);
      setAutoTotals(autoMap);
      setStatusMap(status);
    };

    fetchData();
  }, []);

  return (
    <main className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Дашборд активности</h1>

      <div className="mb-6">
        <h2 className="font-semibold">Клиенты по дням:</h2>
        <ul className="text-sm list-disc pl-4">
          {Object.entries(dailyStats).sort().map(([date, count]) => (
            <li key={date}>{date}: {count}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold">Водители:</h2>
        <ul className="text-sm list-disc pl-4">
          {Object.entries(driverTotals).sort().map(([name, total]) => (
            <li key={name}>{name}: {total}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold">Автомобили:</h2>
        <ul className="text-sm list-disc pl-4">
          {Object.entries(autoTotals).sort().map(([auto, total]) => (
            <li key={auto}>{auto}: {total}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
