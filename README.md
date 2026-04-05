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
