import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import ExcelJS from 'exceljs';

export async function GET() {
  const snap = await getDocs(collection(db, 'routes'));
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Маршруты');

  sheet.columns = [
    { header: 'Дата', key: 'date', width: 15 },
    { header: 'Водитель', key: 'email', width: 30 },
    { header: 'Клиент', key: 'client', width: 25 },
    { header: 'Автомобиль', key: 'vehicle', width: 20 },
    { header: 'Описание', key: 'cargo', width: 40 },
  ];

  snap.docs.forEach(doc => sheet.addRow(doc.data()));

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=routes.xlsx'
    }
  });
}
