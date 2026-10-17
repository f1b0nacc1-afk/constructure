# Constructure

Visual drag-and-drop **course constructor** for educators: build a course graph (lessons, quizzes, assignments), connect nodes, and manage courses in a browser UI.

**Module of a larger LMS; other services are not in this repository.** Related university LMS work (other frontends, microservices, LLM features) lived outside this public surface and is not published here.

| | |
|---|---|
| **Owner** | Ivan Iliukhin |
| **Role in portfolio** | Supporting edtech / LMS module (not an AI flagship) |
| **Status** | Academic / team project — local demo and Docker stack; **not shipped** to university production |

Interview talking points: [`docs/INTERVIEW.md`](docs/INTERVIEW.md). Detailed Russian runbook (if needed): [`ЗАПУСК.md`](ЗАПУСК.md).

---

## What this repository contains

A TypeScript monorepo with:

- **`apps/web`** — Next.js App Router UI: auth pages, course list/create/view/edit, React Flow–based editor components, and a custom canvas editor that persists course graphs primarily via **browser `localStorage`**
- **`apps/api`** — Fastify REST API: JWT auth (register/login/refresh), course/node/edge CRUD against **PostgreSQL** via Prisma
- **`packages/types`** — shared TypeScript types
- **Docker Compose** — PostgreSQL, Redis, API, web, Nginx reverse proxy, Adminer
- **GitHub Actions** — type-check / lint / build CI

There are **no screenshots** in this repository. UI flows below match the routes under `apps/web/src/app`.

---

## UI flows

1. **Home** (`/`) — landing with links to create a course or open the course list.
2. **Auth** (`/auth/login`, `/auth/register`) — email/password against the API; tokens stored in `localStorage`.
3. **Test accounts** (`/test-accounts`) — helper page with seeded demo accounts for local testing.
4. **Courses** (`/courses`) — list default sample courses and any user-created ones; list state is driven by `localStorage`.
5. **New course** (`/courses/new`) — create a course and open the editor.
6. **Edit** (`/courses/[id]/edit`) — canvas with drag-and-drop blocks (lesson / quiz / assignment), connect mode, zoom, save to `localStorage`.
7. **View** (`/courses/[id]`) — read-only view of the course graph.
8. **React Flow editor** (`apps/web/src/components/editor/`) — alternate editor shell (toolbar, node panel, properties panel, custom node types) built on React Flow.

---

## Tech stack (this repo only)

Documented from `package.json` files and Compose — not the wider LMS.

| Layer | Present here |
|-------|----------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, React Flow, Zustand, Axios, Zod, Lucide |
| Backend | Fastify, Prisma, JWT (`@fastify/jwt` / `jsonwebtoken`), bcryptjs, Zod, Winston |
| Data | PostgreSQL 15 (Prisma schema: users, courses, nodes, edges, collaborators, comments, versions) |
| Infra | Docker Compose, Nginx, Adminer; Redis image/dependency present (Compose + `redis` package) — **not wired into application routes yet** |
| Tooling | npm workspaces-style scripts, ESLint, Prettier, GitHub Actions |

Dependencies such as Cloudinary / Socket.IO appear in package manifests or config placeholders; there is **no** DeepSeek (or other LLM) integration in this repository.

---

## Install and run

### Prerequisites

- Node.js ≥ 18 and npm ≥ 9 (for local `npm run dev`)
- Docker + Docker Compose (recommended full stack)

### Docker (recommended)

```bash
git clone https://github.com/f1b0nacc1-afk/constructure.git
cd constructure
./quick-start.sh
# or: docker compose up -d
```

Typical local URLs after Compose is up:

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:3001 |
| Nginx proxy | http://localhost:8000 |
| Adminer | http://localhost:8080 |
| PostgreSQL | `localhost:5433` |

Stop: `./quick-stop.sh` or `docker compose down`.

### Local npm (API + web)

```bash
npm run install:all
npm run build:types
# ensure PostgreSQL is reachable (Compose postgres service, or your own instance)
# set DATABASE_URL / JWT secrets via environment (see apps/api/src/config)
cd apps/api && npx prisma generate && npx prisma db push
cd ../..
npm run dev
```

Compose and seed scripts use **local demo** credentials only (not production or university secrets). Change JWT secrets and DB passwords before any shared deployment.

---

## Status

- Built as an **academic / team** LMS module for university coursework.
- Useful as a **local demo** of a visual course builder + JWT API + Docker packaging.
- **Not shipped** to university production (deployment cancelled / not released).
- Broader LMS services and any LLM/chat features are **out of scope for this public repo**.

---

## Limitations

- Editor UX and course list heavily rely on **`localStorage`**; API persistence and UI are not fully unified end-to-end.
- Two editor approaches coexist (custom canvas on edit pages + React Flow components) — not a single polished product surface.
- Redis / Cloudinary / WebSocket packages are present or stubbed but not implemented as product features.
- Prisma schema models collaborators, comments, and versions; corresponding product UI/flows are incomplete or unused.
- Default JWT secrets and Compose passwords are for **local development only**.
- No production metrics, user counts, or university deployment claims — none exist in this repository.

---

## What I would do next

1. **Single source of truth** — wire the course editor and list fully to the Fastify/Prisma API; keep `localStorage` only as offline cache or remove it.
2. **Consolidate editors** — pick React Flow or the custom canvas, delete the duplicate path, add tests for graph save/load.
3. **Honesty in infra** — either implement Redis/session caching and real-time collaboration, or remove unused dependencies and Compose services to shrink the demo surface.

---

## Project layout

```
constructure/
├── apps/web/           # Next.js frontend
├── apps/api/           # Fastify + Prisma API
├── packages/types/     # Shared TypeScript types
├── nginx/              # Reverse proxy config
├── scripts/            # Docker / DB helpers
├── documentation/      # Older design/plan notes (mixed RU)
├── docs/INTERVIEW.md   # Interview talk track (EN)
├── docker-compose.yml
└── quick-start.sh
```

---

## License

MIT — see [LICENSE](LICENSE).

---

<details>
<summary>Русская справка (кратко)</summary>

**Constructure** — визуальный конструктор курсов (модуль более крупной LMS; остальные сервисы в этот репозиторий не входят). Статус: учебный/командный проект, в прод вуза не выкатывался.

Быстрый запуск: `./quick-start.sh`. Подробности по окружению: [ЗАПУСК.md](ЗАПУСК.md). Собеседования (EN): [docs/INTERVIEW.md](docs/INTERVIEW.md).

</details>
