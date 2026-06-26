# Loksewa Buddy Prep

## About

A web-based preparation platform for the **Loksewa (Nepal Public Service Commission)** exam, built to help aspirants study smarter and practice effectively for government job examinations in Nepal.

The app is built with **TanStack Start** (React 19, file-based routing), styled with **Tailwind CSS** and **shadcn/ui** components, and deployed on **Cloudflare** for fast global access.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start + TanStack Router |
| UI | React 19, Radix UI, shadcn/ui, Tailwind CSS v4 |
| Forms | React Hook Form + Zod validation |
| Data fetching | TanStack Query |
| Charts | Recharts |
| Deployment | Cloudflare (via Wrangler) |
| Language | TypeScript |
| Package manager | Bun |

## Getting Started

### Prerequisites

```
Node.js 18+
Bun
```

### Install

```bash
git clone https://github.com/Shr6/loksewa-buddy-prep.git
cd loksewa-buddy-prep
bun install
```

### Run locally

```bash
bun dev
```

### Build

```bash
bun run build
```

### Deploy

```bash
bunx wrangler deploy
```

## Author

Built by [Shr6](https://github.com/Shr6)
