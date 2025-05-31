'use client';

import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { logAction } from '@/lib/logAction';
import { OnlyPermission } from '@/components/Access';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { saveAs } from 'file-saver';

type User = { uid: string; email: string; role: string };
type Note = { id: string; text: string; createdAt?: { seconds: number } };
type PlanEntry = Record<string, any>; // Временно, можно заменить на точный тип

export default function AdminPanel() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const db = getFirestore(app);
        const snap = await getDocs(collection(db, 'notifications'));
        const notes: Note[] = [];
        snap.forEach(doc => notes.push({ id: doc.id, ...doc.data() } as Note));
        setNotifications(notes);
      } catch (error) {
        toast.error('Ошибка загрузки уведомлений');
      }
    };
    fetchNotifications();
  }, []);

  const exportBackup = async () => {
    try {
      const db = getFirestore(app);
      const collections = ['daily_plans', 'clients', 'vehicles', 'absences', 'lost_packages'];
      const backup: Record<string, PlanEntry[]> = {};
      for (const name of collections) {
        const snap = await getDocs(collection(db, name));
        backup[name] = [];
        snap.forEach(doc => backup[name].push({ id: doc.id, ...doc.data() }));
      }
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      saveAs(blob, 'dumler_backup.json');
      toast.success('Бэкап успешно создан');
    } catch (error) {
      toast.error('Ошибка при создании бэкапа');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <OnlyPermission role="admin">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Админ-панель</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={exportBackup}
        >
          Создать бэкап данных
        </button>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Уведомления:</h2>
          <ul className="list-disc pl-5">
            {notifications.map(note => (
              <li key={note.id}>{note.text}</li>
            ))}
          </ul>
        </div>
      </div>
    </OnlyPermission>
  );
}
