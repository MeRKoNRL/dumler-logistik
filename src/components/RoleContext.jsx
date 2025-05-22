import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Следим за изменением авторизованного пользователя
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await getIdTokenResult(user, true);
          const userRole = token.claims.role || 'водитель'; // По умолчанию если нет роли
          setRole(userRole);
        } catch (err) {
          console.error('Ошибка получения роли из токена:', err);
        }
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
