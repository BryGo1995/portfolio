import { render, screen } from '@testing-library/react'
import About from '../About'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
  },
}))

describe('About', () => {
  it('renders the about section heading', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
  })
})
