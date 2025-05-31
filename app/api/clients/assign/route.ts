import { google } from 'googleapis';

import { logAction } from '@/lib/logger';

const auth = new google.auth.JWT(
  process.env.VITE_GOOGLE_SERVICE_EMAIL,
  undefined,
  process.env.VITE_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const RANGE = 'Клиенты!B2:B';

export async function POST(req: Request) {
  try {
    const { assignments } = await req.json();
    const rows = [];
    const maxIndex = Math.max(...Object.keys(assignments).map(k => parseInt(k, 10)));

    for (let i = 0; i <= maxIndex; i++) {
      rows.push([assignments[i] || '']);
    }

    await auth.authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: rows }
    });

    await logAction('system', 'system', 'Распределены клиенты');
    return Response.json({ message: 'Assignments updated' });
  } catch (err) {
    return Response.json({ error: err.toString() }, { status: 500 });
  }
}
