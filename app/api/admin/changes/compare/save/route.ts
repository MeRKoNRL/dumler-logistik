import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

export async function POST(req: Request) {
  const { fromA, toA, fromB, toB, label, data } = await req.json();

  if (!fromA || !toA || !label || !data) {
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await db.collection('saved_comparisons').add({
    fromA, toA, fromB, toB,
    label,
    data,
    timestamp: new Date()
  });

  return Response.json({ success: true });
}

export async function GET() {
  const snap = await db.collection('saved_comparisons').orderBy('timestamp', 'desc').limit(20).get();
  return Response.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
}


export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });

  await db.collection('saved_comparisons').doc(id).delete();
  return Response.json({ success: true });
}
