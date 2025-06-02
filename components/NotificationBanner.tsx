'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firestore';

export default function NotificationBanner() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, 'maintenance_requests'), (snap) => {
      if (!snap.empty) {
        const doc = snap.docs[snap.docs.length - 1];
        const data = doc.data();
        setMessage(`Новая заявка от ${data.email}`);
        setTimeout(() => setMessage(null), 5000);
      }
    });

    const unsub2 = onSnapshot(collection(db, 'vacations'), (snap) => {
      if (!snap.empty) {
        const doc = snap.docs[snap.docs.length - 1];
        const data = doc.data();
        setMessage(`Новая заявка на отпуск от ${data.email}`);
        setTimeout(() => setMessage(null), 5000);
      }
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-300 text-black px-6 py-2 rounded shadow z-50">
      {message}
    </div>
  );
}
