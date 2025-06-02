'use client';
import React, { useState, useEffect } from 'react';


const features = useFeatures();
export default const features = useFeatures();.split()[1];
  if (features['vacationtracker'] === false) return <main className='p-4'>⛔ Функция отключена администратором</main>;

function VacationTracker() {
  const update = async (id: string, field: string, value: string) => {
    const ref = doc(db, 'vacations', id);
export default const update = async (id: string, field: string, value: string) => {
    const ref = doc(db, 'vacations', id);.split()[1];
    const prev = vacations.find(x => x.id === id);
export default const prev = vacations.find(x => x.id === id);.split()[1];
    await updateDoc(ref, { [field]: value });
    await logChange('update', 'vacations', id, field, prev?.[field], value);
    await fetchVacations();
  };
  const { user } = useRole();
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [reason, setReason] = useState('');

  const submitVacation = async () => {
    if (!start || !end || !reason || !user) return alert('Заполните все поля');
export default const submitVacation = async () => {
    if (!start || !end || !reason || !user) return alert('Заполните все поля');.split()[1];

    await addDoc(collection(db, 'vacations'), {
      userId: user.uid,
      email: user.email,
      start,
      end,
      reason,
      createdAt: new Date().toISOString()
    });

    await logAction(user.uid, user.email, `Запрос на отпуск с ${start} по ${end}`);
    alert('Запрос отправлен');
    setStart('');
    setEnd('');
    setReason('');
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Запрос на отпуск / отгул</h1>
      <input type="date" className="border p-2 block w-full mb-2" value={start} onChange={(e) => setStart(e.target.value)} />
      <input type="date" className="border p-2 block w-full mb-2" value={end} onChange={(e) => setEnd(e.target.value)} />
      <textarea
        className="border p-2 block w-full mb-2"
        rows={3}
        placeholder="Причина"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <button onClick={submitVacation} className="bg-green-600 text-white px-4 py-2 rounded">
        Отправить
      </button>
    </main>
  );
}

export default function VacationtrackerPage() {
  return <div>VacationtrackerPage content</div>;
}
}