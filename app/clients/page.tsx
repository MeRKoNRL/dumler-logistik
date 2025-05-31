'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { app } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { OnlyPermission } from '@/components/Access';

type PlanEntry = {
  name: string;
  city?: string;
  remaining?: number;
};

export default function ClientsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<PlanEntry[]>([]);
  const [filter, setFilter] = useState('');

  const db = getFirestore(app);

  useEffect(() => {
    if (!loading && (!user || !['admin', 'dispatcher'].includes(user.role))) {
      router.push('/');
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const ref = collection(db, 'clients');
        const snap = await getDocs(ref);
        const data: PlanEntry[] = [];
        snap.forEach(doc => data.push(doc.data() as PlanEntry));
        setClients(data);
      } catch (error) {
        toast.error('Ошибка загрузки клиентов');
      }
    };
    fetchClients();
  }, []);

  const updateClient = async (index: number, field: keyof PlanEntry, value: any) => {
    try {
      const updated = [...clients];
      updated[index][field] = field === 'remaining' ? parseInt(value || '0') : value;
      setClients(updated);
      const id = updated[index].name;
      await setDoc(doc(db, 'clients', id), updated[index]);
      toast.success('Клиент обновлён');
    } catch (error) {
      toast.error('Ошибка обновления клиента');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <OnlyPermission role={['admin', 'dispatcher']}>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Клиенты</h1>
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Поиск по имени"
          className="border p-2 rounded mb-4 w-full"
        />
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Имя</th>
              <th className="border p-2">Город</th>
              <th className="border p-2">Остаток</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, index) => (
              <tr key={client.name}>
                <td className="border p-2">{client.name}</td>
                <td className="border p-2">
                  <input
                    className="w-full border p-1"
                    value={client.city || ''}
                    onChange={e => updateClient(index, 'city', e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    className="w-full border p-1"
                    type="number"
                    value={client.remaining ?? ''}
                    onChange={e => updateClient(index, 'remaining', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </OnlyPermission>
  );
}
