import React, { useState } from 'react';

const LanguageSwitcher = () => {
  const [lang, setLang] = useState('ru');

  const switchLang = () => {
    const next = lang === 'ru' ? 'de' : 'ru';
    setLang(next);
    localStorage.setItem('lang', next);
    window.location.reload();
  };

  return (
    <button
      onClick={switchLang}
      className="absolute top-4 right-4 text-sm px-3 py-1 border rounded"
    >
      {lang === 'ru' ? '🇷🇺 Русский' : '🇩🇪 Deutsch'}
    </button>
  );
};

export default LanguageSwitcher;
