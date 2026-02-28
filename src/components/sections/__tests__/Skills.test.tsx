import { render, screen } from '@testing-library/react'
import Skills from '../Skills'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
  },
}))

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
