'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebaseAuth';
import { logAction } from '@/lib/logger';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';


export default function DriverReport() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{ total: number; types: Record<string, number> }>({ total: 0, types: {} });
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const load = async () => {
    if (!start || !end || !user?.email) return;
    const res = await fetch('/api/stats/driver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, start, end }),
    });
    const data = await res.json();
    setStats(data);
  };

  const downloadPDF = async () => {
    const res = await fetch('/api/stats/driver/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user?.email, start, end }),
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
