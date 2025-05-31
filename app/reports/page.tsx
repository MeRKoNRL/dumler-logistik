import { useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';

'use client';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import jsPDF from 'jspdf';
import dynamic from 'next/dynamic';
const DataTable = dynamic(() => import('@/components/DataTable'));
import autoTable from 'jspdf-autotable';
import { app } from '@/lib/firebase';

  const { user, loading } = useAuth();
  const router = useRouter();
  
  const exportToCsv = () => {
    const headers = ['Водитель', 'Авто', 'Раб. дней', 'Всего клиентов'];
    const rows = summary.map(s => [s.name, s.auto, s.days, s.kunden]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    a.click();
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.text('Отчёт по водителям', 10, 10);
    autoTable(doc, {
      startY: 20,
      head: [['Водитель', 'Авто', 'Раб. дней', 'Клиенты']],
      body: summary.map(s => [s.name, s.auto, s.days, s.kunden])
    });
    doc.save('report.pdf');
  };


  useEffect(() => {
    if (!loading && (!user || !['admin', 'dispatcher'].includes(user.role))) {
      router.push('/');
    }
  }, [user, loading]);

export default function ReportsPage() {
  const [summary, setSummary] = useState<PlanEntry[]>([]);

  
  const exportToCsv = () => {
    const headers = ['Водитель', 'Авто', 'Раб. дней', 'Всего клиентов'];
    const rows = summary.map(s => [s.name, s.auto, s.days, s.kunden]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    a.click();
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.text('Отчёт по водителям', 10, 10);
    autoTable(doc, {
      startY: 20,
      head: [['Водитель', 'Авто', 'Раб. дней', 'Клиенты']],
      body: summary.map(s => [s.name, s.auto, s.days, s.kunden])
    });
    doc.save('report.pdf');
  };


  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      const ref = collection(db, 'daily_plans');
      const snap = await getDocs(ref);
      const all: PlanEntry[] = [];
      snap.forEach(doc => {
        const data = doc.data();
        const date = data.date;
        data.entries?.forEach((e: PlanEntry) => {
          all.push({
            date,
            name: e.name || '',
            auto: e.auto || '',
            kunden: parseInt(e.kunden1 || '0')
          });
        });
      });

      const grouped: Record<string, { total: number; days: Set<string>; auto: string }> = {};
      for (const row of all) {
        const key = row.name;
        if (!key) continue;
        if (!grouped[key]) grouped[key] = { total: 0, days: new Set(), auto: row.auto };
        grouped[key].total += row.kunden;
        grouped[key].days.add(row.date);
      }

      const result = Object.entries(grouped).map(([name, data]) => ({
        name,
        auto: data.auto,
        days: data.days.size,
        kunden: data.total
      }));
      setSummary(result);
    };

    fetchData();
  }, []);

  return (
    <OnlyPermission permission="reports"><main className="max-w-screen-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Отчёты по водителям</h1>
      <div className="mb-4">
        <button onClick={exportToExcel} className="bg-gray-200 px-3 py-1 text-sm mr-2 rounded">Excel</button>
        <button onClick={exportToJson} className="bg-gray-200 px-3 py-1 text-sm mr-2 rounded">JSON</button>
        <button onClick={exportToPdf} className="bg-gray-200 px-3 py-1 text-sm mr-2 rounded">PDF</button>

        <button onClick={exportToCsv} className="bg-gray-200 px-3 py-1 text-sm mr-2 rounded">Экспорт CSV</button>
        <button onClick={exportToPdf} className="bg-gray-200 px-3 py-1 text-sm rounded">Экспорт PDF</button>
      </div>
      <DataTable columns={["name", "auto", "days", "kunden"]} data={summary} />
{/* border w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Водитель</th>
            <th className="border px-2 py-1">Авто</th>
            <th className="border px-2 py-1">Раб. дней</th>
            <th className="border px-2 py-1">Всего клиентов</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((s, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{s.name}</td>
              <td className="border px-2 py-1">{s.auto}</td>
              <td className="border px-2 py-1 text-center">{s.days}</td>
              <td className="border px-2 py-1 text-center">{s.kunden}</td>
            </tr>
          ))}
        </tbody>
      </table>*/
    </main></OnlyPermission>
  );
}
