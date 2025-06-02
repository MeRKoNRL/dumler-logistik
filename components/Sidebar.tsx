import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from './RoleContext';

const Sidebar = () => {
  const location = useLocation();
  const { role } = useRole();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/dashboard', label: 'Дашборд', icon: '' },
    { to: '/request', label: 'Заявка', icon: '🚛', roles: ['водитель', 'диспетчер'] },
    { to: '/clients', label: 'Клиенты', icon: '📦', roles: ['диспетчер', 'админ'] },
    { to: '/vehicles', label: 'Автомобили', icon: '🛠', roles: ['диспетчер', 'админ'] },
    { to: '/calendar', label: 'Календарь', icon: '🗓', roles: ['диспетчер', 'админ'] },
    { to: '/driver-info', label: 'Инфо водителя', icon: '🧾', roles: ['водитель'] },
    { to: '/admin', label: 'Админ-панель', icon: '👥', roles: ['админ'] },
    { to: '/logs', label: 'Журнал', icon: '📜', roles: ['админ', 'диспетчер'] },
  ];

  return (
    <>
      {/* Мобильное меню */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow sticky top-0 z-50">
        <h1 className="text-xl font-bold"> Dumler</h1>
        <button onClick={() => setOpen(!open)} className="text-2xl">
          {open ? '✖️' : '☰'}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-b px-4 py-2 space-y-2">
          {links.filter(link => !link.roles || link.roles.includes(role)).map((link, i) => (
            <Link
              key={i}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block py-2 ${location.pathname === link.to ? 'font-bold' : ''}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Десктопное меню */}
      <div className="hidden md:block w-64 min-h-screen bg-white shadow-md p-4 fixed">
        <h1 className="text-2xl font-bold mb-6"> Dumler</h1>
        <ul className="space-y-2">
          {links
            .filter(link => !link.roles || link.roles.includes(role))
            .map((link, i) => (
              <li key={i}>
                <Link
                  to={link.to}
                  className={`block p-2 rounded ${
                    location.pathname === link.to ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'
                  }`}
                >
                  {link.icon} {link.label}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
