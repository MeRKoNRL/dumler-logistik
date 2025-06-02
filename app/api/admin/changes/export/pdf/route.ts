import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function GET() {
  const snap = await db.collection('changes').orderBy('timestamp', 'desc').limit(500).get();
  const logs = snap.docs.map(doc => doc.data());

  const doc = new PDFDocument({ margin: 40 });
  const stream = new Readable({ read() {} });
  doc.pipe(stream);

  doc.fontSize(16).text('История изменений', { align: 'center' }).moveDown();

  logs.forEach((l, i) => {
    const date = l.timestamp?.toDate?.().toISOString?.().slice(0, 19).replace('T', ' ') ?? '';
    doc.fontSize(11).text(`${i + 1}. [${date}] ${l.who} → ${l.collection}/${l.docId} : ${l.field} = "${l.oldValue}" → "${l.newValue}"`);
  });

  doc.end();
  const buffer = await streamToBuffer(stream);
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=changes.pdf'
    }
  });
}
