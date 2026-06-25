import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { historyService } from '../../services/historyService'
import HomePage from '../../pages/home/HomePage'

vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../../stores/useAuthStore', () => ({
  useAuthStore: (selector) => selector({ nombre: 'Ana' }),
}))
vi.mock('../../services/historyService', () => ({
  historyService: { getStats: vi.fn() },
}))
vi.mock('../../components/ScienceBackground', () => ({
  default: () => <div data-testid="science-bg" />,
}))

describe('HomePage', () => {
  beforeEach(() => {
    historyService.getStats.mockResolvedValue([])
  })

  it('renders personalized greeting', async () => {
    render(<HomePage />)
    expect(await screen.findByText('¡Hola, Ana!')).toBeInTheDocument()
  })

  it('renders join button', async () => {
    render(<HomePage />)
    expect(await screen.findByText('Unirse a sala')).toBeInTheDocument()
  })

  it('renders ScienceBackground', async () => {
    render(<HomePage />)
    expect(await screen.findByTestId('science-bg')).toBeInTheDocument()
  })

  it('renders stat card when stats are present', async () => {
    historyService.getStats.mockResolvedValueOnce([{
      id_estudiante_materia: 1,
      promedio_puntaje: 85,
      total_partidas: 3,
      materia: { id_materia: 1, nombre: 'Biología' },
    }])
    render(<HomePage />)
    expect(await screen.findByText('Biología')).toBeInTheDocument()
    expect(await screen.findByText('85')).toBeInTheDocument()
  })

  it('does not render stats section when stats are empty', async () => {
    render(<HomePage />)
    await screen.findByText('Unirse a sala')
    expect(screen.queryByText('Mi promedio por materia')).not.toBeInTheDocument()
  })
})
