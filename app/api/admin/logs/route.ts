import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

export async function GET() {
  const snap = await db.collection('logs').orderBy('timestamp', 'desc').limit(50).get();
  const data = snap.docs.map(doc => doc.data());
  return Response.json(data);
}
