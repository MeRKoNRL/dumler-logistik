import { getFirestore, Timestamp } from 'firebase/firestore';
import { app } from './firebase';

export async function logAction({
  who,
  action,
  collection,
  docId,
  field,
  oldValue,
  newValue,
}: {
  who: string;
  action: string;
  collection: string;
  docId: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
}) {
  const db = getFirestore(app);
  await db.collection('logs').add({
    who,
    action,
    collection,
    docId,
    field,
    oldValue,
    newValue,
    timestamp: Timestamp.now(),
  });
}