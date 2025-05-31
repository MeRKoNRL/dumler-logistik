import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import ExcelJS from 'exceljs';

export async function GET() {
  try {
    const snap = await getDocs(query(collection(db, 'logs'), orderBy('time', 'desc')));
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Логи');

    sheet.columns = [
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Действие', key: 'action', width: 50 },
      { header: 'Время', key: 'time', width: 30 }
    ];

    snap.docs.forEach(doc => {
      const { email, action, time } = doc.data();
      sheet.addRow({ email, action, time });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=logs.xlsx'
      }
    });
  } catch (err) {
    return Response.json({ error: err.toString() }, { status: 500 });
  }
}
