'use client';
import { useState } from 'react';

const Register = () => {
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    try {
      // регистрация
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>Регистрация</div>
  );
};

export default Register;
