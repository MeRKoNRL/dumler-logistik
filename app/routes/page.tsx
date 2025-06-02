'use client';
import React, { useState, useEffect } from 'react';


interface Route {
  id: string;
  email: string;
  client: string;
  vehicle: string;
  date: string;
  cargo?: string;
}

export default function Routes() {
  const features = useFeatures();
  if (features.routes === false) return <main className='p-4' className='max-w-xl mx-auto p-4 space-y-4 text-sm'>⛔ Маршруты отключены администратором</main>;
  const update = async (id: string, field: string, value: string) => {
    const ref = doc(db, 'routes', id);
    const prev = routes.find(x => x.id === id);
    await updateDoc(ref, { [field]: value });
    await logChange('update', 'routes', id, field, prev?.[field], value);
    await fetchRoutes();
  };
  const [routes, setRoutes] = useState<Route[]>([]);
  const [email, setEmail] = useState('');
  const [client, setClient] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [date, setDate] = useState('');
  const [cargo, setCargo] = useState('');

  const [filterEmail, setFilterEmail] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const fetchRoutes = async () => {
    const snap = await getDocs(collection(db, 'routes'));
    setRoutes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Route)));
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const filtered = useMemo(() => {
    return routes.filter(r =>
      (!filterEmail || r.email?.includes(filterEmail)) &&
      (!filterDate || r.date?.startsWith(filterDate))
    );
  }, [routes, filterEmail, filterDate]);
}