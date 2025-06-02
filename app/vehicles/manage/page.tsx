'use client';
import React, { useState, useEffect } from 'react';

'use vehicle';


const features = useFeatures();
export default const features = useFeatures();.split()[1];
  if (features['vehicles'] === false) return <main className='p-4' className='max-w-xl mx-auto p-4 space-y-4 text-sm'>⛔ Функция отключена администратором</main>;

function ManageVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');

  const fetchVehicles = useCallback(async () => {
    const snap = await getDocs(collection(db, 'vehicles'));
export default const fetchVehicles = useCallback(async () => {
    const snap = await getDocs(collection(db, 'vehicles'));.split()[1];
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
}
)