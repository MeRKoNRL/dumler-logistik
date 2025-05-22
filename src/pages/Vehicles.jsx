import React, { useEffect, useState } from 'react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => fetch('http://localhost:3001/vehicles').then(res => res.json()).then(setVehicles);
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
    fetch('http://localhost:3001/vehicles')
      .then(res => res.json())
      .then(data => {
        setVehicles(data.map((v, i) => ({ id: i, values: v })));
        setLoading(false);
      });
  }, []);

  const handleChange = (id, index, value) => {
    const updated = vehicles.map(vehicle =>
      vehicle.id === id
        ? { ...vehicle, values: [...vehicle.values.slice(0, index), value, ...vehicle.values.slice(index + 1)] }
        : vehicle
    );
    setVehicles(updated);
  };

  const handleSave = async (id) => {
    const vehicle = vehicles.find(v => v.id === id);
    const res = await fetch('http://localhost:3001/update-vehicle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ row: id + 2, values: vehicle.values })
    });
    if (res.ok) alert('Сохранено!');
  };

  if (loading) return <p className="p-4">Загрузка...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Состояние автомобилей</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="p-2 border">Номер авто</th>
            <th className="p-2 border">Тип</th>
            <th className="p-2 border">Состояние</th>
            <th className="p-2 border">Дата аренды</th>
            <th className="p-2 border">Дата возврата</th>
            <th className="p-2 border">Комментарий</th>
            <th className="p-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id} className="text-center">
              {v.values.map((val, i) => (
                <td className="p-2 border" key={i}>
                  <input
                    className="w-full border rounded p-1"
                    value={val}
                    onChange={(e) => handleChange(v.id, i, e.target.value)}
                  />
                </td>
              ))}
              <td className="p-2 border">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleSave(v.id)}
                >
                  💾
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vehicles;
