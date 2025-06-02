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
  const { from, to } = await req.json();
  const snap = await db.collection('daily_plans').get();
  const all = snap.docs.map(doc => doc.data());
  const filtered = all.filter(p => (!from || p.date >= from) && (!to || p.date <= to));

  const allEntries = filtered.flatMap(p => p.entries?.map(e => ({ date: p.date, ...e })) || []);
  const drivers = {};
  const clients = {};

  allEntries.forEach(e => {
    drivers[e.driver || 'неизвестно'] = (drivers[e.driver || 'неизвестно'] || 0) + 1;
    clients[e.client || 'неизвестно'] = (clients[e.client || 'неизвестно'] || 0) + 1;
  });

  const doc = new PDFDocument({ margin: 40 });
  const stream = new Readable({ read() {} });
  doc.pipe(stream);

  doc.fontSize(16).text(`Сводка дневных планов`, { align: 'center' }).moveDown();
  doc.fontSize(12).text(`Период: ${from || '...'} — ${to || '...'}`).moveDown();

  doc.fontSize(12).text(`Всего записей: ${allEntries.length}`);
  doc.text(`Водителей: ${Object.keys(drivers).length}`);
  doc.text(`Клиентов: ${Object.keys(clients).length}`);
  doc.moveDown();

  doc.fontSize(14).text('Топ водителей:', { underline: true });
  Object.entries(drivers).slice(0, 10).forEach(([d, c]) => {
    doc.fontSize(12).text(`- ${d}: ${c}`);
  });

  doc.moveDown();
  doc.fontSize(14).text('Топ клиентов:', { underline: true });
  Object.entries(clients).slice(0, 10).forEach(([c, v]) => {
    doc.fontSize(12).text(`- ${c}: ${v}`);
  });

  doc.end();
  const buffer = await streamToBuffer(stream);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=summary.pdf'
    }
  });
}
