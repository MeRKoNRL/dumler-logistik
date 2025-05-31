import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from './firebase';

export async function logAction(action: string, userId: string, email: string, details?: any) {
  const db = getFirestore(app);
  await addDoc(collection(db, 'activity_logs'), {
    action,
    userId,
    email,
    details,
    createdAt: serverTimestamp()
  });
}
