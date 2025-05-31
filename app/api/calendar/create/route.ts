import { google } from 'googleapis';

export async function POST(req: Request) {
  const { summary, description, start, end } = await req.json();

  const auth = new google.auth.JWT(
    process.env.VITE_GOOGLE_SERVICE_EMAIL,
    undefined,
    process.env.VITE_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar']
  );

  const calendar = google.calendar({ version: 'v3', auth });

  // Найдём календарь "Dumler Calendar"
  const calendarList = await calendar.calendarList.list();
  const dumler = calendarList.data.items?.find(c => c.summary === 'Dumler Calendar');

  if (!dumler || !dumler.id) {
    return Response.json({ error: 'Календарь "Dumler Calendar" не найден' }, { status: 500 });
  }

  const event = {
    summary,
    description,
    start: {
      dateTime: new Date(start).toISOString(),
      timeZone: 'Europe/Berlin',
    },
    end: {
      dateTime: new Date(end).toISOString(),
      timeZone: 'Europe/Berlin',
    },
  };

  const res = await calendar.events.insert({
    calendarId: dumler.id,
    requestBody: event,
  });

  return Response.json({ eventLink: res.data.htmlLink });
}
