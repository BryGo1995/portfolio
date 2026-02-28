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
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getAllSlugs(): string[] {
  return projects.map((p) => p.slug)
}
