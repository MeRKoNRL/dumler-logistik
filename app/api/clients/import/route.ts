import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import { logError } from '@/lib/log';

try { initializeApp(); } catch (_) {}

const db = getFirestore();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!Array.isArray(data)) throw new Error('Неверный формат');

    const batch = db.batch();
    data.forEach((client) => {
      const ref = db.collection('clients').doc(client.id || db.collection('clients').doc().id);
      batch.set(ref, client, { merge: true });
    });

    await batch.commit();

    return new Response(JSON.stringify({ ok: true, count: data.length }));
  } catch (e) {
    await logError('import-clients', e);
    return new Response(JSON.stringify({ ok: false, error: e.message }));
  }
}