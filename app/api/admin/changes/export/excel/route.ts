import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import ExcelJS from 'exceljs';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

export async function GET() {
  const snap = await db.collection('changes').orderBy('timestamp', 'desc').limit(500).get();
  const logs = snap.docs.map(doc => doc.data());

  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet('История изменений');
  sheet.columns = [
    { header: 'Дата', key: 'timestamp', width: 25 },
    { header: 'Пользователь', key: 'who', width: 25 },
    { header: 'Коллекция', key: 'collection', width: 20 },
    { header: 'Документ', key: 'docId', width: 25 },
    { header: 'Поле', key: 'field', width: 15 },
    { header: 'Старое значение', key: 'oldValue', width: 30 },
    { header: 'Новое значение', key: 'newValue', width: 30 }
  ];

  logs.forEach(l => {
    sheet.addRow({
      timestamp: l.timestamp?.toDate?.().toISOString?.() ?? '',
      who: l.who,
      collection: l.collection,
      docId: l.docId,
      field: l.field,
      oldValue: String(l.oldValue ?? ''),
      newValue: String(l.newValue ?? ''),
    });
  });

  const buffer = await wb.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=changes.xlsx'
    }
  });
}
