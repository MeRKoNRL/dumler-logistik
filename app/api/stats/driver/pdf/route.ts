import { getDocs, collection, query, where } from 'firebase/firestore';
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
  const { email, start, end } = await req.json();

  const q = query(collection(db, 'maintenance_requests'), where('email', '==', email));
  const snap = await getDocs(q);
  const all = snap.docs.map(doc => doc.data());
  const filtered = all.filter(r => r.createdAt >= start && r.createdAt <= end + 'T23:59:59');

  const doc = new PDFDocument();
  const stream = doc.pipe(new Readable({ read() {} }));

  doc.fontSize(16).text('Отчёт по обращениям водителя', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Водитель: ${email}`);
  doc.text(`Период: ${start} — ${end}`);
  doc.moveDown();

  const total = filtered.length;
  doc.text(`Всего обращений: ${total}`);
  const types: Record<string, number> = {};
  for (const r of filtered) {
    types[r.type] = (types[r.type] || 0) + 1;
  }

  for (const [type, count] of Object.entries(types)) {
    doc.text(`${type}: ${count}`);
  }

  doc.end();
  const buffer = await streamToBuffer(stream);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=driver-report.pdf'
    }
  });
}
