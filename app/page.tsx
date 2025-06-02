'use client';
import { useState } from 'react';

const Page = () => {
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // логика
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>Главная</div>
  );
};

export default Page;
