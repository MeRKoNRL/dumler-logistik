'use client';
import { useAuth } from '@/lib/useAuth';

export function OnlyRole({ roles, children }: { roles: string[]; children: any }) {
  const { user } = useAuth();
  const role = user?.role;
  const effective = role === 'admin' || role === 'dispatcher' ? ['driver', role] : [role];
  if (!user || !roles.some(r => effective.includes(r))) return null;
  return children;
}

export function OnlyPermission({ permission, children }: { permission: string; children: any }) {
  const { user } = useAuth();
  if (!user || !user.permissions?.includes(permission)) return null;
  return children;
}
