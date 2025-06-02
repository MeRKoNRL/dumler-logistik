'use client';
import React, { useState, useEffect } from 'react';

export default function SlaPage() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/sla/check')
      .then(res => res.json())
      .then(setClients);
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🚨 Просроченные клиенты (SLA &gt; 3д)</h1>

      {clients.length === 0 && <p>Все клиенты обслужены вовремя ✅</p>}

      {clients.length > 0 && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Клиент</th>
              <th className="p-2 text-left">Последний раз</th>
              <th className="p-2 text-left">Просрочка</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.lastServed ? new Date(c.lastServed).toLocaleDateString() : 'Никогда'}</td>
                <td className="p-2 text-red-600">{c.overdue ? `${c.overdue} дней` : '∞'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}