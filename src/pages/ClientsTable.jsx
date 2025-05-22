import React, { useEffect, useState } from 'react';

const ClientsTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/clients')
      .then(res => res.json())
      .then(data => {
        setRows(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Загрузка...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Клиенты на сегодня</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Водитель</th>
            <th className="p-2 border">Тур</th>
            <th className="p-2 border">Авто</th>
            <th className="p-2 border">Всего клиентов</th>
            <th className="p-2 border">Осталось</th>
            <th className="p-2 border">Инфо</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="text-center">
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">{r[0]}</td>
              <td className="p-2 border">{r[1]}</td>
              <td className="p-2 border">{r[2]}</td>
              <td className="p-2 border">{r[3]}</td>
              <td className="p-2 border">{r[4]}</td>
              <td className="p-2 border">{r[5]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsTable;
