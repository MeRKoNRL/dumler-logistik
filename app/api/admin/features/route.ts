import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();
const ref = db.collection('config').doc('features');

export async function GET() {
  const snap = await ref.get();
  return Response.json(snap.exists ? snap.data() : {});
}

export async function POST(req) {
  const data = await req.json();
  await ref.set(data, { merge: true });
  return Response.json({ success: true });
}
