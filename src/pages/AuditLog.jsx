import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Страница: журнал действий пользователей
 */
const AuditLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const load = () => fetch('http://localhost:3001/logs').then(res => res.json()).then(setLogs);
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
    fetch('http://localhost:3001/logs')
      .then(res => res.json())
      .then(setLogs);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📜 Журнал действий</h2>
      <table className="w-full border">
        <thead className="bg-gray-100 text-center">
          <tr>
            <th className="p-2 border">Пользователь</th>
            <th className="p-2 border">Действие</th>
            <th className="p-2 border">Подробности</th>
            <th className="p-2 border">Дата</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} className="text-center">
              <td className="p-2 border"><Link to={`/logs/user/${log.email}`} className='text-blue-600 hover:underline'>{log.email}</Link></td>
              <td className="p-2 border">{log.action}</td>
              <td className="p-2 border">{log.detail}</td>
              <td className="p-2 border">{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLog;
