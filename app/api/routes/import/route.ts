import { NextRequest } from 'next/server';
import { db } from '@/lib/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { IncomingForm } from 'formidable';
import { read, utils } from 'xlsx';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: NextRequest): Promise<{ fields: unknown; files: unknown }> {
  const form = new IncomingForm({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req as unknown, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req: unknown) {
  const { files } = await parseForm(req);
  const file = files.file[0];
  const buffer = fs.readFileSync(file.filepath);
  const workbook = read(buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of rows) {
    if (row.email && row.date) {
      await addDoc(collection(db, 'routes'), {
        email: row.email,
        client: row.client || '',
        vehicle: row.vehicle || '',
        date: row.date,
        cargo: row.cargo || '',
      });
      count++;
    }
  }

  await db.collection('logs').add({
  action: `Импортировано маршрутов: ${count}`,
  timestamp: new Date()
});
return Response.json({ message: `Импортировано маршрутов: ${count}` });
}
