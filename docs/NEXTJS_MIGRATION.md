# Что и как сделано: миграция PokéSearch на Next.js (App Router, SSR/SSG)

Документ описывает, **что конкретно** было сделано в этом задании и **почему именно так**.
Исходно приложение было SPA на Vite + React Router + RTK Query. Цель — перенести
его на Next.js App Router с серверным рендерингом, i18n и серверными действиями.

## 0. Базовая перестройка проекта

- Установлены `next` (16.x) и `next-intl` (4.x); удалён `react-router-dom`.
- Удалены Vite-артефакты: `vite.config.ts`, `index.html`, `tsconfig.app/node.json`,
  `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`.
- Новый [`tsconfig.json`](../tsconfig.json) под Next (alias `@/*`, плагин `next`,
  тест-файлы исключены из `tsc`).
- [`next.config.ts`](../next.config.ts): обёрнут плагином `next-intl` +
  `images.remotePatterns` для спрайтов PokéAPI.
- Скрипты `dev/build/start/type-check`; pre-commit запускает `type-check`.
- Структура исходников осталась в `src/` (Next поддерживает `src/app`).

## 1. Redux под App Router

- [`src/store.ts`](../src/store.ts): вместо singleton-стора — фабрика `makeStore()`
  (per-request store, чтобы не делить состояние между запросами на сервере).
  Reducer оставлен только `selection` (счётчик и RTK Query удалены — данные теперь
  тянутся на сервере).
- [`src/app/StoreProvider.tsx`](../src/app/StoreProvider.tsx): клиентский провайдер,
  создаёт стор один раз через `useRef`, **гидратирует** выбор из `localStorage` уже
  после монтирования и **персистит** изменения через `store.subscribe`. Так SSR и
  первый клиентский рендер совпадают (нет hydration mismatch).
- [`selectionSlice`](../src/features/selectionSlice.ts): `initialState` пустой; данные
  подгружаются экшеном `hydrateSelection` post-mount.

## 2. i18n + файловый роутинг + общий layout (Features 2, 3, 6)

- next-intl с i18n-routing: [`routing.ts`](../src/i18n/routing.ts) (`en` дефолт + `de`),
  [`request.ts`](../src/i18n/request.ts) (загрузка `messages/*.json`),
  [`navigation.ts`](../src/i18n/navigation.ts) (`createNavigation` → `Link`,
  `useRouter`, `usePathname`, `redirect`).
- [`src/proxy.ts`](../src/proxy.ts) — middleware next-intl (в Next 16 конвенция файла
  переименована из `middleware` в `proxy`). Добавляет префикс локали и редиректит `/` → `/en`.
- Сегмент `[locale]` в роутинге: [`src/app/[locale]/layout.tsx`](../src/app/[locale]/layout.tsx)
  — корневой layout с `<html lang>`, анти-FOUC скриптом темы, провайдерами
  (`NextIntlClientProvider` + `StoreProvider` + `ThemeProvider`), общими `Header` и
  `Flyout`, и `generateStaticParams` (статическая генерация локалей).
- [`Header`](../src/components/Header.tsx) — клиентский: ссылки через next-intl `Link`
  (**Feature 6**), переводы `useTranslations`, переключатели темы и языка.
- [`LocaleSwitcher`](../src/components/LocaleSwitcher.tsx) — клиентский `<select>`,
  меняет локаль через `router.replace`, сохраняя query (**Feature 2**).
- Переводы UI: [`messages/en.json`](../messages/en.json), [`messages/de.json`](../messages/de.json).

## 3. Тема (свой механизм, без библиотек)

- [`ThemeContext`](../src/context/ThemeContext.tsx) — React Context + `localStorage`.
  Стартует с дефолта на сервере и первом клиентском рендере, читает сохранённое
  значение в `useEffect` (без mismatch). Инлайн-скрипт в layout проставляет
  `data-theme` до отрисовки (нет вспышки темы — FOUC).

## 4–5. Поисковая страница на SSR + серверные детали (Features 9, 10)

- Серверный data-слой [`src/lib/pokemon.ts`](../src/lib/pokemon.ts): `getPokemonPage`,
  `getPokemonByName`, `searchPokemon` через `fetch` с `next: { revalidate }`
  (кеш на сервере, TTL из `REVALIDATE_SECONDS`). Помечен `server-only`.
- [`src/app/[locale]/page.tsx`](../src/app/[locale]/page.tsx) — **серверный компонент**:
  читает `searchParams` (`page`/`query`/`details`), фетчит на сервере, рендерит
  список и контейнер панели деталей (пустой shell, когда ничего не выбрано). Маршрут
  становится `ƒ (Dynamic)` — серверный рендер по запросу (**Feature 9**).
- Поиск — **Server Action** [`src/lib/actions.ts`](../src/lib/actions.ts) +
  клиентский [`SearchForm`](../src/components/SearchForm.tsx) через `useActionState`;
  экшен делает локаль-aware `redirect` с новым query → страница ре-рендерится на сервере (**Feature 10**).
- Детали — серверный компонент [`DetailsPanel`](../src/components/DetailsPanel.tsx):
  при выборе карточки (`?details=name`) фетчит данные **на сервере**, обёрнут в
  `Suspense` (**Feature 10**).
- Серверные [`CardList`](../src/components/CardList.tsx) и [`Pagination`](../src/components/Pagination.tsx);
  клиентский островок [`Card`](../src/components/Card.tsx) (чекбокс+Redux+`Link` на детали)
  и [`RefreshButton`](../src/components/RefreshButton.tsx) (`router.refresh()`).

## 6. About как SSG (Feature 7)

- [`src/app/[locale]/about/page.tsx`](../src/app/[locale]/about/page.tsx) — серверный
  компонент **только** (без клиентского кода), `generateStaticParams` +
  `setRequestLocale` → статическая генерация (`● SSG`). Ссылки локализованы через `t.rich`.

## 7. 404 (Feature 4)

- [`[locale]/not-found.tsx`](../src/app/[locale]/not-found.tsx) — локализованная страница.
- Catch-all [`[locale]/[...rest]/page.tsx`](../src/app/[locale]/[...rest]/page.tsx) →
  `notFound()`. Неизвестные пути (после добавления локали middleware) дают HTTP 404.

## 8. Картинки (Feature 5)

- Все `<img>` заменены на `next/image` (Card, DetailsPanel); домен спрайтов в
  `images.remotePatterns`. Иконки темы заменены текстовыми подписями — нет внешних
  зависимостей по изображениям.

## 9. CSV на сервере (Feature 8)

- Route handler [`src/app/api/csv/route.ts`](../src/app/api/csv/route.ts): `POST`
  принимает выбранные элементы, собирает CSV ([`utils/csv.ts`](../src/utils/csv.ts))
  и отдаёт с заголовками `Content-Type: text/csv` + `Content-Disposition: attachment`.
- [`Flyout`](../src/components/Flyout.tsx) скачивает через `<form method="post"
  action="/api/csv">` — чистый server-served download, без клиентского Blob.

## 10. Тесты

- vitest + Testing Library под Next: [`test-utils.tsx`](../src/test-utils.tsx)
  (NextIntl + Redux провайдеры), мок `matchMedia`, alias `server-only`.
- Покрыты slice, утилиты, серверный data-слой, server-компоненты (через `await
  Component(props)`), клиентские компоненты (моки `i18n/navigation`/`next/image`),
  server action и route handler. Покрытие **≥85%** по statements/branches/functions/lines.

## Проверки

```bash
npm run lint        # eslint (Next + TS) — 0
npm run type-check  # tsc --noEmit — 0
npm test            # vitest — все зелёные
npm run test:coverage  # ≥85%
npm run build       # next build — 0
```

## Что НЕ переносили

- Standalone-формы (Formik/RHF) — по условию исключены.
- RTK Query для списка/деталей — заменён серверным `fetch` (Features 9/10 требуют сервер).
- Классовый `ErrorBoundary` и кнопка «Trigger Error» — относились к прошлому модулю и
  конфликтуют с серверным рендером; убраны как мёртвый код.
