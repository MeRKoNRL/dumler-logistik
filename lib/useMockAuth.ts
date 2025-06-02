'use client';
import { useEffect, useState } from 'react';

const mockUsers = {
  admin: {
    uid: 'admin-1',
    email: 'admin@example.com',
    role: 'admin',
    permissions: ['clients', 'vehicles', 'reports', 'import', 'adminpanel', 'history', 'dailyplan']
  },
  dispatcher: {
    uid: 'disp-1',
    email: 'dispatcher@example.com',
    role: 'dispatcher',
    permissions: ['clients', 'vehicles', 'reports', 'import', 'dailyplan']
  },
  driver: {
    uid: 'driver-1',
    email: 'driver@example.com',
    role: 'driver',
    permissions: []
  }
};

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // По умолчанию подключаем админа — можно переключить ниже
    setUser(mockUsers.admin); // <-- можно заменить на mockUsers.dispatcher или .driver
  }, []);

  return { user, loading };
}
