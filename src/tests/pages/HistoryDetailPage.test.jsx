import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { historyService } from '../../services/historyService'
import HistoryDetailPage from '../../pages/history/HistoryDetailPage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}))
vi.mock('../../services/historyService', () => ({
  historyService: { getDetail: vi.fn() },
}))

const detalleMock = {
  partida: {
    puntaje_total: 10,
    respuestas_correctas: 1,
    tbl_t_partida: { tbl_t_prueba: { titulo: 'La célula', _count: { tbl_t_pregunta: 1 } } },
    tbl_m_estudiante_materia: { tbl_m_materia: { nombre: 'Biología', id_materia: 5 } },
  },
  respuestas: [],
}

describe('HistoryDetailPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    historyService.getDetail.mockResolvedValue(detalleMock)
  })

  it('renders a "Volver a calificaciones" button', async () => {
    render(<HistoryDetailPage />)
    expect(await screen.findByText('Volver a calificaciones')).toBeInTheDocument()
  })

  it('navigates to /grades with the materiaId when the back button is clicked', async () => {
    render(<HistoryDetailPage />)
    const backButton = await screen.findByText('Volver a calificaciones')
    fireEvent.click(backButton)
    expect(mockNavigate).toHaveBeenCalledWith('/grades?materiaId=5')
  })

  it('redirects to /grades when the detail fails to load', async () => {
    historyService.getDetail.mockRejectedValueOnce(new Error('fail'))
    render(<HistoryDetailPage />)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/grades', { replace: true })
    })
  })
})
