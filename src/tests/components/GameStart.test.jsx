import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import GameStart from '../../features/game/states/GameStart'

vi.mock('../../components/ScienceBackground', () => ({
  default: () => <div data-testid="science-background" />,
}))

vi.mock('../../assets/illustrations/cute-earth.svg', () => ({
  default: 'cute-earth.svg',
}))

const defaultProps = { quizTitle: 'Biología Celular', totalPreguntas: 10 }

describe('GameStart', () => {
  it('renders without crashing', () => {
    const { container } = render(<GameStart {...defaultProps} />)
    expect(container.firstChild).toBeTruthy()
  })

  it('shows the quiz title', () => {
    render(<GameStart {...defaultProps} />)
    expect(screen.getByText('Biología Celular')).toBeInTheDocument()
  })

  it('shows the question count', () => {
    render(<GameStart {...defaultProps} />)
    expect(screen.getByText(/10 preguntas/)).toBeInTheDocument()
  })

  it('shows the excitement message', () => {
    render(<GameStart {...defaultProps} />)
    expect(screen.getByText('¡La prueba comienza!')).toBeInTheDocument()
  })

  it('renders the rocket emoji', () => {
    render(<GameStart {...defaultProps} />)
    expect(screen.getByText('🚀')).toBeInTheDocument()
  })

  it('renders ScienceBackground', () => {
    render(<GameStart {...defaultProps} />)
    expect(screen.getByTestId('science-background')).toBeInTheDocument()
  })

  it('cute-earth illustration is decorative (aria-hidden)', () => {
    render(<GameStart {...defaultProps} />)
    const imgs = document.querySelectorAll('img[aria-hidden="true"]')
    expect(imgs.length).toBeGreaterThan(0)
  })
})
