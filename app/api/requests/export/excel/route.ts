import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import ExcelJS from 'exceljs';

export async function GET() {
  const snap = await getDocs(collection(db, 'maintenance_requests'));
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Заявки');

  sheet.columns = [
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Тип', key: 'type', width: 15 },
    { header: 'Описание', key: 'description', width: 15 },
    { header: '—', key: 'skip', width: 30 },
    { header: 'Создано', key: 'createdAt', width: 25 },
    { header: 'Одобрено', key: 'approved', width: 10 }
  ];

  snap.docs.forEach(doc => {
    const d = doc.data();
    sheet.addRow({ ...d, skip: '' });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=maintenance_requests.xlsx'
    }
  });
}
