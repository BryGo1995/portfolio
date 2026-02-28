# Portfolio Website Design

**Date:** 2026-02-27
**Goal:** Personal portfolio to land a fullstack + game development job

---

## Overview

A personal portfolio website showcasing fullstack and game development work. Designed to be interactive enough to catch interest without being distracting. Built to be easily extensible as new projects are completed.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + tailwind-animate |
| Animations | Framer Motion |
| Contact | Resend (API route, free tier) |
| Hosting | Vercel |
| Content | Typed config file (`src/content/projects.ts`) |

---

## Routes

```
/                    → Scrollable homepage
/projects/[slug]     → Individual project detail pages (statically generated)
```

---

## Homepage Sections

1. **Hero** — Name, tagline, CTA buttons (View Work / Contact). Subtle animated canvas background referencing 3D/OpenGL work (drifting particle grid or shader-like noise).
2. **About** — Short bio. Optional photo.
3. **Skills** — Icon + label chips grouped by category: Frontend, Backend, Game Dev, Languages.
4. **Projects** — 2-column card grid. Each card: title, short description, tech tags, Live/WIP badge, links to `/projects/[slug]`.
5. **Contact** — Name / Email / Message form. Submits via Next.js API route using Resend.

**Navbar:** Fixed top, scrolls to sections on homepage, highlights active section on scroll.

---

## Project Detail Page

- Title, tech stack, status badge, GitHub / demo links
- Screenshots or game embed (iframe, activated on click to avoid auto-loading)
- Long-form description / write-up
- Back to projects link

---

## Content Structure

Projects defined as a typed array in `src/content/projects.ts`. Adding a project = adding one object.

```ts
type Project = {
  slug: string
  title: string
  shortDescription: string
  longDescription: string
  tech: string[]
  status: 'live' | 'wip'
  github?: string
  demo?: string
  images: string[]
  hasPlayable: boolean
  embedUrl?: string
}
```

---

## Visual Style

- **Background:** Near-black (`#0a0a0a`)
- **Text:** White / light-gray
- **Accent:** Electric blue or teal — one color, used sparingly
- **Typography:** Inter or Geist — clean, modern, readable
- **WIP projects:** Shown in grid with muted "In Progress" badge

## Interactions

- Hero canvas: subtle drifting particle/noise animation
- Section entrance: fade + slide up on scroll into view (Framer Motion `whileInView`)
- Project cards: lift + border glow on hover
- Navbar: smooth active-section highlight
- Game embed: "Play" button activates iframe on click

---

## Extensibility

- New projects: add one object to `src/content/projects.ts`
- New sections: add a component and a nav link
- Static generation means zero runtime cost for project pages
