'use client';

import { useRole } from '@/components/RoleContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({
  children,
  allowedRoles
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user, role } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
    else if (!allowedRoles.includes(role || '')) router.push('/unauthorized');
  }, [user, role]);

  return <>{children}</>;
}
