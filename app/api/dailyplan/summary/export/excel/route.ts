import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import ExcelJS from 'exceljs';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

export async function POST(req) {
  const { from, to } = await req.json();
  const snap = await db.collection('daily_plans').get();
  const all = snap.docs.map(doc => doc.data());
  const filtered = all.filter(p => (!from || p.date >= from) && (!to || p.date <= to));

  const allEntries = filtered.flatMap(p => p.entries?.map((e: unknown) => ({ date: p.date, ...e })) || []);

  const wb = new ExcelJS.Workbook();

  const byDay = wb.addWorksheet('По дням');
  const countByDate = allEntries.reduce((acc, cur) => {
    acc[cur.date] = (acc[cur.date] || 0) + 1;
    return acc;
  }, {});
  byDay.columns = [{ header: 'Дата', key: 'date' }, { header: 'Записей', key: 'count' }];
  Object.entries(countByDate).forEach(([date, count]) => {
    byDay.addRow({ date, count });
  });

  const byDriver = wb.addWorksheet('По водителям');
  const countByDriver = allEntries.reduce((acc, cur) => {
    const d = cur.driver || 'неизвестно';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});
  byDriver.columns = [{ header: 'Водитель', key: 'driver' }, { header: 'Записей', key: 'count' }];
  Object.entries(countByDriver).forEach(([driver, count]) => {
    byDriver.addRow({ driver, count });
  });

  const byClient = wb.addWorksheet('По клиентам');
  const countByClient = allEntries.reduce((acc, cur) => {
    const c = cur.client || 'неизвестно';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});
  byClient.columns = [{ header: 'Клиент', key: 'client' }, { header: 'Записей', key: 'count' }];
  Object.entries(countByClient).forEach(([client, count]) => {
    byClient.addRow({ client, count });
  });

  const buffer = await wb.xlsx.writeBuffer();
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=summary.xlsx'
    }
  });
}
