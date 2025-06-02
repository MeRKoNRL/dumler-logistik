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

export async function POST(req) {
  const { id } = await req.json();
  if (!id) return new Response('Missing ID', { status: 400 });

  const snap = await db.collection('saved_comparisons').doc(id).get();
  if (!snap.exists) return new Response('Not found', { status: 404 });
  const data = snap.data();

  const doc = new PDFDocument({ margin: 40 });
  const stream = new Readable({ read() {} });
  doc.pipe(stream);

  doc.fontSize(16).text(`Сравнение: ${data.label}`, { align: 'center' }).moveDown();
  doc.fontSize(12).text(`Период 1: ${data.fromA} → ${data.toA}`);
  doc.fontSize(12).text(`Период 2: ${data.fromB} → ${data.toB}`).moveDown();

  doc.fontSize(14).text('👤 Пользователи:', { underline: true }).moveDown(0.5);
  data.data.forEach((entry, i) => {
    const diff = entry.current - entry.previous;
    const sign = diff > 0 ? '▲' : diff < 0 ? '▼' : '—';
    const color = diff > 0 ? 'green' : diff < 0 ? 'red' : 'black';
    doc.fillColor(color).text(`${i + 1}. ${entry.user}: ${entry.current} vs ${entry.previous} (${sign} ${Math.abs(diff)})`);
  });

  doc.end();
  const buffer = await streamToBuffer(stream);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=comparison_${data.label}.pdf`
    }
  });
}
