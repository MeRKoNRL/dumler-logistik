// Функция копирования листа клиентов с обнулением количества клиентов
const { google } = require('googleapis');
const moment = require('moment');
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const SHEET_ID = 'ВАШ_SPREADSHEET_ID'; // Замените на ID таблицы

async function copyClientsSheet() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const today = moment().format('YYYY-MM-DD');
  const newSheetTitle = `Clients_${today}`;

  // Получаем список листов
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID
  });

  const sourceSheet = spreadsheet.data.sheets.find(s =>
    s.properties.title.startsWith('Clients_')
  );

  if (!sourceSheet) {
    console.error('Не найден лист Clients_...');
    return;
  }

  const sourceSheetId = sourceSheet.properties.sheetId;

  // Копируем лист
  const copyRes = await sheets.spreadsheets.sheets.copyTo({
    spreadsheetId: SHEET_ID,
    sheetId: sourceSheetId,
    requestBody: {
      destinationSpreadsheetId: SHEET_ID
    }
  });

  const newSheetId = copyRes.data.sheetId;

  // Переименовываем новый лист
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId: newSheetId,
              title: newSheetTitle
            },
            fields: 'title'
          }
        }
      ]
    }
  });

  // Обнуляем колонку "Клиенты всего" (E)
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${newSheetTitle}!E2:E`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: Array(100).fill(['']) // до 100 строк
    }
  });

  console.log(`Создан новый лист: ${newSheetTitle}`);
}

copyClientsSheet().catch(console.error);
