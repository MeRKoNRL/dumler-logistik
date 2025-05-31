import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

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

  const doc = new PDFDocument();
  const stream = doc.pipe(new Readable({ read() {} }));

  doc.fontSize(16).text('Сводный отчёт Dumler Logistik', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Период: ${start} — ${end}`);
  doc.moveDown();

  const section = (title: string, data: Record<string, number>) => {
    doc.fontSize(13).text(title).moveDown(0.5);
    for (const [k, v] of Object.entries(data)) {
      doc.text(`${k}: ${v}`);
    }
    doc.moveDown();
  };

  section('По клиентам', clientCounts);
  section('По автомобилям', vehicleCounts);
  section('По водителям', driverCounts);

  doc.end();
  const buffer = await streamToBuffer(stream);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=overview-report.pdf'
    }
  });
}
