import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

try { initializeApp(); } catch (_) {}

const db = getFirestore();

export async function logError(context: string, error: any) {
  await db.collection('logs').add({
    context,
    error: typeof error === 'string' ? error : error.message || String(error),
    timestamp: new Date().toISOString()
  });
}