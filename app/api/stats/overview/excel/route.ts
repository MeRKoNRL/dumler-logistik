import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import ExcelJS from 'exceljs';

export async function POST(req: Request) {
  const { start, end } = await req.json();

  const snap = await getDocs(collection(db, 'maintenance_requests'));
  const all = snap.docs.map(doc => doc.data());
  const filtered = all.filter(r => r.createdAt >= start && r.createdAt <= end + 'T23:59:59');

  const clientCounts: Record<string, number> = {};
  const vehicleCounts: Record<string, number> = {};
  const driverCounts: Record<string, number> = {};

  for (const r of filtered) {
    const c = r.client || 'Без клиента';
    const v = r.vehicle || 'Без авто';
    const e = r.email || 'Без email';
    clientCounts[c] = (clientCounts[c] || 0) + 1;
    vehicleCounts[v] = (vehicleCounts[v] || 0) + 1;
    driverCounts[e] = (driverCounts[e] || 0) + 1;
  }

  const wb = new ExcelJS.Workbook();

  const addSheet = (name: string, data: Record<string, number>) => {
    const sheet = wb.addWorksheet(name);
    sheet.columns = [
      { header: name, key: 'key', width: 30 },
      { header: 'Обращений', key: 'count', width: 15 }
    ];
    Object.entries(data).forEach(([k, v]) => {
      sheet.addRow({ key: k, count: v });
    });
  };

  addSheet('По клиентам', clientCounts);
  addSheet('По авто', vehicleCounts);
  addSheet('По водителям', driverCounts);

  const buffer = await wb.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=overview-report.xlsx'
    }
  });
}
