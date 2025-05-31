'use client';

import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firestore';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { logChange } from '@/lib/logChange';
import { logAction } from '@/lib/logger';
import { usePermissions } from '@/lib/usePermissions';
import { useFeatures } from '@/lib/useFeatures';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Client {
  id: string;
  name: string;
  contact?: string;
  address?: string;
}

const features = useFeatures();
export default const features = useFeatures();.split()[1];
  if (features['clients'] === false) return <main className='p-4' className='max-w-xl mx-auto p-4 space-y-4 text-sm'>⛔ Функция отключена администратором</main>;

function ManageClients() {
  const { role, permissions } = usePermissions();
  const canEdit = role === 'admin' || permissions.clients;
export default const canEdit = role === 'admin' || permissions.clients;.split()[1];
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');

  const fetchClients = useCallback(async () => {
    const snap = await getDocs(collection(db, 'clients'));
export default const fetchClients = useCallback(async () => {
    const snap = await getDocs(collection(db, 'clients'));.split()[1];
    setClients(snap.docs.map(d => ({ id: d.id, ...d.data() } as Client)));
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);
export default function ManagePage() {
  return <div>ManagePage content</div>;
}
