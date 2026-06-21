# PokéSearch — Next.js (App Router, SSR/SSG)

A Pokémon search application built with **Next.js (App Router)**, **TypeScript**,
**next-intl** and **Redux Toolkit**. Migrated from a Vite + React Router SPA to a
server-first Next.js app.

## Features

- File-based routing with the **App Router** and a locale segment (`/[locale]`)
- **Internationalization** with `next-intl` (English + Deutsch) and a client-side
  language switcher; all navigation uses `createNavigation` links
- **Server-rendered search results** (server components read `searchParams` and
  fetch on the server); search runs through a **Server Action** (`useActionState`)
- **Server-side details panel** — selecting a card fetches its data on the server
- **Statically generated** About page (SSG, server component only)
- Localized **404** page for unknown routes
- All images rendered through **`next/image`**
- **CSV export generated and served by the server** via a route handler
- Hand-rolled **theme switcher** (light/dark/system) via React Context + localStorage
- Card selection persisted in `localStorage` via Redux Toolkit

## Requirements

- Node.js 18+ (developed on Node 24)
- npm

## Install

```bash
npm install
```

## Environment

Copy `.env.example` to `.env` (optional). `REVALIDATE_SECONDS` controls how long
server-side PokeAPI fetches are cached (defaults to 60).

## Run locally

```bash
npm run dev
```

Then open http://localhost:3000

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint (Next.js + TypeScript) |
| `npm run type-check` | `tsc --noEmit` |
| `npm run format:fix` | Prettier |
| `npm run test` | Run the vitest suite |
| `npm run test:coverage` | Tests with coverage |

## Deployment

Optimized for **Vercel** (zero-config: server actions, SSR, ISR and
`next/image` work out of the box). Push the repository and import it on Vercel.
