import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('transition-colors', 'duration-500');
    if (dark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="text-sm text-gray-700 dark:text-gray-300 border rounded px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
    >
      {dark ? '☀️ Светлая' : '🌙 Тёмная'}
    </button>
  );
};

export default ThemeToggle;
