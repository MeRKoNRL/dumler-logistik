'use client';
import React, { useState, useEffect } from 'react';


  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && (!user || !['admin', 'dispatcher'].includes(user.role))) {
      router.push('/');
    }
  }, [user, loading]);

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<{ plate: string; model?: string; assignedTo?: string; status?: string }[]>([]);
  const [filter, setFilter] = useState('');

  const [sortByStatus, setSortByStatus] = useState<'asc' | 'desc'>('asc');

  const filteredVehicles = [...vehicles]
    .filter(v =>
      (v.plate || '').toLowerCase().includes(filter.toLowerCase()) ||
      (v.assignedTo || '').toLowerCase().includes(filter.toLowerCase()) ||
      (v.model || '').toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const s1 = a.status || '';
      const s2 = b.status || '';
      return sortByStatus === 'asc' ? s1.localeCompare(s2) : s2.localeCompare(s1);
    });


  const db = getFirestore(app);

  useEffect(() => {
    const fetchVehicles = async () => {
      const ref = collection(db, 'vehicles');
      const snap = await getDocs(ref);
      const data: any[] = [];
      snap.forEach(doc => data.push(doc.data()));
      setVehicles(data);
    };
    fetchVehicles();
  }, []);

  const updateVehicle = async (index: number, field: string, value: any) => {
    const updated = [...vehicles];
    updated[index][field] = value;
    setVehicles(updated);
    const id = updated[index].plate || `vehicle-${index}`;
    await setDoc(doc(db, 'vehicles', id), updated[index]);
    toast.success('Машина обновлена');
  };

  return (
    <OnlyPermission permission="vehicles"><main className="max-w-screen-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Автопарк</h1>
      <input
        className="border px-3 py-1 mb-4 text-sm w-full"
        placeholder="Фильтр по госномеру или водителю..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <div className="responsive-table">
<table className="table-auto border w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Госномер</th>
            <th className="border px-2 py-1">Модель</th>
            <th className="border px-2 py-1">Водитель</th>
            <th className="border px-2 py-1 cursor-pointer hover:underline" onClick={() => setSortByStatus(sortByStatus === 'asc' ? 'desc' : 'asc')}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {vehicles
            .filter(v => !filter || v.plate?.toLowerCase().includes(filter.toLowerCase()) || v.assignedTo?.toLowerCase().includes(filter.toLowerCase()))
            .map((v, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">
                <input value={v.plate} className="w-full text-xs" onChange={e => updateVehicle(i, 'plate', e.target.value)} />
              </td>
              <td className="border px-2 py-1">
                <input value={v.model || ''} className="w-full text-xs" onChange={e => updateVehicle(i, 'model', e.target.value)} />
              </td>
              <td className="border px-2 py-1">
                <input value={v.assignedTo || ''} className="w-full text-xs" onChange={e => updateVehicle(i, 'assignedTo', e.target.value)} />
              </td>
              <td className="border px-2 py-1">
                <select value={v.status || 'активен'} className="w-full text-xs" onChange={e => updateVehicle(i, 'status', e.target.value)}>
                  <option value="активен">активен</option>
                  <option value="в ремонте">в ремонте</option>
                  <option value="неактивен">неактивен</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
</div>
    </main></OnlyPermission>
  );
}