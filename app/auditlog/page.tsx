'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';

interface Vacation {
  email: string;
  reason: string;
  start: string;
  end: string;
  createdAt: string;
  approved?: boolean;
  id: string;
}

export default function AuditLog() {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [filtered, setFiltered] = useState<Vacation[]>([]);
  const [emailFilter, setEmailFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [onlyApproved, setOnlyApproved] = useState(false);

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'vacations'), orderBy('createdAt', 'desc')));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vacation));
      setVacations(data);
      setFiltered(data);
    } catch (error) {
      toast.error('Ошибка загрузки журнала');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = vacations;
    if (emailFilter) {
      result = result.filter(v => v.email.toLowerCase().includes(emailFilter.toLowerCase()));
    }
    if (startDate) {
      result = result.filter(v => v.createdAt >= startDate);
    }
    if (endDate) {
      result = result.filter(v => v.createdAt <= endDate + 'T23:59:59');
    }
    if (onlyApproved) {
      result = result.filter(v => v.approved);
    }
    setFiltered(result);
  }, [emailFilter, startDate, endDate, onlyApproved, vacations]);

  const approve = async (id: string) => {
    await updateDoc(doc(db, 'vacations', id), { approved: true });
    fetchData();
    toast.success('Заявка подтверждена');
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, 'vacations', id));
    fetchData();
    toast.success('Запись удалена');
  };

  return (
    <ProtectedRoute>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Журнал отпусков и отсутствий</h1>

        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            placeholder="Email"
            value={emailFilter}
            onChange={e => setEmailFilter(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={onlyApproved}
              onChange={e => setOnlyApproved(e.target.checked)}
            />
            Только подтверждённые
          </label>
        </div>

        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr>
              <th className="border p-2">Email</th>
              <th className="border p-2">Причина</th>
              <th className="border p-2">Срок</th>
              <th className="border p-2">Дата создания</th>
              <th className="border p-2">Статус</th>
              <th className="border p-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id}>
                <td className="border p-2">{v.email}</td>
                <td className="border p-2">{v.reason}</td>
                <td className="border p-2">{v.start} — {v.end}</td>
                <td className="border p-2">{v.createdAt}</td>
                <td className="border p-2">{v.approved ? '✅' : '⏳'}</td>
                <td className="border p-2 flex gap-2">
                  {!v.approved && (
                    <button onClick={() => approve(v.id)} className="text-green-600">Подтвердить</button>
                  )}
                  <button onClick={() => remove(v.id)} className="text-red-600">Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
}
