import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

try {
  initializeApp();
} catch (_) {}

const db = getFirestore();
import { logError } from '@/lib/log';

export async function GET() {
  try {
  const clientsSnap = await db.collection('clients').get();
  const allClients = clientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const plansSnap = await db.collection('daily_plans').get();

  const today = new Date();
  const overdueClients: any[] = [];

  allClients.forEach(client => {
    const lastServed = plansSnap.docs
      .map(doc => {
        const { entries, date } = doc.data();
        if (!Array.isArray(entries)) return null;
        const found = entries.find((e: any) =>
          [e.kunden1, e.kunden2, e.abholkunden].join(',').includes(client.name)
        );
        return found ? new Date(date) : null;
      })
      .filter(d => d) as Date[];

    if (!lastServed.length) {
      overdueClients.push({ ...client, lastServed: null });
    } else {
      const mostRecent = new Date(Math.max(...lastServed.map(d => d.getTime())));
      const diffDays = Math.ceil((today.getTime() - mostRecent.getTime()) / (1000 * 3600 * 24));
      if (diffDays > 3) {
        overdueClients.push({ ...client, lastServed: mostRecent.toISOString(), overdue: diffDays });
      }
    }
  });

      return Response.json(overdueClients);
  } catch (e) {
    await logError('sla-check', e);
    return Response.json({ ok: false, error: e.message });
  }
}