'use client';
import { useState } from 'react';
import { useRole } from '@/context/RoleContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setRole } = useRole();

  const handleLogin = async () => {
    try {
      // логика входа
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>Login Page</div>
  );
};

export default LoginPage;
