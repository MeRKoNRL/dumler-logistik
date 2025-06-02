import { db } from './firestore';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export async function logChange(type: string, collectionName: string, docId: string, field: string, oldValue: any, newValue: any) {
  const auth = getAuth();
  const user = auth.currentUser;
  const email = user?.email || 'неизвестно';

  await addDoc(collection(db, 'changes'), {
    type,
    collection: collectionName,
    docId,
    field,
    oldValue,
    newValue,
    who: email,
    timestamp: new Date()
  });
}
