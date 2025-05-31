import { google } from 'googleapis';
import moment from 'moment';

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function GET() {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const today = moment().format('YYYY-MM-DD');
    const newSheetTitle = `Clients_${today}`;

    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const sourceSheet = spreadsheet.data.sheets.find(s =>
      s.properties.title.startsWith('Clients_')
    );

    if (!sourceSheet) {
      return Response.json({ error: 'Не найден лист Clients_...' }, { status: 404 });
    }

    const sourceSheetId = sourceSheet.properties.sheetId;

    const copyRes = await sheets.spreadsheets.sheets.copyTo({
      spreadsheetId: SHEET_ID,
      sheetId: sourceSheetId,
      requestBody: { destinationSpreadsheetId: SHEET_ID }
    });

    const newSheetId = copyRes.data.sheetId;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [{
          updateSheetProperties: {
            properties: { sheetId: newSheetId, title: newSheetTitle },
            fields: 'title'
          }
        }]
      }
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${newSheetTitle}!E2:E`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: Array(100).fill(['']) }
    });

    return Response.json({ message: `Создан новый лист: ${newSheetTitle}` });
  } catch (err) {
    return Response.json({ error: err.toString() }, { status: 500 });
  }
}
