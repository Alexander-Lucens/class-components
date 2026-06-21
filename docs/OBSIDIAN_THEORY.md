---
tags: [nextjs, react, ssr, ssg, i18n, теорминимум]
---

# Next.js App Router — теоретический минимум

Конспект для Obsidian: ключевые концепции, которые встретились в задаче «Next.js SSR»,
+ что стоит изучить глубже. Можно копировать в свой vault как заметку-хаб.

## 1. App Router и файловый роутинг

- Маршруты задаются **структурой папок** в `app/`, а не конфигом.
- Спец-файлы: `layout.tsx` (общая обёртка, сохраняется между переходами),
  `page.tsx` (страница), `loading.tsx` (Suspense-фолбэк), `error.tsx` (error boundary),
  `not-found.tsx` (404), `route.ts` (API/route handler).
- Динамические сегменты: `[id]`, catch-all `[...slug]`, опциональный `[[...slug]]`.
- `generateStaticParams()` — какие значения динамического сегмента пререндерить (SSG).
- 🔎 *Изучить:* parallel routes (`@slot`), intercepting routes (`(.)`), route groups `(group)`.

## 2. Server Components vs Client Components (RSC)

- **По умолчанию всё — Server Component**: рендерится на сервере, не уходит в JS-бандл,
  может быть `async` и напрямую делать `await fetch(...)` / обращаться к БД.
- `"use client"` в начале файла → компонент клиентский: можно `useState`, `useEffect`,
  обработчики событий, контекст, браузерные API.
- Граница «сервер → клиент» односторонняя: серверный может рендерить клиентский и
  передавать ему **сериализуемые** пропсы (и серверные экшены), но не функции/классы.
- Паттерн: серверная страница тянет данные, клиентские «островки» добавляют
  интерактив (в проекте: `page.tsx` сервер → `Card`/`RefreshButton` клиент).
- 🔎 *Изучить:* «server/client composition», почему контекст-провайдеры всегда клиентские.

## 3. SSR / SSG / ISR

- **SSG** — страница пререндерится в HTML на билде (быстро, SEO). Получается, если нет
  динамических данных запроса. В проекте — `about` (`● SSG`).
- **SSR (dynamic)** — HTML генерится на каждый запрос. Включается, когда читаешь
  `searchParams`, `cookies()`, `headers()` и т.п. В проекте — главная (`ƒ Dynamic`).
- **ISR** — `fetch(url, { next: { revalidate: N } })`: кешируется на N секунд, потом
  фоном обновляется. В проекте так кешируется PokéAPI.
- `params` и `searchParams` в Next 15/16 — **Promise**, их нужно `await`.
- 🔎 *Изучить:* `dynamic = "force-static"`, `revalidatePath`/`revalidateTag`, Data Cache.

## 4. Server Actions

- Функции с `"use server"` — выполняются **на сервере**, вызываются из форм
  (`<form action={fn}>`) или через `useActionState`.
- Удобны для мутаций/сабмитов без ручного API-роутинга; возвращают данные или делают
  `redirect`/`revalidate`.
- `useActionState(action, initial)` → `[state, formAction, isPending]` — встроенный
  pending-стейт без `useState`.
- В проекте: поиск (`searchAction` + `useActionState`).
- 🔎 *Изучить:* прогрессивное улучшение (формы работают без JS), `useFormStatus`,
  безопасность (экшен = публичный эндпоинт, валидируй вход).

## 5. Route Handlers

- `app/.../route.ts` с экспортами `GET/POST/...` — это веб-`Request`→`Response`.
- Полный контроль над заголовками/телом → удобно для файлов (CSV, PDF), вебхуков.
- В проекте: `POST /api/csv` отдаёт CSV с `Content-Disposition: attachment`.
- 🔎 *Изучить:* стриминг ответов, `NextRequest`/`NextResponse`, edge vs node runtime.

## 6. next-intl (интернационализация)

- Сегмент `[locale]` + middleware (`createMiddleware`) добавляет префикс локали и
  определяет язык.
- `getRequestConfig` грузит сообщения; `NextIntlClientProvider` отдаёт их клиенту.
- `createNavigation(routing)` → **локаль-aware** `Link`/`useRouter`/`redirect`
  (всегда используем их вместо `next/link`, чтобы ссылки знали про язык).
- `useTranslations` (клиент) и `getTranslations` (сервер); `t.rich(...)` для разметки
  внутри перевода (ссылки, `<b>` и т.п.).
- `setRequestLocale(locale)` в layout/page включает **статический** рендер локалей.
- 🔎 *Изучить:* `localePrefix` режимы (`always`/`as-needed`), форматирование чисел/дат,
  плюрализация ICU.

## 7. next/image

- `<Image>` — авто-оптимизация (resize, lazy-load, современные форматы, защита от CLS
  через обязательные `width`/`height` или `fill`).
- Внешние домены — в `images.remotePatterns` (`next.config`).
- 🔎 *Изучить:* `priority`, `sizes`, `placeholder="blur"`, кастомный loader.

## 8. Redux в App Router

- Стор создаётся **на запрос** (фабрика `makeStore`), провайдер — клиентский.
- Гидрация из `localStorage` — **после монтирования** (иначе hydration mismatch:
  сервер не знает про localStorage).
- 🔎 *Изучить:* зачем per-request store на сервере; альтернативы (Zustand, Jotai).

## 9. Гидрация и FOUC

- **Hydration mismatch** — когда серверный HTML ≠ первый клиентский рендер
  (частая причина — чтение `localStorage`/`window`/`Date.now()` при инициализации).
  Лечение: одинаковый дефолт на сервере и клиенте + досинхронизация в `useEffect`.
- **FOUC темы** — лечится инлайн-скриптом в `<head>/<body>`, который выставляет
  `data-theme` до отрисовки React.

## 10. Тестирование Next-проекта (vitest)

- Server Components можно тестировать, вызвав их как функцию: `render(await Comp(props))`.
- Мокаются: `next-intl/server` (`getTranslations`), `i18n/navigation` (`Link`/`useRouter`),
  `next/image`, серверные data-функции; пакет `server-only` — alias на пустой модуль.
- Route handlers тестируются обычным `Request`/`Response`.
- 🔎 *Изучить:* Playwright/e2e для проверки реального SSR и серверных экшенов.

## Полезные ссылки

- App Router: https://nextjs.org/docs/app
- Server/Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Server Actions & Forms: https://nextjs.org/docs/app/guides/forms
- Caching & revalidation: https://nextjs.org/docs/app/guides/caching
- next-intl: https://next-intl.dev/docs/getting-started/app-router
- next/image: https://nextjs.org/docs/app/api-reference/components/image
- Деплой на Vercel: https://vercel.com/docs/frameworks/nextjs

## Связанные заметки

- [[React Server Components]]
- [[SSR vs SSG vs ISR]]
- [[next-intl]]
- [[Server Actions]]
- [[Гидрация в React]]
