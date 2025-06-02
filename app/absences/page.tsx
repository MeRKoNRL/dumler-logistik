'use client';
import React, { useState, useEffect } from 'react';

export default function AbsenceRequestPage() {
  const [type, setType] = useState('отпуск');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [userId, setUserId] = useState(''); // для примера, можно заменить на auth.currentUser.uid

  const handleSubmit = async () => {
    if (!userId || !start || !end) {
      toast.error('Все поля обязательны');
      return;
    }

    const db = getFirestore(app);
    await addDoc(collection(db, 'absences'), {
      userId,
      type,
      startDate: start,
      endDate: end,
      createdAt: new Date()
    });

    toast.success('Заявка отправлена');
    setStart('');
    setEnd('');
    setType('отпуск');
  };

  return (
    <main className="max-w-screen-sm mx-auto p-4">
      <h1 className="text-lg font-semibold mb-4">Запрос отсутствия</h1>
      <input placeholder="ID пользователя" value={userId} onChange={e => setUserId(e.target.value)} className="border mb-2 w-full p-2 text-sm" />
      <select value={type} onChange={e => setType(e.target.value)} className="border mb-2 w-full p-2 text-sm">
        <option value="отпуск">Отпуск</option>
        <option value="больничный">Больничный</option>
        <option value="отгул">Отгул</option>
      </select>
      <input type="date" value={start} onChange={e => setStart(e.target.value)} className="border mb-2 w-full p-2 text-sm" />
      <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="border mb-4 w-full p-2 text-sm" />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Отправить</button>
    </main>
  );
}