'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // регистрация
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>Register Page</div>
  );
};

export default RegisterPage;
