import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

export async function GET() {
  const snap = await db.collection('changes').orderBy('timestamp', 'desc').limit(500).get();
  return Response.json(snap.docs.map(doc => doc.data()));
}
