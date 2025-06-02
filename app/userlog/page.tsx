'use client';
import React, { useState, useEffect } from 'react';



export default function UserLog() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <main className="p-4 max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Журнал действий</h1>
        {dummyLogs.map((log, i) => (
          <div key={i} className="border rounded p-3 mb-2">
            <p><strong>{log.user}</strong> - {log.action}</p>
            <p className="text-xs text-gray-400">{log.time}</p>
          </div>
        ))}
      </main>
    </ProtectedRoute>
  );
}