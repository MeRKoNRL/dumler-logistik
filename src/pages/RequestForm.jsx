import React, { useState } from 'react';

const RequestForm = () => {
  const [form, setForm] = useState({ name: '', type: 'Отпуск', comment: '', date: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:3001/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert('Заявка отправлена!');
      setForm({ name: '', type: 'Отпуск', comment: '', date: '' });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Оставить заявку</h2>
      <input name="name" className="border p-2 w-full mb-2" placeholder="Ваше имя" value={form.name} onChange={handleChange} />
      <select name="type" className="border p-2 w-full mb-2" value={form.type} onChange={handleChange}>
        <option>Отпуск</option>
        <option>Отгул</option>
        <option>Больничный</option>
        <option>Ремонт авто</option>
      </select>
      <input name="comment" className="border p-2 w-full mb-2" placeholder="Комментарий" value={form.comment} onChange={handleChange} />
      <input name="date" type="date" className="border p-2 w-full mb-2" value={form.date} onChange={handleChange} />
      <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded w-full">Отправить</button>
    </div>
  );
};

export default RequestForm;
