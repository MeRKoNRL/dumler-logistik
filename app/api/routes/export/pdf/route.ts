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

export async function GET() {
  const snap = await getDocs(collection(db, 'routes'));
  const routes = snap.docs.map(doc => doc.data());

  const doc = new PDFDocument();
  const stream = doc.pipe(new Readable({ read() {} }));

  doc.fontSize(16).text('Маршруты Dumler Logistik', { align: 'center' }).moveDown();

  routes.forEach((r, i) => {
    doc.fontSize(12).text(`${i + 1}. ${r.date} | ${r.email} | ${r.vehicle} → ${r.client}`);
    if (r.cargo) doc.text(`    ${r.cargo}`);
    doc.moveDown(0.5);
  });

  doc.end();
  const buffer = await streamToBuffer(stream);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=routes.pdf'
    }
  });
}
