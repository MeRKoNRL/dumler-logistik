import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import ExcelJS from 'exceljs';

export async function GET() {
  const snap = await getDocs(collection(db, 'vacations'));
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Отпуска');

  sheet.columns = [
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Начало', key: 'start', width: 15 },
    { header: 'Конец', key: 'end', width: 15 },
    { header: 'Причина', key: 'reason', width: 30 },
    { header: 'Создано', key: 'createdAt', width: 25 },
    { header: 'Одобрено', key: 'approved', width: 10 }
  ];

  snap.docs.forEach(doc => {
    const d = doc.data();
    sheet.addRow({ ...d, approved: d.approved ? 'Да' : 'Нет' });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=vacations.xlsx'
    }
  });
}
