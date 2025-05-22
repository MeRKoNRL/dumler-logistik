import React, { useState } from 'react';

const ClientDistribution = ({ tour, total, onClose }) => {
  const [distribution, setDistribution] = useState([{ driver: '', count: total }]);

  const handleAdd = () => {
    setDistribution([...distribution, { driver: '', count: 0 }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...distribution];
    updated[index][field] = field === 'count' ? parseInt(value) || 0 : value;
    setDistribution(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Распределение клиентов: Тур {tour}</h2>
        {distribution.map((entry, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              className="flex-1 border p-2 rounded"
              placeholder="Имя водителя"
              value={entry.driver}
              onChange={(e) => handleChange(idx, 'driver', e.target.value)}
            />
            <input
              className="w-24 border p-2 rounded"
              type="number"
              value={entry.count}
              onChange={(e) => handleChange(idx, 'count', e.target.value)}
            />
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <button onClick={handleAdd} className="text-blue-600">+ Добавить</button>
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded">Готово</button>
        </div>
      </div>
    </div>
  );
};

export default ClientDistribution;
