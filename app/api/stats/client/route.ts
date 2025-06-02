import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();

export async function GET() {
  const snap = await db.collection('daily_plans').get();
  const all = snap.docs.map(doc => doc.data());

  const stats: Record<string, number> = {};

  all.forEach(plan => {
    (plan.entries || []).forEach((entry: unknown) => {
      const client = entry.client || 'неизвестно';
      stats[client] = (stats[client] || 0) + 1;
    });
  });

  const result = Object.entries(stats)
    .map(([client, count]) => ({ client, count }))
    .sort((a, b) => b.count - a.count);

  return Response.json(result);
}
