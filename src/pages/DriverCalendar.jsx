import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/ru';

/**
 * Календарь отображает отпуска, отгулы, больничные водителей.
 * Источник: Google Таблицы (лист Vacations и DriverInfo).
 */
const localizer = momentLocalizer(moment);

const DriverCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const load = () => fetch('http://localhost:3001/calendar-events').then(res => res.json()).then(setEvents);
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
    fetch('http://localhost:3001/calendar-events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📆 Календарь водителей</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        messages={{
          today: 'Сегодня',
          previous: 'Назад',
          next: 'Вперёд',
          month: 'Месяц',
          week: 'Неделя',
          day: 'День',
          agenda: 'Повестка дня',
        }}
      />
    </div>
  );
};

export default DriverCalendar;
