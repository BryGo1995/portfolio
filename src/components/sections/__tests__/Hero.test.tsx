import { render, screen } from '@testing-library/react'
import Hero from '../Hero'

// Canvas API is not supported in jsdom
HTMLCanvasElement.prototype.getContext = jest.fn()

describe('Hero', () => {
  it('renders name and tagline', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view work/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })
})
