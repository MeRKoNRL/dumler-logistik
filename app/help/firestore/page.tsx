'use client';

export default function FirestoreSchemaPage() {
  return (
    <main className="max-w-3xl mx-auto p-4 text-sm leading-relaxed">
      <h1 className="text-xl font-bold mb-4">📂 Структура Firestore</h1>

      <p className="mb-4 text-gray-500">Описание всех коллекций и используемых полей в системе Dumler Logistik:</p>

      <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs whitespace-pre-wrap">
{`# Firestore: Структура данных проекта Dumler Logistik

## 1. `daily_plans`
Главная коллекция с планами на день.

```ts
{
  date: string, // формат: 'YYYY-MM-DD'
  entries: [
    {
      driver: string,
      vehicle: string,
      client: string,
      cargo: string,
      route: string,
      status: string // например: 'выполнено', 'в процессе'
    }
  ]
}
```

---

## 2. `users`
Пользователи системы.

```ts
{
  email: string,
  role: 'admin' | 'dispatcher' | 'driver',
  createdAt: Timestamp
}
```

---

## 3. `roles`
(если используется отдельно от users)

```ts
{
  name: string, // 'admin' и т.д.
  permissions: string[] // список компонентов или функций
}
```

---

## 4. `clients`
Клиенты компании.

```ts
{
  name: string,
  address?: string,
  active: boolean
}
```

---

## 5. `vehicles`
Транспорт.

```ts
{
  plate: string, // номер
  type?: string,
  capacity?: number,
  status: 'active' | 'maintenance' | 'disabled'
}
```

---

## 6. `routes`
Маршруты.

```ts
{
  from: string,
  to: string,
  distanceKm?: number
}
```

---

## 7. `vacations`
Отпуска и отгулы.

```ts
{
  userId: string,
  from: string, // YYYY-MM-DD
  to: string,   // YYYY-MM-DD
  reason?: string
}
```

---

## 8. `maintenance_requests`
Заявки на ремонт.

```ts
{
  vehicleId: string,
  createdBy: string, // userId
  date: string,
  issue: string,
  status: 'open' | 'in_progress' | 'done'
}
```

---

## 9. `logs`
Журнал действий.

```ts
{
  userId: string,
  action: string,
  timestamp: Timestamp,
  details?: any
}
````}
      </pre>

      <div className="mt-6">
        <a href="/help" className="text-blue-600 underline">← Назад к помощи</a>
      </div>
    </main>
  );
}
