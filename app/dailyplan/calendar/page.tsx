'use client';
import React, { useState, useEffect } from 'react';


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