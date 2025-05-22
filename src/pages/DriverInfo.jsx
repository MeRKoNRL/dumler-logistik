import React, { useState } from 'react';

/**
 * Форма, где водитель указывает:
 * - Информацию о больничном
 * - Сведения об утерянной посылке: где, когда, стоимость
 */
const DriverInfo = () => {
  const [form, setForm] = useState({
    name: '',
    sickNote: '',
    lostPackage: '',
    cost: '',
    location: '',
    date: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:3001/driver-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert('Информация отправлена');
      setForm({
        name: '',
        sickNote: '',
        lostPackage: '',
        cost: '',
        location: '',
        date: ''
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Информация от водителя</h2>
      <input name="name" placeholder="Ваше имя" value={form.name} onChange={handleChange} className="border p-2 w-full mb-2" />
      <textarea name="sickNote" placeholder="Больничный" value={form.sickNote} onChange={handleChange} className="border p-2 w-full mb-2" />
      <textarea name="lostPackage" placeholder="Утерянная посылка" value={form.lostPackage} onChange={handleChange} className="border p-2 w-full mb-2" />
      <input name="cost" placeholder="Стоимость" value={form.cost} onChange={handleChange} className="border p-2 w-full mb-2" />
      <input name="location" placeholder="Место" value={form.location} onChange={handleChange} className="border p-2 w-full mb-2" />
      <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 w-full mb-4" />
      <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded w-full">Отправить</button>
    </div>
  );
};

export default DriverInfo;
