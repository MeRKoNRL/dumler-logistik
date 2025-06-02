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

export async function GET(request: Request) {
  const today = new Date().toISOString().slice(0, 10); // формат: "2025-06-01"
  const snap = await db.collection('dailyplan').where('date', '==', today).get();
  const entries = snap.docs.map(doc => doc.data());

  const doc = new PDFDocument({ margin: 40 });
  const stream = new Readable({ read() {} });
  doc.pipe(stream);

  doc.fontSize(16).text(`Дневной план на ${today}`, { align: 'center' }).moveDown();

  entries.forEach((entry: any, i: number) => {
    const line = `${i + 1}. ${entry.name || '-'} | ${entry.tour || '-'} | ${entry.auto || '-'} | ${entry.info || ''} | K1: ${entry.kunden1 || ''} | K2: ${entry.kunden2 || ''}`;
    doc.fontSize(11).text(line);
  });

  doc.end();
  const buffer = await streamToBuffer(stream);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="dailyplan.pdf"',
    },
  });
}