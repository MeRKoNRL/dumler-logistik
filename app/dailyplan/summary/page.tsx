'use client';

import dynamic from 'next/dynamic';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';

import { useEffect, useState } from 'react';

import { collection, getDocs } from 'firebase/firestore';

import { db } from '@/lib/firestore';



import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';


export default function DailyPlanSummary() {
  
  const handleExportSummaryExcel = async () => {
    const res = await fetch('/api/dailyplan/summary/export/excel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
