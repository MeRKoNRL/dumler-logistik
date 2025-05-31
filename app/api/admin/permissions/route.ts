import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

export async function POST(req: Request) {
  const { uid, updates } = await req.json();

  if (!uid || typeof updates !== 'object') {
    return Response.json({ error: 'uid and updates required' }, { status: 400 });
  }

  await db.collection('permissions').doc(uid).set(updates, { merge: true });

  return Response.json({ success: true });
}
