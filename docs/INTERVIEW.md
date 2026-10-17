# Interview talking points — Constructure

Short answers for international interviews. This repo is a **supporting** edtech / LMS portfolio piece: a visual course-constructor module. It is **not** an AI or computer-vision flagship (those roles belong to other projects such as sklad / aoi).

**Owner:** Ivan Iliukhin  
**Git history in this repo:** almost all feature and docs commits are under the owner’s GitHub account (`f1b0nacc1-afk` / associated email). Dependabot opened dependency PRs.

---

## What is Constructure?

A browser-based **course graph builder**: educators place lesson / quiz / assignment nodes on a canvas, connect them, and manage courses. This public repository is the **constructor module** of a larger university LMS. Other LMS services are not here.

## What did you own (grounded in this repo)?

Claim only what the code and history show:

| Area | Evidence in this repository |
|------|-----------------------------|
| Visual editor UI | Next.js pages under `apps/web/src/app/courses`, canvas edit flow, React Flow editor under `apps/web/src/components/editor` |
| Auth UX + API | Login/register pages, JWT routes in `apps/api/src/routes/auth.ts`, protected course routes |
| Course API & schema | `apps/api/src/routes/courses.ts`, Prisma models in `apps/api/prisma/schema.prisma` |
| Local packaging | Docker Compose, Nginx, `quick-start.sh`, Dockerfiles |
| CI | `.github/workflows/ci.yml` (type-check, lint, build) |

Do **not** claim ownership of private LMS monorepo services that were never published here.

## Where is DeepSeek / LLM?

**Not in this repository.** There is no DeepSeek (or other LLM) client, prompt, or summary feature in the tree.

If interviewers ask about LMS + LLM (e.g. course/content summaries): that work lived in **another service** of the wider LMS, not in this public constructor module. Do not demo or oversell AI from this repo.

## Architecture in 60 seconds

```
Browser (Next.js)
  ├─ Auth + course pages → HTTP → Fastify API → Prisma → PostgreSQL
  └─ Editor canvas → often localStorage (graph JSON)
Docker Compose: web, api, postgres, redis (unused by app code), nginx, adminer
```

Honest gap: the **API can persist** courses/nodes/edges, while much of the **editor UX still saves to `localStorage`**. That duality is a strong interview discussion point (integration debt, demo vs product).

## Why two editors?

- Custom SVG/canvas-style editor on the course edit page (zoom, connect mode, drag).
- React Flow–based component set (`CourseEditor`, node types, panels).

They illustrate iteration during the team/academic timeline; a production path would pick one and delete the other.

## Lessons on team delivery

- **Scope vs shipping:** Docker, Prisma schema, and API surface grew ahead of a single coherent UI↔API path — common when a module is planned for a larger LMS that never reached university production.
- **Module boundaries:** Keeping the constructor as a separate repo clarifies ownership for interviews, but integration with unpublished LMS services cannot be shown here.
- **Demo credentials:** Seed/test accounts and Compose passwords are for local demos only; treat them as such in conversation.
- **Do not inflate:** No production users, no university go-live, no “AI platform” narrative from this repo alone.

## Likely questions

**Q: Is this production software?**  
A: No. Academic/team module; local Docker demo. University deployment was not shipped.

**Q: Did you use AI here?**  
A: Not in this codebase. Any DeepSeek/summary work was in another LMS service, outside this repo.

**Q: Why Redis in Compose if unused?**  
A: Infra was prepared for caching/sessions; application routes never consumed it. I would either wire it or remove it.

**Q: What would you fix first?**  
A: Unify persistence (editor → API), collapse to one editor stack, then trim unused deps.

**Q: How does this relate to your AI/CV profile?**  
A: Supporting full-stack / LMS delivery experience. Primary AI/CV signal is elsewhere in the portfolio.

---

## Honest positioning (one paragraph)

Constructure shows I can ship a typed full-stack module (Next.js + Fastify + Prisma + Docker) with a nontrivial graph UI, document it, and own CI — while being clear that it is an unfinished LMS module, not a production product and not an LLM showcase.
