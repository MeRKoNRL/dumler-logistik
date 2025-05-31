'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { format } from 'date-fns';
import Link from 'next/link';

export default function DailyPlanCalendar() {
  const [dates, setDates] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'daily_plans'));
      const map: Record<string, number> = {};
      snap.docs.forEach(doc => {
        const d = doc.data();
        map[d.date] = (d.entries || []).length;
      });
      setDates(map);
    };
    fetch();
  }, []);
}