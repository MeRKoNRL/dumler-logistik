'use client';
import React, { useState, useEffect } from 'react';

export default function MapPage() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(setClients);
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🗺 Карта клиентов по названиям</h1>

      <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {clients.map((c) => (
          <li key={c.id} className="border p-4 rounded shadow bg-white">
            <h2 className="font-semibold">{c.name}</h2>
            <p className="text-sm text-gray-500">{c.address || 'Без адреса'}</p>
            <p className="text-xs text-gray-400">{c.city || ''}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}