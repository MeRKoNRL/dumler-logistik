import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import ExcelJS from 'exceljs';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

export async function POST(req) {
  const { driver, vehicle, client } = await req.json();

  const snap = await db.collection('daily_plans').get();
  const all = snap.docs.map(doc => doc.data());

  const filtered = all.flatMap((p: unknown) =>
    (p.entries || []).filter((e: unknown) =>
      (!driver || (e.driver || '').toLowerCase().includes(driver.toLowerCase())) &&
      (!vehicle || (e.vehicle || '').toLowerCase().includes(vehicle.toLowerCase())) &&
      (!client || (e.client || '').toLowerCase().includes(client.toLowerCase()))
    ).map((e: unknown) => ({ date: p.date, ...e }))
  );

  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet('План');

  sheet.columns = [
    { header: 'Дата', key: 'date', width: 15 },
    { header: 'Водитель', key: 'driver', width: 20 },
    { header: 'Машина', key: 'vehicle', width: 20 },
    { header: 'Клиент', key: 'client', width: 25 },
    { header: 'Маршрут', key: 'route', width: 30 },
    { header: 'Груз', key: 'cargo', width: 15 },
    { header: 'Статус', key: 'status', width: 15 },
  ];

  filtered.forEach(row => sheet.addRow(row));

  const buffer = await wb.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=filtered_plans.xlsx'
    }
  });
}
