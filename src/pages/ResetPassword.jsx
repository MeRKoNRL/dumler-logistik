import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Ссылка на сброс отправлена на почту');
    } catch (error) {
      alert('Ошибка: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6 text-center">Сброс пароля</h1>
        <input
          type="email"
          placeholder="Введите Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-6 p-2 border rounded"
        />
        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Отправить ссылку на сброс
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
