import { google } from 'googleapis';

const auth = new google.auth.JWT(
  process.env.VITE_GOOGLE_SERVICE_EMAIL,
  undefined,
  process.env.VITE_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_TITLE = 'Клиенты';

export async function GET() {
  try {
    const client = await auth.authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    // Получаем список листов
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const sheetExists = spreadsheet.data.sheets?.some(s => s.properties?.title === SHEET_TITLE);

    if (!sheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: SHEET_TITLE,
                gridProperties: {
                  rowCount: 100,
                  columnCount: 2
                }
              }
            }
          }]
        }
      });

      // Заголовки
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_TITLE}!A1:B1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Клиент', 'Водитель']]
        }
      });
    }

    // Читаем клиентов
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_TITLE}!A2:A`
    });

    const values = response.data.values || [];
    const clients = values.map(row => row[0]);

    return Response.json({ clients });
  } catch (err) {
    return Response.json({ error: err.toString() }, { status: 500 });
  }
}
