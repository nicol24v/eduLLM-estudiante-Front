import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Layout from '../../components/Layout'

vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../../stores/useAuthStore', () => ({
  useAuthStore: () => ({ nombre: 'Ana', apellidoPaterno: 'García', logout: vi.fn() }),
}))
vi.mock('../../stores/useGameStore', () => ({
  useGameStore: (selector) => selector({ reset: vi.fn() }),
}))

describe('Layout navbar', () => {
  it('renders EduQuiz logo text', () => {
    render(<Layout><div /></Layout>)
    expect(screen.getByText('EduQuiz')).toBeInTheDocument()
  })

  it('renders Historial pill button', () => {
    render(<Layout><div /></Layout>)
    expect(screen.getByText('Historial')).toBeInTheDocument()
  })

  it('renders logout button', () => {
    render(<Layout><div /></Layout>)
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(<Layout><div data-testid="child-content">hello</div></Layout>)
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
  })
})
