import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

/**
 * График: Сколько клиентов у каждого водителя на сегодня
 */
const ClientsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/chart/clients')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow mt-4">
      <h2 className="text-lg font-bold mb-4"> Клиенты по водителям</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="driver" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="clients" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClientsChart;
