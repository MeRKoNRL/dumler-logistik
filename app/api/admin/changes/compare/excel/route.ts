import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import ExcelJS from 'exceljs';
import { parseISO } from 'date-fns';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

function countByField(entries, field) {
  const map = {};
  entries.forEach((e) => {
    const key = e[field] || 'неизвестно';
    map[key] = (map[key] || 0) + 1;
  });
  return map;
}

export async function POST(req) {
  const { fromA, toA, fromB, toB } = await req.json();

  const snap = await db.collection('changes').orderBy('timestamp', 'desc').limit(1000).get();
  const data = snap.docs.map(doc => doc.data());

  const filterSet = data.filter(c => {
    const d = c.timestamp?.toDate?.();
    return (!fromA || d >= parseISO(fromA)) && (!toA || d <= parseISO(toA + 'T23:59:59'));
  });

  const compareSet = data.filter(c => {
    const d = c.timestamp?.toDate?.();
    return (!fromB || d >= parseISO(fromB)) && (!toB || d <= parseISO(toB + 'T23:59:59'));
  });

  const usersA = countByField(filterSet, 'who');
  const usersB = countByField(compareSet, 'who');
  const users = Array.from(new Set([...Object.keys(usersA), ...Object.keys(usersB)]));

  const collectionsA = countByField(filterSet, 'collection');
  const collectionsB = countByField(compareSet, 'collection');
  const collections = Array.from(new Set([...Object.keys(collectionsA), ...Object.keys(collectionsB)]));

  const wb = new ExcelJS.Workbook();

  const sheet1 = wb.addWorksheet('Пользователи');
  sheet1.columns = [
    { header: 'Email', key: 'user', width: 30 },
    { header: 'Текущий период', key: 'current', width: 20 },
    { header: 'Сравнение', key: 'previous', width: 20 },
    { header: 'Разница', key: 'diff', width: 15 }
  ];
  users.forEach(u => {
    const curr = usersA[u] || 0;
    const prev = usersB[u] || 0;
    sheet1.addRow({ user: u, current: curr, previous: prev, diff: curr - prev });
  });

  const sheet2 = wb.addWorksheet('Коллекции');
  sheet2.columns = [
    { header: 'Коллекция', key: 'collection', width: 30 },
    { header: 'Текущий период', key: 'current', width: 20 },
    { header: 'Сравнение', key: 'previous', width: 20 },
    { header: 'Разница', key: 'diff', width: 15 }
  ];
  collections.forEach(c => {
    const curr = collectionsA[c] || 0;
    const prev = collectionsB[c] || 0;
    sheet2.addRow({ collection: c, current: curr, previous: prev, diff: curr - prev });
  });

  const buffer = await wb.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=comparison.xlsx'
    }
  });
}
