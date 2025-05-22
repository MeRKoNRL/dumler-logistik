import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * История действий конкретного пользователя
 */
const UserLog = () => {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/logs/user/' + encodeURIComponent(id))
      .then(res => res.json())
      .then(setLogs);
  }, [id]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📄 История действий: {id}</h2>
      <table className="w-full border">
        <thead className="bg-gray-100 text-center">
          <tr>
            <th className="p-2 border">Действие</th>
            <th className="p-2 border">Подробности</th>
            <th className="p-2 border">Дата</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i} className="text-center">
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

export default UserLog;
