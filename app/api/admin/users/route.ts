import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';

const app = !getAuth.length ? initializeApp() : undefined;
const auth = getAuth();
const db = getFirestore();

export async function GET() {
  const list = await auth.listUsers(1000);
  const users = list.users;

  const promises = users.map(async (user) => {
    const doc = await db.collection('users').doc(user.uid).get();
    return {
      uid: user.uid,
      email: user.email,
      lastLogin: user.metadata?.lastSignInTime,
      role: doc.exists ? doc.data().role : 'unknown'
    };
  });

  const enriched = await Promise.all(promises);
  return Response.json(enriched);
}
