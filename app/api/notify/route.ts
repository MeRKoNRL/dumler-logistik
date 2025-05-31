export async function POST(req: Request) {
  const { to, subject, text } = await req.json();
  console.log('📧 Отправка письма:', to, subject, text);

  // Тут должна быть реальная отправка через nodemailer или EmailJS
  return Response.json({ message: 'Email sent (mock)' });
}
