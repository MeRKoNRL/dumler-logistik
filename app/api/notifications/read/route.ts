import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id } = body;
  if (!id) return new Response('Missing id', { status: 400 });

  await db.collection('notifications').doc(id).update({ read: true });
  return new Response('Updated');
}