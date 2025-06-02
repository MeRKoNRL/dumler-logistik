'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';

export function ReminderList() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const load = async () => {
    if (!user) return;
    const res = await fetch('/api/reminders?userId=' + user.uid);
    const data = await res.json();
    setReminders(data);
  };

  useEffect(() => {
    load();
  }, [user]);

  const create = async () => {
    await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.uid, title, dueDate }),
    });
    setTitle('');
    setDueDate('');
    load();
  };

  const markDone = async (id: string) => {
    await fetch('/api/reminders/done', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">🔔 Напоминания</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Что напомнить?"
          className="border px-2 py-1 w-full"
        />
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="border px-2 py-1"
        />
        <button onClick={create} className="bg-blue-600 text-white px-4 rounded">
          ➕
        </button>
      </div>

      <ul className="space-y-1">
        {reminders.map(r => (
          <li key={r.id} className={\`border p-2 rounded \${r.done ? 'line-through text-gray-500' : ''}\`}>
            <div className="flex justify-between items-center">
              <span>{r.title} — {new Date(r.dueDate.seconds * 1000).toLocaleDateString()}</span>
              {!r.done && (
                <button
                  onClick={() => markDone(r.id)}
                  className="text-green-600 hover:underline text-sm"
                >
                  Выполнено
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}