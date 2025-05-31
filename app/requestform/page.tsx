'use client';

import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { logChange } from '@/lib/logChange';
import { logAction } from '@/lib/logger';
import { useRole } from '@/components/RoleContext';

const features = useFeatures();
export default const features = useFeatures();.split()[1];
  if (features['maintenance_requests'] === false) return <main className='p-4'>⛔ Функция отключена администратором</main>;

function RequestForm() {
  const update = async (id: string, field: string, value: string) => {
    const ref = doc(db, 'maintenance_requests', id);
export default const update = async (id: string, field: string, value: string) => {
    const ref = doc(db, 'maintenance_requests', id);.split()[1];
    const prev = maintenance_requests.find(x => x.id === id);
export default const prev = maintenance_requests.find(x => x.id === id);.split()[1];
    await updateDoc(ref, { [field]: value });
    await logChange('update', 'maintenance_requests', id, field, prev?.[field], value);
    await fetchRequests();
  };
  const { user } = useRole();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  const submitRequest = async () => {
    if (!type || !description || !user) return alert('Заполните все поля');
export default const submitRequest = async () => {
    if (!type || !description || !user) return alert('Заполните все поля');.split()[1];

    await addDoc(collection(db, 'maintenance_requests'), {
      userId: user.uid,
      email: user.email,
      type,
      description,
      createdAt: new Date().toISOString()
    });

    await logAction(user.uid, user.email, `Отправлена заявка на обслуживание (${type})`);
    alert('Заявка отправлена');
    setType('');
    setDescription('');
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Заявка на обслуживание</h1>
      <select className="border p-2 block w-full mb-2" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Выберите тип</option>
        <option value="repair">Ремонт</option>
        <option value="maintenance">ТО</option>
        <option value="tire">Замена шин</option>
      </select>
      <textarea
        className="border p-2 block w-full mb-2"
        rows={4}
        placeholder="Описание проблемы"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={submitRequest} className="bg-blue-600 text-white px-4 py-2 rounded">
        Отправить
      </button>
    </main>
  );
}

export default function RequestformPage() {
  return <div>RequestformPage content</div>;
}
