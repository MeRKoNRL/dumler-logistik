'use client';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRole } from '@/lib/useRole';
import { logAction } from '@/lib/logger';

export default function RequestFormPage() {
  const { user } = useRole();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  const submitRequest = async () => {
    if (!type || !description || !user) return alert('Заполните все поля');

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
