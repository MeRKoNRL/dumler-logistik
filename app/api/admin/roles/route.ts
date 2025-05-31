import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

export async function POST(req: Request) {
  const { uid, role } = await req.json();

  if (!uid || !role) {
    return Response.json({ error: 'uid and role required' }, { status: 400 });
  }

  await db.collection('users').doc(uid).set({ role }, { merge: true });

  await db.collection('logs').add({
  action: `Назначена роль ${role}`,
  email: uid,
  timestamp: new Date()
});
return Response.json({ success: true });
}
