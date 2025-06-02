'use client';
import React, { useState, useEffect } from 'react';


export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      const rolesSnapshot = await getDocs(collection(db, 'roles'));
      const usersList: any[] = [];
      const roleMap: Record<string, string> = {};

      rolesSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        usersList.push({ id: docSnap.id, ...data });
        roleMap[docSnap.id] = data.role;
      });

      setUsers(usersList);
      setRoles(roleMap);
    };

    fetchUsers();
  }, []);

  const updateRole = async (uid: string, newRole: string) => {
    await setDoc(doc(db, 'roles', uid), { role: newRole }, { merge: true });
    setRoles((prev) => ({ ...prev, [uid]: newRole }));
    alert(`Роль обновлена для ${uid}`);
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <main className="p-4 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Управление пользователями</h1>
        <div className="responsive-table">
<table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">UID</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Роль</th>
              <th className="p-2 border">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-2 border">{user.id}</td>
                <td className="p-2 border">{user.email || '-'}</td>
                <td className="p-2 border">{roles[user.id]}</td>
                <td className="p-2 border">
                  <select
                    value={roles[user.id]}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="border p-1"
                  >
                    <option value="admin">admin</option>
                    <option value="dispatcher">dispatcher</option>
                    <option value="driver">driver</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
</div>
      </main>
    </ProtectedRoute>
  );
}