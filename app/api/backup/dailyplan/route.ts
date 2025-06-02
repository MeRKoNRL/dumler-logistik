import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

try { initializeApp(); } catch (_) {}

const db = getFirestore();
import { logError } from '@/lib/log';

export async function POST() {
  try {
  const plans = await db.collection('daily_plans').get();
  const snapshot = plans.docs.map(doc => doc.data());

  const timestamp = new Date().toISOString();
  await db.collection('backups').doc('dailyplan_' + timestamp).set({ snapshot, timestamp });

      return Response.json({ ok: true, saved: snapshot.length });
  } catch (e) {
    await logError('backup', e);
    return Response.json({ ok: false, error: e.message });
  }
}