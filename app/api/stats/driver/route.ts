import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firestore';

export async function POST(req: Request) {
  const { email, start, end } = await req.json();

  const q = query(
    collection(db, 'maintenance_requests'),
    where('email', '==', email)
  );

  const snap = await getDocs(q);
  const all = snap.docs.map(doc => doc.data());
  const filtered = all.filter(r => {
    return (
      r.createdAt >= start &&
      r.createdAt <= end + 'T23:59:59'
    );
  });

  const total = filtered.length;
  const types: Record<string, number> = {};
  for (const r of filtered) {
    types[r.type] = (types[r.type] || 0) + 1;
  }

  return Response.json({ total, types });
}
