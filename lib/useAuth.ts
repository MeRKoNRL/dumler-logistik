'use client';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from './firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export interface AuthUser {
  uid: string;
  email: string;
  role: string;
  permissions?: string[];
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const db = getFirestore(app);
        const ref = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(ref);
        const profile = snap.exists() ? snap.data() : {};
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          role: profile.role || 'driver',
          permissions: profile.permissions || []
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { user, loading };
}
