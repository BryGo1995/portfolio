# Portfolio Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a personal portfolio website in Next.js 15 to showcase fullstack and game development work to recruiters and engineers.

**Architecture:** Single scrollable homepage with Hero, About, Skills, Projects, and Contact sections. Individual project detail pages at `/projects/[slug]` are statically generated from a typed content config. A Next.js API route handles the contact form via Resend.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, Resend, Vercel

**Design doc:** `docs/plans/2026-02-27-portfolio-website-design.md`

---

## Task 1: Initialize Project + Git

**Files:**
- Create: `package.json` (via scaffolding)
- Create: `.env.local`
- Create: `.gitignore` (auto-generated)

**Step 1: Scaffold Next.js project**

Run from `C:/Users/broni/Dev_Space/Portfolio`:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

When prompted, accept all defaults.

**Step 2: Install additional dependencies**

```bash
npm install framer-motion resend
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

**Step 3: Configure Jest**

Create `jest.config.ts`:

```ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

Create `jest.setup.ts`:

```ts
import '@testing-library/jest-dom'
```

Add to `package.json` scripts:
```json
"test": "jest",
"test:watch": "jest --watch"
```

**Step 4: Create `.env.local`**

```
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=your@email.com
```

**Step 5: Initialize git and commit**

```bash
git init
git add .
git commit -m "chore: initialize Next.js 15 project with TypeScript and Tailwind"
```

Expected: clean git history with one commit.

---

## Task 2: Project Structure + Types + Content Config

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/content/projects.ts`
- Create: `src/content/skills.ts`
- Test: `src/lib/__tests__/types.test.ts`

**Step 1: Write the failing type validation test**

Create `src/lib/__tests__/types.test.ts`:

```ts
import { Project, Skill } from '../types'

describe('Project type', () => {
  it('accepts a valid project object', () => {
    const project: Project = {
      slug: 'my-game',
      title: 'My Game',
      shortDescription: 'A fun game',
      longDescription: 'A much longer description.',
      tech: ['Godot', 'GDScript'],
      status: 'live',
      images: [],
      hasPlayable: false,
    }
    expect(project.slug).toBe('my-game')
  })

  it('accepts a project with all optional fields', () => {
    const project: Project = {
      slug: 'playable-game',
      title: 'Playable Game',
      shortDescription: 'Play it now',
      longDescription: 'Full description.',
      tech: ['Love2D', 'Lua'],
      status: 'live',
      github: 'https://github.com/user/repo',
      demo: 'https://demo.com',
      images: ['/images/game1.png'],
      hasPlayable: true,
      embedUrl: 'https://itch.io/embed/12345',
    }
    expect(project.hasPlayable).toBe(true)
    expect(project.embedUrl).toBeDefined()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test src/lib/__tests__/types.test.ts
```

Expected: FAIL — `Cannot find module '../types'`

**Step 3: Create types**

Create `src/lib/types.ts`:

```ts
export type ProjectStatus = 'live' | 'wip'

export type Project = {
  slug: string
  title: string
  shortDescription: string
  longDescription: string
  tech: string[]
  status: ProjectStatus
  github?: string
  demo?: string
  images: string[]
  hasPlayable: boolean
  embedUrl?: string
}

export type SkillCategory = 'Frontend' | 'Backend' | 'Game Dev' | 'Languages'

export type Skill = {
  name: string
  category: SkillCategory
  icon?: string
}
```

**Step 4: Run test to verify it passes**

```bash
npm test src/lib/__tests__/types.test.ts
```

Expected: PASS

**Step 5: Create content config files**

Create `src/content/projects.ts`:

```ts
import type { Project } from '@/lib/types'

export const projects: Project[] = [
  {
    slug: 'example-game',
    title: 'Example Game',
    shortDescription: 'A short description of the game.',
    longDescription: 'Replace with your real project details.',
    tech: ['Godot', 'GDScript'],
    status: 'live',
    images: [],
    hasPlayable: true,
    embedUrl: 'https://your-embed-url.com',
  },
  // Add your other projects here
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getAllSlugs(): string[] {
  return projects.map((p) => p.slug)
}
```

Create `src/content/skills.ts`:

```ts
import type { Skill } from '@/lib/types'

export const skills: Skill[] = [
  // Frontend
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  // Backend
  { name: 'Node.js', category: 'Backend' },
  // Game Dev
  { name: 'Godot', category: 'Game Dev' },
  { name: 'Love2D', category: 'Game Dev' },
  { name: 'OpenGL', category: 'Game Dev' },
  // Languages
  { name: 'C++', category: 'Languages' },
  { name: 'Lua', category: 'Languages' },
  { name: 'GDScript', category: 'Languages' },
]
```

> Fill these in with your real skills and projects before deploying.

**Step 6: Commit**

```bash
git add src/lib/ src/content/
git commit -m "feat: add types and content config for projects and skills"
```

---

## Task 3: Global Layout + Navbar

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/components/layout/Navbar.tsx`
- Test: `src/components/layout/__tests__/Navbar.test.tsx`

**Step 1: Write the failing Navbar test**

Create `src/components/layout/__tests__/Navbar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Navbar from '../Navbar'

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /skills/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test src/components/layout/__tests__/Navbar.test.tsx
```

Expected: FAIL — `Cannot find module '../Navbar'`

**Step 3: Update globals.css**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

html {
  scroll-behavior: smooth;
}

body {
  background-color: #0a0a0a;
  color: #f5f5f5;
}
```

**Step 4: Update layout.tsx**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your Name | Fullstack & Game Developer',
  description: 'Portfolio of Your Name — fullstack web and game developer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
```

**Step 5: Create Navbar component**

Create `src/components/layout/Navbar.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold text-lg tracking-tight">
          YourName
        </Link>
        <ul className="flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
```

> Replace `YourName` with your actual name.

**Step 6: Run test to verify it passes**

```bash
npm test src/components/layout/__tests__/Navbar.test.tsx
```

Expected: PASS

**Step 7: Smoke test in browser**

```bash
npm run dev
```

Open `http://localhost:3000`. Navbar should be visible at top.

**Step 8: Commit**

```bash
git add src/app/ src/components/layout/
git commit -m "feat: add global layout and fixed navbar"
```

---

## Task 4: Hero Section

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Create: `src/components/ui/HeroCanvas.tsx`
- Test: `src/components/sections/__tests__/Hero.test.tsx`

**Step 1: Write the failing Hero test**

Create `src/components/sections/__tests__/Hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Hero from '../Hero'

// Canvas is not supported in jsdom
HTMLCanvasElement.prototype.getContext = jest.fn()

describe('Hero', () => {
  it('renders name and tagline', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view work/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test src/components/sections/__tests__/Hero.test.tsx
```

Expected: FAIL — `Cannot find module '../Hero'`

**Step 3: Create HeroCanvas component**

Create `src/components/ui/HeroCanvas.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; alpha: number }[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`
        ctx.fill()
      })

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />
}
```

**Step 4: Create Hero component**

Create `src/components/sections/Hero.tsx`:

```tsx
import Link from 'next/link'
import dynamic from 'next/dynamic'

const HeroCanvas = dynamic(() => import('@/components/ui/HeroCanvas'), { ssr: false })

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeroCanvas />
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p className="text-sky-400 text-sm font-mono tracking-widest uppercase mb-4">
          Fullstack &amp; Game Developer
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Your Name
        </h1>
        <p className="text-white/60 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
          I build web applications and games — from interactive UIs to 3D renderers.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="#projects"
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-white/20 hover:border-white/40 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </section>
  )
}
```

> Replace `Your Name` and the tagline with your actual info.

**Step 5: Run test to verify it passes**

```bash
npm test src/components/sections/__tests__/Hero.test.tsx
```

Expected: PASS

**Step 6: Add Hero to homepage**

Replace `src/app/page.tsx` with:

```tsx
import Hero from '@/components/sections/Hero'

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  )
}
```

**Step 7: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000`. Animated particle canvas + hero text should be visible.

**Step 8: Commit**

```bash
git add src/components/sections/ src/components/ui/ src/app/page.tsx
git commit -m "feat: add hero section with animated particle canvas"
```

---

## Task 5: About Section

**Files:**
- Create: `src/components/sections/About.tsx`
- Test: `src/components/sections/__tests__/About.test.tsx`

**Step 1: Write the failing About test**

Create `src/components/sections/__tests__/About.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import About from '../About'

describe('About', () => {
  it('renders the about section heading', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test src/components/sections/__tests__/About.test.tsx
```

Expected: FAIL

**Step 3: Create About component**

Create `src/components/sections/About.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sky-400 text-sm font-mono tracking-widest uppercase mb-4">About</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">A bit about me</h2>
        <div className="max-w-2xl space-y-4 text-white/60 text-base leading-relaxed">
          <p>
            Replace this with your actual bio. Talk about your background, what drives you,
            and what kind of problems you love solving.
          </p>
          <p>
            Mention your game dev experience with Godot, Love2D, and OpenGL/C++ here.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
```

**Step 4: Run test to verify it passes**

```bash
npm test src/components/sections/__tests__/About.test.tsx
```

Expected: PASS

**Step 5: Add About to homepage**

Modify `src/app/page.tsx`:

```tsx
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
    </main>
  )
}
```

**Step 6: Commit**

```bash
git add src/components/sections/About.tsx src/app/page.tsx
git commit -m "feat: add about section"
```

---

## Task 6: Skills Section

**Files:**
- Create: `src/components/sections/Skills.tsx`
- Create: `src/components/ui/SkillChip.tsx`
- Test: `src/components/sections/__tests__/Skills.test.tsx`

**Step 1: Write the failing Skills test**

Create `src/components/sections/__tests__/Skills.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Skills from '../Skills'

describe('Skills', () => {
  it('renders skill categories', () => {
    render(<Skills />)
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('Game Dev')).toBeInTheDocument()
  })

  it('renders individual skills', () => {
    render(<Skills />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Godot')).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test src/components/sections/__tests__/Skills.test.tsx
```

Expected: FAIL

**Step 3: Create SkillChip**

Create `src/components/ui/SkillChip.tsx`:

```tsx
export default function SkillChip({ name }: { name: string }) {
  return (
    <span className="px-3 py-1.5 text-sm text-white/70 bg-white/5 border border-white/10 rounded-full hover:border-sky-500/40 hover:text-sky-300 transition-colors duration-200">
      {name}
    </span>
  )
}
```

**Step 4: Create Skills component**

Create `src/components/sections/Skills.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import { skills } from '@/content/skills'
import SkillChip from '@/components/ui/SkillChip'
import type { SkillCategory } from '@/lib/types'

const categories: SkillCategory[] = ['Frontend', 'Backend', 'Game Dev', 'Languages']

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sky-400 text-sm font-mono tracking-widest uppercase mb-4">Skills</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">What I work with</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category)
            if (categorySkills.length === 0) return null
            return (
              <div key={category}>
                <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <SkillChip key={skill.name} name={skill.name} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
```

**Step 5: Run test to verify it passes**

```bash
npm test src/components/sections/__tests__/Skills.test.tsx
```

Expected: PASS

**Step 6: Add Skills to homepage**

Modify `src/app/page.tsx`:

```tsx
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
    </main>
  )
}
```

**Step 7: Commit**

```bash
git add src/components/sections/Skills.tsx src/components/ui/SkillChip.tsx src/app/page.tsx
git commit -m "feat: add skills section with grouped chip layout"
```

---

## Task 7: Projects Section + ProjectCard

**Files:**
- Create: `src/components/sections/Projects.tsx`
- Create: `src/components/ui/ProjectCard.tsx`
- Test: `src/components/ui/__tests__/ProjectCard.test.tsx`
- Test: `src/components/sections/__tests__/Projects.test.tsx`

**Step 1: Write the failing ProjectCard test**

Create `src/components/ui/__tests__/ProjectCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import ProjectCard from '../ProjectCard'
import type { Project } from '@/lib/types'

const mockProject: Project = {
  slug: 'test-game',
  title: 'Test Game',
  shortDescription: 'A test game description.',
  longDescription: 'Long description.',
  tech: ['Godot', 'GDScript'],
  status: 'live',
  images: [],
  hasPlayable: false,
}

describe('ProjectCard', () => {
  it('renders project title and description', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('Test Game')).toBeInTheDocument()
    expect(screen.getByText('A test game description.')).toBeInTheDocument()
  })

  it('renders tech tags', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('Godot')).toBeInTheDocument()
  })

  it('shows Live badge for live projects', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('shows In Progress badge for wip projects', () => {
    render(<ProjectCard project={{ ...mockProject, status: 'wip' }} />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('links to the project detail page', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/projects/test-game')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test src/components/ui/__tests__/ProjectCard.test.tsx
```

Expected: FAIL

**Step 3: Create ProjectCard component**

Create `src/components/ui/ProjectCard.tsx`:

```tsx
import Link from 'next/link'
import type { Project } from '@/lib/types'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block p-6 bg-white/[0.03] border border-white/10 rounded-xl hover:border-sky-500/40 hover:bg-white/[0.05] transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-semibold text-lg group-hover:text-sky-300 transition-colors duration-200">
          {project.title}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ml-3 shrink-0 ${
            project.status === 'live'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-white/5 text-white/40 border border-white/10'
          }`}
        >
          {project.status === 'live' ? 'Live' : 'In Progress'}
        </span>
      </div>
      <p className="text-white/50 text-sm leading-relaxed mb-4">{project.shortDescription}</p>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span key={t} className="text-xs text-sky-400/70 bg-sky-500/10 px-2 py-0.5 rounded">
            {t}
          </span>
        ))}
      </div>
    </Link>
  )
}
```

**Step 4: Run ProjectCard test to verify it passes**

```bash
npm test src/components/ui/__tests__/ProjectCard.test.tsx
```

Expected: PASS

**Step 5: Write the failing Projects section test**

Create `src/components/sections/__tests__/Projects.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Projects from '../Projects'

describe('Projects', () => {
  it('renders projects heading', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
  })

  it('renders project cards from content config', () => {
    render(<Projects />)
    // At least one project card should be rendered
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0)
  })
})
```

**Step 6: Create Projects component**

Create `src/components/sections/Projects.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import { projects } from '@/content/projects'
import ProjectCard from '@/components/ui/ProjectCard'

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sky-400 text-sm font-mono tracking-widest uppercase mb-4">Projects</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Things I've built</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
```

**Step 7: Run Projects test to verify it passes**

```bash
npm test src/components/sections/__tests__/Projects.test.tsx
```

Expected: PASS

**Step 8: Add Projects to homepage**

Modify `src/app/page.tsx`:

```tsx
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
    </main>
  )
}
```

**Step 9: Commit**

```bash
git add src/components/ src/app/page.tsx
git commit -m "feat: add projects section with card grid"
```

---

## Task 8: Contact Section + API Route

**Files:**
- Create: `src/components/sections/Contact.tsx`
- Create: `src/app/api/contact/route.ts`
- Test: `src/app/api/contact/__tests__/route.test.ts`

**Step 1: Write the failing API route test**

Create `src/app/api/contact/__tests__/route.test.ts`:

```ts
import { POST } from '../route'
import { NextRequest } from 'next/server'

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'test-id', error: null }),
    },
  })),
}))

describe('POST /api/contact', () => {
  it('returns 400 for missing fields', async () => {
    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: '', email: '', message: '' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 for valid submission', async () => {
    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello!',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test src/app/api/contact/__tests__/route.test.ts
```

Expected: FAIL

**Step 3: Create the API route**

Create `src/app/api/contact/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const { error } = await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL!,
    subject: `Portfolio contact from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  })

  if (error) {
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
```

**Step 4: Run test to verify it passes**

```bash
npm test src/app/api/contact/__tests__/route.test.ts
```

Expected: PASS

**Step 5: Create Contact section**

Create `src/components/sections/Contact.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function Contact() {
  const [state, setState] = useState<FormState>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setState(res.ok ? 'success' : 'error')
    if (res.ok) form.reset()
  }

  return (
    <section id="contact" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-lg"
      >
        <p className="text-sky-400 text-sm font-mono tracking-widest uppercase mb-4">Contact</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get in touch</h2>
        <p className="text-white/50 mb-10">
          Open to fullstack and game dev roles. Drop me a message and I'll get back to you.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Your name"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 transition-colors"
          />
          <input
            name="email"
            type="email"
            placeholder="Your email"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 transition-colors"
          />
          <textarea
            name="message"
            placeholder="Your message"
            rows={5}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            {state === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
          {state === 'success' && (
            <p className="text-emerald-400 text-sm">Message sent! I'll be in touch.</p>
          )}
          {state === 'error' && (
            <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
          )}
        </form>
      </motion.div>
    </section>
  )
}
```

**Step 6: Add Contact to homepage**

Modify `src/app/page.tsx`:

```tsx
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
  )
}
```

**Step 7: Commit**

```bash
git add src/app/api/ src/components/sections/Contact.tsx src/app/page.tsx
git commit -m "feat: add contact section and API route with Resend"
```

---

## Task 9: Project Detail Page

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`
- Test: `src/app/projects/[slug]/__tests__/page.test.tsx`

**Step 1: Write the failing page test**

Create `src/app/projects/[slug]/__tests__/page.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import ProjectPage, { generateStaticParams } from '../page'

jest.mock('@/content/projects', () => ({
  getProjectBySlug: jest.fn().mockReturnValue({
    slug: 'test-game',
    title: 'Test Game',
    shortDescription: 'Short desc.',
    longDescription: 'Long description of the test game.',
    tech: ['Godot'],
    status: 'live',
    images: [],
    hasPlayable: false,
  }),
  getAllSlugs: jest.fn().mockReturnValue(['test-game']),
}))

describe('ProjectPage', () => {
  it('renders project title and description', async () => {
    const page = await ProjectPage({ params: Promise.resolve({ slug: 'test-game' }) })
    render(page)
    expect(screen.getByRole('heading', { name: 'Test Game' })).toBeInTheDocument()
    expect(screen.getByText('Long description of the test game.')).toBeInTheDocument()
  })

  it('renders tech stack tags', async () => {
    const page = await ProjectPage({ params: Promise.resolve({ slug: 'test-game' }) })
    render(page)
    expect(screen.getByText('Godot')).toBeInTheDocument()
  })
})

describe('generateStaticParams', () => {
  it('returns all project slugs', async () => {
    const params = await generateStaticParams()
    expect(params).toEqual([{ slug: 'test-game' }])
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test "src/app/projects/\[slug\]/__tests__/page.test.tsx"
```

Expected: FAIL

**Step 3: Create the project detail page**

Create `src/app/projects/[slug]/page.tsx`:

```tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getAllSlugs } from '@/content/projects'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) notFound()

  return (
    <main className="min-h-screen px-6 py-32 max-w-3xl mx-auto">
      <Link
        href="/#projects"
        className="text-sm text-white/40 hover:text-white transition-colors mb-8 inline-flex items-center gap-2"
      >
        ← Back to projects
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-4xl font-bold text-white">{project.title}</h1>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              project.status === 'live'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-white/5 text-white/40 border border-white/10'
            }`}
          >
            {project.status === 'live' ? 'Live' : 'In Progress'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((t) => (
            <span key={t} className="text-xs text-sky-400/70 bg-sky-500/10 px-2 py-0.5 rounded">
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              GitHub →
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white bg-sky-500 hover:bg-sky-400 px-4 py-2 rounded-lg transition-colors"
            >
              Live Demo →
            </a>
          )}
        </div>
      </div>

      {project.hasPlayable && project.embedUrl && (
        <div className="mb-10 rounded-xl overflow-hidden border border-white/10 bg-white/5">
          <p className="text-xs text-white/30 px-4 py-2 border-b border-white/5">Playable Demo</p>
          <iframe
            src={project.embedUrl}
            className="w-full h-[500px]"
            allowFullScreen
          />
        </div>
      )}

      {project.images.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mb-10">
          {project.images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={img} alt={`${project.title} screenshot ${i + 1}`} className="rounded-lg w-full" />
          ))}
        </div>
      )}

      <div className="prose prose-invert max-w-none">
        <p className="text-white/60 leading-relaxed">{project.longDescription}</p>
      </div>
    </main>
  )
}
```

**Step 4: Run test to verify it passes**

```bash
npm test "src/app/projects/\[slug\]/__tests__/page.test.tsx"
```

Expected: PASS

**Step 5: Verify in browser**

```bash
npm run dev
```

Navigate to `http://localhost:3000/projects/example-game`. Project detail page should render.

**Step 6: Commit**

```bash
git add src/app/projects/
git commit -m "feat: add project detail page with game embed support"
```

---

## Task 10: Run All Tests + Production Build Check

**Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests PASS with no failures.

**Step 2: Build for production**

```bash
npm run build
```

Expected: Build completes with no errors. All project detail pages statically generated.

**Step 3: Fix any build errors**

If TypeScript or ESLint errors appear, fix them before continuing.

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build errors"
```

---

## Task 11: Fill In Real Content

**Files to edit:**
- `src/content/projects.ts` — Replace placeholder with real projects
- `src/content/skills.ts` — Add/remove skills to match your actual experience
- `src/components/sections/Hero.tsx` — Replace name and tagline
- `src/components/sections/About.tsx` — Replace placeholder bio
- `src/components/layout/Navbar.tsx` — Replace `YourName`
- `src/app/layout.tsx` — Update `metadata` title and description

**Step 1: Update all placeholder content**

Go through each file listed above and replace placeholder text with real content.

**Step 2: Add project images**

Place project screenshots in `public/images/` and reference them in `src/content/projects.ts`.

**Step 3: Verify in browser**

```bash
npm run dev
```

Check every section and every project card/detail page looks correct.

**Step 4: Commit**

```bash
git add src/ public/
git commit -m "content: add real projects, skills, and bio"
```

---

## Task 12: Deploy to Vercel

**Step 1: Create a GitHub repository**

```bash
gh repo create portfolio --public --source=. --push
```

Or create via GitHub web UI and push manually:

```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

**Step 2: Deploy via Vercel CLI**

```bash
npx vercel
```

Follow the prompts. Link to your GitHub repo for automatic deployments on push.

**Step 3: Set environment variables in Vercel**

In the Vercel dashboard → Project → Settings → Environment Variables, add:
- `RESEND_API_KEY` — your Resend API key
- `CONTACT_EMAIL` — the email address to receive contact form submissions

**Step 4: Verify production deploy**

Open the deployed URL. Test the contact form end-to-end. Check all project pages load.

**Step 5: Set up a Resend account**

Go to https://resend.com, create a free account, get your API key, and add it to Vercel environment variables.

---

## Summary

| Task | Description |
|---|---|
| 1 | Initialize Next.js project + git |
| 2 | Types, content config (projects + skills) |
| 3 | Global layout + Navbar |
| 4 | Hero section + particle canvas |
| 5 | About section |
| 6 | Skills section |
| 7 | Projects section + ProjectCard |
| 8 | Contact section + API route |
| 9 | Project detail page |
| 10 | Full test suite + production build |
| 11 | Real content (projects, bio, skills) |
| 12 | Deploy to Vercel |
