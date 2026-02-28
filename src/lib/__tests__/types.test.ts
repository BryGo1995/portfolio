import { Project } from '../types'

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
