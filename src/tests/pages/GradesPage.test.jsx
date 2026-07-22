import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { historyService } from '../../services/historyService'
import GradesPage from '../../pages/grades/GradesPage'

const mockNavigate = vi.fn()
let mockSearchParams = new URLSearchParams()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams],
}))
vi.mock('../../services/historyService', () => ({
  historyService: { getList: vi.fn() },
}))
vi.mock('../../stores/useAuthStore', () => ({
  useAuthStore: (selector) => selector({ nombre: 'Ana', apellidoPaterno: 'García' }),
}))

function partida(overrides) {
  return {
    id_partida_estudiante: 1,
    fecha_creacion: '2026-07-01T00:00:00.000Z',
    respuestas_correctas: 5,
    tbl_t_partida: {
      tbl_t_prueba: { id_prueba: 10, titulo: 'La célula', _count: { tbl_t_pregunta: 10 } },
    },
    ...overrides,
  }
}

describe('GradesPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockSearchParams = new URLSearchParams()
  })

  it('renders one row per attempt instead of deduplicating by quiz', async () => {
    historyService.getList.mockResolvedValueOnce([
      partida({ id_partida_estudiante: 1, fecha_creacion: '2026-07-01T00:00:00.000Z', respuestas_correctas: 5 }),
      partida({ id_partida_estudiante: 2, fecha_creacion: '2026-07-05T00:00:00.000Z', respuestas_correctas: 8 }),
    ])
    render(<GradesPage />)
    expect(await screen.findAllByText('La célula')).toHaveLength(2)
  })

  it('fetches the list filtered by materiaId from the URL', async () => {
    mockSearchParams = new URLSearchParams('materiaId=7')
    historyService.getList.mockResolvedValueOnce([])
    render(<GradesPage />)
    await screen.findByText('No tienes cuestionarios registrados aún.')
    expect(historyService.getList).toHaveBeenCalledWith('7')
  })

  it('shows a revision button that always navigates to /grades/:id', async () => {
    historyService.getList.mockResolvedValueOnce([
      partida({ id_partida_estudiante: 3 }),
    ])
    render(<GradesPage />)
    const button = await screen.findByRole('button', { name: 'Ver revisión' })
    expect(button).not.toBeDisabled()
    fireEvent.click(button)
    expect(mockNavigate).toHaveBeenCalledWith('/grades/3')
  })

  it('averages the score across all attempts shown, not just the best per quiz', async () => {
    historyService.getList.mockResolvedValueOnce([
      partida({ id_partida_estudiante: 1, respuestas_correctas: 5 }),
      partida({ id_partida_estudiante: 2, respuestas_correctas: 8 }),
    ])
    render(<GradesPage />)
    expect(await screen.findByText('6.5 / 10')).toBeInTheDocument()
  })
})
