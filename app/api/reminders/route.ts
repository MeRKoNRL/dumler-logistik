import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return new Response('Missing userId', { status: 400 });

  const snap = await db.collection('reminders')
    .where('userId', '==', userId)
    .orderBy('dueDate', 'asc')
    .get();

  const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return Response.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, title, dueDate } = body;
  if (!userId || !title || !dueDate) return new Response('Missing fields', { status: 400 });

  await db.collection('reminders').add({
    userId,
    title,
    dueDate: new Date(dueDate),
    done: false,
    createdAt: new Date()
  });

  return new Response('OK');
}