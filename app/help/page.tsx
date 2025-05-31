'use client';

import { useUserData } from '@/lib/useUserData';
import Link from 'next/link';

export default function HelpPage() {
  const { role } = useUserData() || {};

  return (
    <main className="max-w-3xl mx-auto p-4 text-sm leading-relaxed">
      <h1 className="text-xl font-bold mb-4">📘 Помощь и руководство</h1>

      {!role && <p>Загрузка роли пользователя...</p>}

      {(role === 'admin' || role === 'dispatcher') && (
        <>
          <section className="mb-6">
            <h2 className="font-semibold text-base mb-1">Что такое дневной план?</h2>
            <p>Это список маршрутов, клиентов и водителей на определённую дату. Вы можете его редактировать, сохранять и копировать на следующий день.</p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-1">Как его создать?</h2>
            <ul className="list-disc list-inside">
              <li>Откройте <Link href="/dailyplan" className="text-blue-600 underline">План</Link></li>
              <li>Выберите дату</li>
              <li>Добавьте записи: водитель, авто, маршрут и т.д.</li>
              <li>Нажмите "Сохранить"</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-1">Как использовать аналитику?</h2>
            <ul className="list-disc list-inside">
              <li>Откройте <Link href="/dailyplan/summary" className="text-blue-600 underline">Сводку</Link></li>
              <li>Выберите период</li>
              <li>Смотрите графики и экспортируйте</li>
            </ul>
          </section>
        </>
      )}

      {role === 'admin' && (
        <section className="mb-6">
          <h2 className="font-semibold text-base mb-1">Функции администратора</h2>
          <ul className="list-disc list-inside">
            <li>Выдача ролей</li>
            <li>Управление пользователями</li>
            <li>Включение и отключение функций</li>
          </ul>
        </section>
      )}

      {role === 'driver' && (
        <>
          <section className="mb-6">
            <h2 className="font-semibold text-base mb-1">Как посмотреть свой план?</h2>
            <p>Откройте <Link href="/dailyplan" className="text-blue-600 underline">Дневной план</Link> и выберите текущую дату.</p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-1">Как подать заявку?</h2>
            <p>Перейдите на страницу <Link href="/requestform" className="text-blue-600 underline">Заявки</Link> и заполните форму. Вы также можете указать отпуск в <Link href="/vacationtracker" className="underline text-blue-600">графике отпусков</Link>.</p>
          </section>
        </>
      )}

      
      <section className="mb-6">
        <h2 className="font-semibold text-base mb-1">Техническая структура</h2>
        <p>Для разработчиков доступна <Link href="/help/firestore" className="text-blue-600 underline">структура коллекций Firestore</Link>.</p>
      </section>
    
      <div className="mt-6">
        <Link href="/dailyplan" className="text-blue-600 underline">← Назад к плану</Link>
      </div>
    </main>
  );
}
