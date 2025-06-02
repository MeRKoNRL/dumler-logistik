import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function GET() {
  const snap = await db.collection('logs').orderBy('timestamp', 'desc').limit(500).get();
  const logs = snap.docs.map(doc => doc.data());

  const doc = new PDFDocument({ margin: 40 });
  const stream = doc.pipe(new Readable({ read() {} }));

  doc.fontSize(16).text('Журнал действий Dumler Logistik', { align: 'center' }).moveDown();

  logs.forEach((l, i) => {
    const time = l.timestamp?.toDate?.().toISOString?.().replace('T', ' ').slice(0, 16) || '';
    doc.fontSize(11).text(`${i + 1}. [${time}] ${l.action} (${l.email || '-'})`);
  });

  doc.end();
  const buffer = await streamToBuffer(stream);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=logs.pdf'
    }
  });
}
