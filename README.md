# PokéSearch

Class-components React app built with Vite and TypeScript.

## What it does

- Uses class components only
- Loads Pokémon from the public PokeAPI
- Supports initial load, server-side search, and pagination
- Saves the last search term in `localStorage`
- Shows loading, error, and error-boundary states

## Requirements

- Node.js 18+ recommended
- npm

## Install

```bash
npm install
```
## Create your `.env`
```sh
Use `.env.example` as example or just removing last part
````

## Run locally

```bash
npm run dev
```

Then open the URL shown by Vite, usually:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Format

```bash
npm run format:fix
```

## Run tests

### Run all vitest in general
```bash
npm run test
```

### Run test coverage
```bash
npm run test:coverage
```

### Run vitest with graphical ui in browser
```bash
npm run test:ui
```