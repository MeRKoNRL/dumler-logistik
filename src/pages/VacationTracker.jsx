import React, { useState, useEffect } from 'react';

const VacationTracker = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/vacations')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Загрузка...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Учёт дней отпуска и отгулов</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="p-2 border">Водитель</th>
            <th className="p-2 border">Отпуск всего</th>
            <th className="p-2 border">Отпуск использовано</th>
            <th className="p-2 border">Отпуск остаток</th>
            <th className="p-2 border">Отгулы всего</th>
            <th className="p-2 border">Отгулы использовано</th>
            <th className="p-2 border">Отгулы остаток</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} className="text-center">
              <td className="p-2 border">{r[0]}</td>
              <td className="p-2 border">{r[1]}</td>
              <td className="p-2 border">{r[2]}</td>
              <td className="p-2 border">{r[3]}</td>
              <td className="p-2 border">{r[4]}</td>
              <td className="p-2 border">{r[5]}</td>
              <td className="p-2 border">{r[6]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VacationTracker;
