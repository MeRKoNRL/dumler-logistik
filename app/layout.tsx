
import './globals.css';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';

function RootLayout({ children }) {
  return (
    <html lang="ru">
      <Head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="description" content="Dumler Logistik – управление логистикой"/>
        <meta property="og:title" content="Dumler Logistik"/>
        <meta property="og:description" content="Система управления логистикой"/>
        <meta property="og:type" content="website"/>
      </Head>
      <body className="relative" aria-label="Dumler Logistik Application">
        <button
          aria-label="Toggle dark mode"
          onClick={() => {
            const html = document.documentElement;
            html.classList.toggle('dark');
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
          }}
          className="fixed top-2 right-2 px-3 py-1 text-xs border rounded z-50 bg-white dark:bg-black"
        >Тема</button>
        {children}
      </body>
    </html>
  );
}

export default appWithTranslation(RootLayout);
