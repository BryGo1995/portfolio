import { render, screen } from '@testing-library/react'
import Projects from '../Projects'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
  },
}))

describe('Projects', () => {
  it('renders projects heading', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { name: /things i've built/i })).toBeInTheDocument()
  })

  it('renders project cards from content config', () => {
    render(<Projects />)
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0)
  })
})
