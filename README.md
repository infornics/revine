# Revine

[![npm version](https://img.shields.io/npm/v/revine)](https://www.npmjs.com/package/revine)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A minimal React framework with file-based routing and TypeScript-first approach.

## Features

- ⚡️ Vite-powered development
- 🗂 File-based routing (Next.js style)
- 🛠 TypeScript support out-of-the-box
- 🚀 Zero-config setup
- 🔥 Hot Module Replacement (HMR)

## Installation

Create a new project with:

```bash
npx revine my-project
```

## Documentation

### CLI Options

```bash
npx revine <project-name>
```

### Project Structure

Generated projects follow this structure:

```
my-project/
├── src/
│   ├── pages/         # Route components
│   │   └── index.tsx
│   ├── App.tsx        # Router configuration
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── vite.config.ts     # Vite configuration
└── package.json
```

### Routing Convention

src/pages/index.tsx → /

src/pages/about.tsx → /about

src/pages/blog/[slug].tsx → /blog/:slug

## Data Fetching & Caching

Revine includes built-in support for cached API calls, allowing you to easily store and reuse server responses.

### `revineFetch`

A wrapper around the native `fetch` API with caching capabilities.

```typescript
import { revineFetch } from "revine";

const data = await revineFetch("https://api.example.com/data", {
  cacheTTL: 60000, // Cache for 1 minute (in ms)
  persist: true    // Optional: Persist to localStorage
});
```

### `useFetch` Hook

A React hook for making cached API calls within components.

```tsx
import { useFetch } from "revine";

function MyComponent() {
  const { data, loading, error, revalidate } = useFetch("https://api.example.com/data", {
    cacheTTL: 300000, // 5 minutes
    persist: true
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={() => revalidate()}>Refresh Data</button>
    </div>
  );
}
```

## Contributing

### Clone repository

```bash
git clone [https://github.com/your-username/revine.git](https://github.com/rachit-bharadwaj/revine)
```

### Install dependencies

```bash
npm install
```

### Build and link locally

```bash
npm run build
npm link
```

### Test locally

revine test-project

### Thank you for contributing!
