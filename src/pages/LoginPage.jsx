import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useRole } from '../components/RoleContext';

/**
 * Страница входа, использует Firebase Authentication
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setRole } = useRole();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const emailLower = userCred.user.email.toLowerCase();
      // Назначение роли временно на основе email (можно заменить на claims)
      const role = emailLower.includes('driver') ? 'водитель' : 'диспетчер';
      setRole(role);
      navigate('/dashboard');
    } catch (error) {
      alert('Ошибка входа: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Dumler Logistik</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-2 border rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Войти
        </button>
        <div className="flex justify-between mt-4">
          <a href="/register" className="text-blue-600 text-sm">Регистрация</a>
          <a href="/reset" className="text-blue-600 text-sm">Забыли пароль?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
