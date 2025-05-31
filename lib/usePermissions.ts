import { useEffect, useState } from 'react';
import { db } from '@/lib/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { useUser } from './useUser';

export function usePermissions() {
  const { user, role } = useUser();
  const [permissions, setPermissions] = useState<any>({});

  useEffect(() => {
    if (!user || role === 'admin') return;
    getDoc(doc(db, 'permissions', user.uid)).then(snap => {
      if (snap.exists()) {
        setPermissions(snap.data());
      }
    });
  }, [user, role]);

  return { role, permissions };
}
