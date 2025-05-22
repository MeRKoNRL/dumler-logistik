import React, { useEffect, useState } from 'react';

/**
 * Панель администратора: список пользователей, возможность добавления и изменения ролей
 */
const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/admin/users')
      .then(res => res.json())
      .then(data => setUsers(data.map(u => ({ ...u, disabled: u.disabled }))));
  }, []);

  const updateRole = async (uid, role) => {
    const res = await fetch('http://localhost:3001/admin/set-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, role })
    });

    if (res.ok) {
      alert('Роль обновлена');
      window.location.reload();
    } else {
      alert('Ошибка обновления роли');
    }
  };

  const createUser = async () => {
    const res = await fetch('http://localhost:3001/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    if (res.ok) {
      alert('Пользователь создан');
      setEmail('');
      setPassword('');
      setRole('');
      window.location.reload();
    } else {
      alert('Ошибка создания пользователя');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">👥 Управление пользователями</h2>

      <button
        onClick={makeBackup}
        className="mb-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        💾 Сделать резервную копию
      </button>

      <div className="bg-gray-50 p-4 mb-6 rounded shadow">
        <h3 className="text-md font-semibold mb-2">➕ Создать нового пользователя</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="border p-2 mr-2 rounded"
        >
          <option value="">Выбрать роль</option>
          <option value="водитель">Водитель</option>
          <option value="диспетчер">Диспетчер</option>
          <option value="админ">Админ</option>
        </select>
        <button onClick={createUser} className="bg-blue-600 text-white px-4 py-2 rounded">
          Создать
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100 text-center">
          <tr>
            <th className="p-2 border">UID</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Текущая роль</th>
            <th className="p-2 border">Назначить новую</th>
<th className="p-2 border">Статус</th>
          </tr>

        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i} className="text-center">
              <td className="p-2 border text-xs">{u.uid}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role || 'не указана'}</td>
              <td className="p-2 border">
                <select onChange={(e) => updateRole(u.uid, e.target.value)} defaultValue="">
                  <option value="" disabled>Выбрать...</option>
                  <option value="водитель">Водитель</option>
                  <option value="диспетчер">Диспетчер</option>
                  <option value="админ">Админ</option>
                </select>
              </td>
              <td className='p-2 border'>
                <button
                  onClick={() => toggleStatus(u.uid, u.disabled)}
                  className={`px-3 py-1 rounded text-white ${u.disabled ? 'bg-green-600' : 'bg-red-600'}`}
                >
                  {u.disabled ? 'Разблокировать' : 'Заблокировать'}
                </button>
              </td>
            </tr>

          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;


  const makeBackup = async () => {
    const res = await fetch('http://localhost:3001/backup-now', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      alert('Резервная копия создана: ID ' + data.backupFileId);
    } else {
      alert('Ошибка создания резервной копии');
    }
  };
