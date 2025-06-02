import { google } from 'googleapis';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function POST(req: Request) {
  const { email, type, description } = await req.json();

  const auth = new google.auth.JWT(
    process.env.VITE_GOOGLE_SERVICE_EMAIL,
    undefined,
    process.env.VITE_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/drive']
  );

  const drive = google.drive({ version: 'v3', auth });

  // 1. Создаём PDF
  const doc = new PDFDocument();
  const stream = doc.pipe(new Readable({ read() {} }));
  doc.fontSize(18).text('Заявка на обслуживание Dumler Logistik', { align: 'center' }).moveDown();
  doc.fontSize(12).text(`Email: ${email}`);
  doc.text(`Тип: ${type}`);
  doc.text(`Описание: ${description}`);
  doc.text(`Дата: ${new Date().toLocaleString()}`);
  doc.end();
  const buffer = await streamToBuffer(stream);

  // 2. Загружаем в Google Drive
  const fileMeta = {
    name: `Заявка-${Date.now()}.pdf`,
    parents: ['appDataFolder']  // Заменим на конкретную папку ниже
  };

  // Находим папку "Dumler Reports"
  const folderRes = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder' and name='Dumler Reports'",
    fields: 'files(id, name)'
  });

  const folderId = folderRes.data.files?.[0]?.id;
  if (!folderId) return Response.json({ error: 'Папка "Dumler Reports" не найдена' }, { status: 500 });

  const res = await drive.files.create({
    requestBody: {
      name: fileMeta.name,
      parents: [folderId],
      mimeType: 'application/pdf'
    },
    media: {
      mimeType: 'application/pdf',
      body: Readable.from(buffer)
    },
    fields: 'id, webViewLink'
  });

  const link = res.data.webViewLink;
  return Response.json({ link });
}
