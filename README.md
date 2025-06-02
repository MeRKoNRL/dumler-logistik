# Dumler-Logistik

**Версия:** 1.0.0

## Описание

Веб-приложение для логистической компании на базе Next.js и Firebase. Проект включает:
- Дневной план с водителями, машинами и клиентами
- Интеграцию с Google Sheets, Calendar и Drive
- Поддержку ролей: водитель, диспетчер, администратор
- Уведомления, отчёты, экспорт, авторизация через Google и email
- Мультиязычность (русский и немецкий)
- Адаптивную верстку под мобильные устройства

## Стек технологий

- **Next.js**
- **React**
- **TypeScript**
- **Firebase (auth, firestore, admin)**
- **Google API (Sheets, Calendar, Drive)**
- **TailwindCSS**
- **XLSX / ExcelJS / PDFKit**
- **Recharts, date-fns, moment**
- **Vercel** для хостинга

## Скрипты

```bash
npm run dev       # запуск dev-сервера
npm run build     # сборка проекта
npm run start     # запуск в production
npm run lint      # проверка кода
npm run lint:fix  # авто-исправление проблем
```

## Установка

```bash
git clone https://github.com/your-org/dumler-logistik.git
cd dumler-logistik
npm install
npm run dev
```

## Зависимости

- **next**: latest
- **react**: latest
- **react-dom**: latest
- **firebase**: ^9.0.0
- **googleapis**: ^105.0.0
- **moment**: ^2.29.4
- **pdfkit**: ^0.13.0
- **exceljs**: ^4.3.0
- **@next/bundle-analyzer**: 13.5.6
- **react-hot-toast**: ^2.4.0
- **xlsx**: ^0.18.5
- **formidable**: ^3.5.0
- **nodemailer**: ^6.9.4
- **react-big-calendar**: ^1.8.1
- **firebase-admin**: ^11.10.1
- **date-fns**: ^3.6.0
- **file-saver**: ^2.0.5
- **recharts**: ^2.6.2

## Dev зависимости
- **typescript**: ^5.0.0
- **@types/node**: ^20.0.0
- **@types/react**: ^18.0.0
- **@types/react-dom**: ^18.0.0

## Структура проекта

- `/app` — страницы Next.js
- `/components` — переиспользуемые компоненты
- `/lib` — утилиты и API-логика (Google, Firebase и т.д.)
- `/styles` — глобальные стили Tailwind
- `/__tests__` — unit и e2e тесты
- `next.config.js`, `tailwind.config.js` — конфигурации
- `public` — статика

## Разработка и деплой

- Используется Vercel с CI/CD
- Firebase настроен на авторизацию и админ-доступ
- Google Cloud Project подключен для API Sheets, Calendar и Drive

## Авторизация

- Поддержка Google OAuth
- Email/password регистрация
- Назначение ролей через админ-панель

## Дополнительно

- Импорт клиентов из Excel
- Календарь отпусков и больничных
- Автоматическое копирование дневного плана
- Уведомления и журнал действий

---

© Dumler Logistik. Все права защищены.
