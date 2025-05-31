'use client';

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

;



export default function DrivercalendarPage() {
  return <div>DrivercalendarPage content</div>;
}
