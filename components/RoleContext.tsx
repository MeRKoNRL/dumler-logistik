'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/init';
import { db, doc, getDoc } from '@/lib/firestore';

type Role = 'admin' | 'dispatcher' | 'driver' | null;

interface RoleContextProps {
  user: any;
  role: Role;
}

const RoleContext = createContext<RoleContextProps>({ user: null, role: null });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const roleRef = doc(db, 'roles', firebaseUser.uid);
        const roleSnap = await getDoc(roleRef);
        if (roleSnap.exists()) {
          setRole(roleSnap.data().role);
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <RoleContext.Provider value={{ user, role }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
