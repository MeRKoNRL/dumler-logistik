import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import ExcelJS from 'exceljs';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

export async function GET() {
  const snap = await db.collection('logs').orderBy('timestamp', 'desc').limit(500).get();
  const logs = snap.docs.map(doc => doc.data());

  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet('Журнал действий');
  sheet.columns = [
    { header: 'Дата', key: 'timestamp', width: 25 },
    { header: 'Событие', key: 'action', width: 50 },
    { header: 'Пользователь', key: 'email', width: 30 },
  ];

  logs.forEach(l => {
    sheet.addRow({
      timestamp: l.timestamp?.toDate?.().toISOString?.() ?? '',
      action: l.action ?? '',
      email: l.email ?? '',
    });
  });

  const buffer = await wb.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=logs.xlsx'
    }
  });
}
