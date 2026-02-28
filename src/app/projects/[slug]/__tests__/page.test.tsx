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
