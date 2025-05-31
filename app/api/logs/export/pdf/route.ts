import { getDocs, collection, query, orderBy } from 'firebase/firestore';
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
  try {
    const snap = await getDocs(query(collection(db, 'logs'), orderBy('time', 'desc')));
    const doc = new PDFDocument();
    const stream = doc.pipe(new Readable({ read() {} }));

    doc.fontSize(16).text('Журнал действий Dumler Logistik', { align: 'center' });
    doc.moveDown();

    snap.docs.forEach((entry, i) => {
      const { email, action, time } = entry.data();
      doc.fontSize(12).text(`${i + 1}. ${email} — ${action} [${time}]`);
    });

    doc.end();
    const buffer = await streamToBuffer(stream);

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=logs.pdf'
      }
    });
  } catch (err) {
    return Response.json({ error: err.toString() }, { status: 500 });
  }
}
