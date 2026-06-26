# 📚 Loksewa Buddy Prep

A modern web application to help aspirants prepare for the **Nepal Public Service Commission (Loksewa)** examinations — featuring practice questions, study materials, and progress tracking, all in one place.

---

## 🌐 Live Demo

> Deploy your own on Cloudflare Workers — see [Deployment](#deployment) below.

---

## ✨ Features

- 📝 Practice MCQs and past questions organized by subject
- 📊 Progress tracking with visual charts
- 🗂️ Study materials and notes
- 🔔 Toast notifications and smooth UI interactions
- 📱 Fully responsive design
- ⚡ Fast global access via Cloudflare Workers

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) |
| UI Library | React 19 |
| Components | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack Query |
| Charts | Recharts |
| Deployment | Cloudflare Workers (via Wrangler) |
| Language | TypeScript |
| Package Manager | Bun |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Bun](https://bun.sh/)

### Clone the repo

```bash
git clone https://github.com/Shr6/loksewa-buddy-prep.git
cd loksewa-buddy-prep
```

### Install dependencies

```bash
bun install
```

### Run locally

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Build

```bash
bun run build
```

For a development build:

```bash
bun run build:dev
```

Preview the production build locally:

```bash
bun run preview
```

---

## ☁️ Deployment

This project deploys to **Cloudflare Workers** using Wrangler.

```bash
bunx wrangler deploy
```

Make sure you have a [Cloudflare account](https://dash.cloudflare.com/) and are logged in:

```bash
bunx wrangler login
```

---

## 🧹 Linting & Formatting

```bash
bun run lint       # ESLint
bun run format     # Prettier
```

---

## 📁 Project Structure

```
loksewa-buddy-prep/
├── src/                  # Application source code
│   ├── routes/           # File-based routes (TanStack Router)
│   ├── components/       # Reusable UI components
│   └── ...
├── components.json       # shadcn/ui configuration
├── vite.config.ts        # Vite + Cloudflare plugin config
├── wrangler.jsonc        # Cloudflare Workers config
├── tsconfig.json         # TypeScript config
└── package.json
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 👤 Author

**Shr6** — [github.com/Shr6](https://github.com/Shr6)

---

## 📄 License

This project is open source. See the repository for details.
