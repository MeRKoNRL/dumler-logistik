'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { format } from 'date-fns';

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      const res = await fetch('/api/notifications?userId=' + user.uid);
      const data = await res.json();
      setNotifications(data);
    };
    fetchNotifications();
  }, [user]);

  const markAsRead = async (id: string) => {
    await fetch('/api/notifications/read', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-xl"
        aria-label="Уведомления"
      >
        🔔
        {notifications.some(n => !n.read) && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            !
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border rounded shadow z-50 p-2">
          <h3 className="text-sm font-bold mb-2">Уведомления</h3>
          {notifications.length === 0 && <p className="text-sm">Нет уведомлений</p>}
          <ul className="space-y-1">
            {notifications.map(n => (
              <li
                key={n.id}
                className={\`p-2 rounded text-sm \${n.read ? 'text-gray-500' : 'font-semibold bg-blue-50'}\`}
              >
                {n.message}
                <div className="text-xs mt-1 flex justify-between">
                  <span>{format(new Date(n.createdAt.seconds * 1000), 'dd.MM.yyyy HH:mm')}</span>
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Прочитано
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}