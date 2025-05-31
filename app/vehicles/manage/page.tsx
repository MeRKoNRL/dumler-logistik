'use client';

'use vehicle';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firestore';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { logChange } from '@/lib/logChange';
import { logAction } from '@/lib/logger';
import { useFeatures } from '@/lib/useFeatures';
import ProtectedRoute from '@/components/ProtectedRoute';

export default 
  const features = useFeatures();
  if (features['vehicles'] === false) return <main className='p-4' className='max-w-xl mx-auto p-4 space-y-4 text-sm'>⛔ Функция отключена администратором</main>;

function ManageVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');

  const fetchVehicles = useCallback(async () => {
    const snap = await getDocs(collection(db, 'vehicles'));
    setVehicles(snap.docs.map(d => ({ id: d.id,  id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  
    fetchVehicles();
  }, []);

export default function ManagePage() {
  return <div>ManagePage content</div>;
}
