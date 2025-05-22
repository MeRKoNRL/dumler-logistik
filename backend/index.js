const { sendEmailNotification } = require('./utils/notifications');
const cron = require('node-cron');
// Простой сервер Node.js с подключением Google Sheets API
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Настройки клиента Google
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json', // credentials.json должен быть загружен вручную
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const SHEET_ID = 'ВАШ_SPREADSHEET_ID'; // Замените на свой ID

app.get('/drivers', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

// --- Подключение Google Calendar API ---
const { google } = require('googleapis');
const calendar = google.calendar({ version: 'v3', auth });

// ID календаря, в который будут добавляться события
const CALENDAR_ID = '43f6ca44b6bdab401b5fd3a8883c65a6e61635263df35fe0a90f163bcc25022f@group.calendar.google.com';

  const range = 'Drivers!A2:D';

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range
  });

  res.json(response.data.values || []);
});

app.post('/requests', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

// --- Подключение Google Calendar API ---
const { google } = require('googleapis');
const calendar = google.calendar({ version: 'v3', auth });

// ID календаря, в который будут добавляться события
const CALENDAR_ID = '43f6ca44b6bdab401b5fd3a8883c65a6e61635263df35fe0a90f163bcc25022f@group.calendar.google.com';


  const { name, type, comment, date } = req.body;

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Requests!A2',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[name, type, comment, date]]
    }
  });

  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

app.get('/clients', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

// --- Подключение Google Calendar API ---
const { google } = require('googleapis');
const calendar = google.calendar({ version: 'v3', auth });

// ID календаря, в который будут добавляться события
const CALENDAR_ID = '43f6ca44b6bdab401b5fd3a8883c65a6e61635263df35fe0a90f163bcc25022f@group.calendar.google.com';


  const today = new Date().toISOString().split('T')[0];
  const sheetName = `Clients_${today}`;

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${sheetName}!A2:F`,
    });

    res.json(result.data.values || []);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при чтении таблицы клиентов' });
  }
});

app.get('/vacations', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

// --- Подключение Google Calendar API ---
const { google } = require('googleapis');
const calendar = google.calendar({ version: 'v3', auth });

// ID календаря, в который будут добавляться события
const CALENDAR_ID = '43f6ca44b6bdab401b5fd3a8883c65a6e61635263df35fe0a90f163bcc25022f@group.calendar.google.com';


  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Vacations!A2:G',
    });

    res.json(result.data.values || []);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при чтении листа отпусков' });
  }
});

app.get('/vehicles', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

// --- Подключение Google Calendar API ---
const { google } = require('googleapis');
const calendar = google.calendar({ version: 'v3', auth });

// ID календаря, в который будут добавляться события
const CALENDAR_ID = '43f6ca44b6bdab401b5fd3a8883c65a6e61635263df35fe0a90f163bcc25022f@group.calendar.google.com';


  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Vehicles!A2:F',
    });

    res.json(result.data.values || []);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при чтении состояния автомобилей' });
  }
});

app.post('/update-vehicle', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

// --- Подключение Google Calendar API ---
const { google } = require('googleapis');
const calendar = google.calendar({ version: 'v3', auth });

// ID календаря, в который будут добавляться события
const CALENDAR_ID = '43f6ca44b6bdab401b5fd3a8883c65a6e61635263df35fe0a90f163bcc25022f@group.calendar.google.com';


  const { row, values } = req.body;

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Vehicles!A${row}:F${row}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при обновлении строки' });
  }
});


// --- Авторизация по users.json ---
const fs = require('fs');
const path = require('path');

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json')));
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, role: user.role });
  } else {
    res.status(401).json({ success: false, message: 'Неверные данные' });
  }
});

// --- Обработка формы водителя (больничный, утерянные посылки) ---
app.post('/driver-info', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

// --- Подключение Google Calendar API ---
const { google } = require('googleapis');
const calendar = google.calendar({ version: 'v3', auth });

// ID календаря, в который будут добавляться события
const CALENDAR_ID = '43f6ca44b6bdab401b5fd3a8883c65a6e61635263df35fe0a90f163bcc25022f@group.calendar.google.com';


  const { name, sickNote, lostPackage, cost, location, date } = req.body;
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'DriverInfo!A2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[name, sickNote, lostPackage, cost, location, date]]
      }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при добавлении информации от водителя' });
  }
});

// --- Функция для добавления события в календарь ---
async function addCalendarEvent(summary, description, date) {
  try {
    await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: {
        summary,
        description,
        start: {
          date: date,
        },
        end: {
          date: date,
        }
      }
    });
    console.log('Событие добавлено в календарь');
  } catch (err) {
    console.error('Ошибка при добавлении события в календарь:', err);
  }
}


// --- PDF отчёт из таблицы Clients (на сегодня) ---
const generatePDF = require('./pdf');

app.get('/report/clients', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const today = new Date().toISOString().split('T')[0];
  const sheetName = `Clients_${today}`;

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${sheetName}!A2:F`,
    });

    generatePDF(result.data.values || [], res);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении таблицы для PDF' });
  }
});

// --- PDF отчёт по отпускам ---
app.get('/report/vacations', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `Vacations!A2:G`,
    });

    generatePDF(result.data.values || [], res);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении отпусков для PDF' });
  }
});

// --- PDF отчёт по заявкам водителей ---
app.get('/report/requests', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `Requests!A2:D`,
    });

    generatePDF(result.data.values || [], res);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении заявок для PDF' });
  }
});

// --- PDF отчёт по автомобилям ---
app.get('/report/vehicles', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `Vehicles!A2:F`,
    });

    generatePDF(result.data.values || [], res);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении авто для PDF' });
  }
});

// --- События для календаря водителей ---
app.get('/calendar-events', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const vacations = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Vacations!A2:G',
    });

    const sickDays = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'DriverInfo!A2:F',
    });

    const events = [];

    (vacations.data.values || []).forEach(row => {
      const [name, , used, , , , remaining] = row;
      events.push({
        title: `${name} — Отпуск`,
        start: new Date(),
        end: new Date(),
        allDay: true,
      });
    });

    (sickDays.data.values || []).forEach(row => {
      const [name, sickNote, , , , date] = row;
      if (date) {
        events.push({
          title: `${name} — Больничный`,
          start: new Date(date),
          end: new Date(date),
          allDay: true,
        });
      }
    });

    res.json(events);
  } catch (error) {
    console.error('Ошибка загрузки событий для календаря:', error);
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
});


// --- Универсальный логгер действий ---
async function logAction({ email, action, detail }) {
  try {
    const now = new Date().toISOString();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'AuditLog!A2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[email, action, detail, now]]
      }
    });
  } catch (err) {
    console.error('Ошибка логирования действия:', err);
  }
}

// --- Firebase Admin SDK для управления пользователями ---
const admin = require('firebase-admin');
const serviceAccount = require('./credentials.json'); // credentials.json тот же, что и для Google API

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// --- Получение списка пользователей с ролями ---
app.get('/admin/users', async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      role: user.customClaims?.role || null
    }));
    res.json(users);
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({ error: 'Ошибка получения пользователей' });
  }
});

// --- Установка роли пользователю ---
app.post('/admin/set-role', async (req, res) => {
  const { uid, role } = req.body;
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка установки роли:', error);
    res.status(500).json({ error: 'Ошибка установки роли' });
  }
});

// --- API для графика клиентов по водителям ---
app.get('/chart/clients', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const today = new Date().toISOString().split('T')[0];
  const sheetName = `Clients_${today}`;

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${sheetName}!A2:F`,
    });

    const rows = result.data.values || [];
    const summary = {};

    rows.forEach(row => {
      const driver = row[0] || 'Неизвестно';
      const count = parseInt(row[1], 10) || 0;
      if (!summary[driver]) summary[driver] = 0;
      summary[driver] += count;
    });

    const data = Object.entries(summary).map(([driver, clients]) => ({ driver, clients }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения данных для графика' });
  }
});


const exportToExcel = require('./exportExcel');

// --- Excel экспорт отпусков ---
app.get('/excel/vacations', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Vacations!A1:G',
    });

    const [headers, ...rows] = data.values || [];
    await exportToExcel('Отпуска и отгулы', headers, rows, res);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при экспорте отпусков' });
  }
});

// --- Excel экспорт машин ---
app.get('/excel/vehicles', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Vehicles!A1:F',
    });

    const [headers, ...rows] = data.values || [];
    await exportToExcel('Автомобили', headers, rows, res);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при экспорте авто' });
  }
});

// --- Excel экспорт логов ---
app.get('/excel/logs', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'AuditLog!A1:D',
    });

    const [headers, ...rows] = data.values || [];
    await exportToExcel('Журнал действий', headers, rows, res);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при экспорте логов' });
  }
});

// --- Получение логов для фронта ---
app.get('/logs', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'AuditLog!A2:D',
    });

    const rows = result.data.values || [];
    const logs = rows.map(r => ({
      email: r[0],
      action: r[1],
      detail: r[2],
      timestamp: r[3]
    }));

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка загрузки логов' });
  }
});

// --- Создание пользователя админом ---
app.post('/admin/create-user', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await admin.auth().createUser({ email, password });
    await admin.auth().setCustomUserClaims(user.uid, { role });
    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка создания пользователя:', err);
    res.status(500).json({ error: 'Ошибка создания пользователя' });
  }
});


// --- Изменение активности пользователя (блокировка/разблокировка) ---
app.post('/admin/set-status', async (req, res) => {
  const { uid, disabled } = req.body;

  try {
    await admin.auth().updateUser(uid, { disabled });
    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка изменения статуса пользователя:', err);
    res.status(500).json({ error: 'Ошибка изменения статуса пользователя' });
  }
});

// --- Резервное копирование таблицы в Google Drive ---
app.post('/backup-now', async (req, res) => {
  const client = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: client });

  try {
    const today = new Date();
    const name = `Backup_Dumler_${today.toISOString().replace(/[:.]/g, '-')}`;

    const copy = await drive.files.copy({
      fileId: SHEET_ID,
      requestBody: {
        name: name,
      },
    });

    res.json({ success: true, backupFileId: copy.data.id });
    // send notification email
    sendEmailNotification(SMTP_USER, 'Backup Created', 'Backup file ID: ' + copy.data.id);
  } catch (error) {
    console.error('Ошибка резервного копирования:', error);
    res.status(500).json({ error: 'Ошибка при создании резервной копии' });
  }
});

// Автокопирование каждый день в 02:00
cron.schedule('0 2 * * *', async () => {
  console.log('[CRON] Запуск резервного копирования...');
  const client = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: client });

  try {
    const today = new Date();
    const name = `Backup_Dumler_${today.toISOString().replace(/[:.]/g, '-')}`;
    const copy = await drive.files.copy({
      fileId: SHEET_ID,
      requestBody: {
        name,
      },
    });
    console.log('[CRON] Копия создана ID:', copy.data.id);
  } catch (error) {
    console.error('[CRON] Ошибка копирования:', error.message);
  }
});


// Удаление старых резервных копий (старше 30 дней)
cron.schedule('30 2 * * *', async () => {
  console.log('[CRON] Проверка старых резервных копий...');
  const client = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: client });

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const response = await drive.files.list({
      q: "name contains 'Backup_Dumler_' and trashed = false",
      fields: 'files(id, name, createdTime)',
      spaces: 'drive',
    });

    const oldFiles = (response.data.files || []).filter(file => {
      return new Date(file.createdTime) < thirtyDaysAgo;
    });

    for (const file of oldFiles) {
      await drive.files.delete({ fileId: file.id });
      console.log('[CRON] Удалена старая копия:', file.name);
    }

  } catch (error) {
    console.error('[CRON] Ошибка при удалении старых копий:', error.message);
  }
});


// Получение логов по email пользователя
app.get('/logs/user/:email', async (req, res) => {
  const { email } = req.params;
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'AuditLog!A2:D',
    });

    const rows = result.data.values || [];
    const logs = rows
      .filter(r => r[0] === email)
      .map(r => ({
        action: r[1],
        detail: r[2],
        timestamp: r[3]
      }));

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка загрузки логов' });
  }
});

// --- Автоархивация данных раз в неделю (в Excel) ---
cron.schedule('0 3 * * 0', async () => {
  console.log('[CRON] Архивация данных...');
  const client = await auth.getClient();
  const sheetsApi = google.sheets({ version: 'v4', auth: client });
  const drive = google.drive({ version: 'v3', auth: client });
  const ExcelJS = require('exceljs');

  const workbook = new ExcelJS.Workbook();
  const today = new Date().toISOString().split('T')[0];
  const sheetNames = ['Vacations', 'Vehicles', 'AuditLog'];
  const clientSheet = `Clients_${today}`;
  sheetNames.unshift(clientSheet);

  try {
    for (const name of sheetNames) {
      const { data } = await sheetsApi.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${name}!A1:Z`,
      });
      const [headers, ...rows] = data.values || [];
      const sheet = workbook.addWorksheet(name);
      sheet.addRow(headers).font = { bold: true };
      rows.forEach(r => sheet.addRow(r));
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const fileMetadata = {
      name: `Archive_Dumler_${today}.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    const media = {
      mimeType: fileMetadata.mimeType,
      body: Buffer.from(buffer),
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
    });

    console.log('[CRON] Архив создан в Google Drive:', file.data.id);
  } catch (error) {
    console.error('[CRON] Ошибка при архивации:', error.message);
  }
});


app.get('/health', (req, res) => res.json({ status: 'ok' }));
