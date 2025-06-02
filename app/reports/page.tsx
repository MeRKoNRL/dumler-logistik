'use client';
import React, { useState, useEffect } from 'react';
import OnlyPermission from '@/components/OnlyPermission';

export default function ReportsPage() {
  const [summary] = useState<any[]>([]);

  return (
    <OnlyPermission permission="reports">
      <main className="max-w-screen-md mx-auto p-4">
        <h1 className="text-xl font-semibold mb-4">Отчёты по водителям</h1>
        <p>Пока нет данных для отображения.</p>
      </main>
    </OnlyPermission>
  );
}
