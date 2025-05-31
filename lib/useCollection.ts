'use client';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './firebase';

export function useCollection<T = any>(name: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const db = getFirestore(app);
      const snap = await getDocs(collection(db, name));
      const result: T[] = [];
      snap.forEach(doc => result.push({ id: doc.id, ...doc.data() } as T));
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [name]);

  return { data, loading };
}
