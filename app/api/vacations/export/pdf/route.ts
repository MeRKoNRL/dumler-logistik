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
  const snap = await getDocs(collection(db, 'vacations'));
  const doc = new PDFDocument();
  const stream = doc.pipe(new Readable({ read() {} }));

  doc.fontSize(16).text('Запросы на отпуск Dumler Logistik', { align: 'center' }).moveDown();

  snap.docs.forEach((entry, i) => {
    const d = entry.data();
    doc.fontSize(12).text(
      `${i + 1}. ${d.email} (${d.start} - ${d.end}) — ${d.reason} | Одобрено: ${d.approved ? 'Да' : 'Нет'}`
    );
  });

  doc.end();
  const buffer = await streamToBuffer(stream);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=vacations.pdf'
    }
  });
}
