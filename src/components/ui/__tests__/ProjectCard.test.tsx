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
