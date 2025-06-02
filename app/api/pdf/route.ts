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

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    const doc = new PDFDocument();
    const stream = doc.pipe(new Readable({ read() {} }));

    doc.fontSize(16).text('Отчёт Dumler Logistik', { align: 'center' });
    doc.moveDown();

    data.forEach((entry: string[], i: number) => {
      doc.fontSize(12).text(`${i + 1}. ${entry.join(' | ')}`);
    });

    doc.end();
    const buffer = await streamToBuffer(stream);

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=report.pdf'
      }
    });
  } catch (err) {
    return Response.json({ error: err.toString() }, { status: 500 });
  }
}
