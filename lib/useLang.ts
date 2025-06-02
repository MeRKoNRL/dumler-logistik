'use client';

import { useEffect, useState } from 'react';
import { translations } from './config';

export function useLang() {
  const [lang, setLang] = useState('ru');
  const t = translations[lang as 'ru' | 'de'];

  useEffect(() => {
    const stored = localStorage.getItem('lang');
    if (stored) setLang(stored);
  }, []);

  const changeLang = (l: 'ru' | 'de') => {
    localStorage.setItem('lang', l);
    setLang(l);
  };

  return { lang, t, changeLang };
}
