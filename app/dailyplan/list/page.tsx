'use client';

import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';

import { useEffect, useState } from 'react';

import { collection, getDocs } from 'firebase/firestore';

import { db } from '@/lib/firestore';
import Link from 'next/link';

export default function DailyPlanList() {
  
  const [filterDriver, setFilterDriver] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('');
  const [filterClient, setFilterClient] = useState('');
    
  
  const handleExportExcel = async () => {
    const res = await fetch('/api/dailyplan/export/excel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        driver: filterDriver,
        vehicle: filterVehicle,
        client: filterClient
      })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
