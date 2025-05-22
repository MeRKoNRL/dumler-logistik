const nodemailer = require('nodemailer');
const {
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
} = process.env;

// Email transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT),
  secure: false,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// Send Email
async function sendEmailNotification(to, subject, text) {
  try {
    await transporter.sendMail({ from: SMTP_USER, to, subject, text });
    console.log('Email sent to', to);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

module.exports = { sendEmailNotification };