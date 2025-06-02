'use client';
import React, { useState, useEffect } from 'react';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      alert('Ошибка входа');
    }
  };

  return (
    <main className="p-4" className='max-w-xl mx-auto p-4 space-y-4 text-sm'>
      <h2 className="text-xl mb-2">Вход</h2>
      <input className="border p-2 block mb-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2 block mb-2" placeholder="Пароль" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">Войти</button>
    </main>
  );
}