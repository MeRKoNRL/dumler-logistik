import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

export async function POST(req: Request) {
  const { action, email } = await req.json();
  const timestamp = Timestamp.now();
  await db.collection('logs').add({ action, email, timestamp });
  return Response.json({ status: 'ok' });
}
