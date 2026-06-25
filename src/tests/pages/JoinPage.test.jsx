import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JoinPage from '../../pages/join/JoinPage'

vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../../stores/useAuthStore', () => ({
  useAuthStore: () => ({ setPreJoinData: vi.fn() }),
}))
vi.mock('../../services/gameService', () => ({
  gameService: { preJoin: vi.fn() },
}))
vi.mock('../../components/ScienceBackground', () => ({
  default: () => <div data-testid="science-bg" />,
}))

describe('JoinPage', () => {
  it('renders ScienceBackground', () => {
    render(<JoinPage />)
    expect(screen.getByTestId('science-bg')).toBeInTheDocument()
  })

  it('renders code input', () => {
    render(<JoinPage />)
    expect(screen.getByPlaceholderText('ABC123')).toBeInTheDocument()
  })

  it('renders join button disabled when code is empty', () => {
    render(<JoinPage />)
    expect(screen.getByRole('button', { name: /unirse/i })).toBeDisabled()
  })

  it('converts input to uppercase', async () => {
    render(<JoinPage />)
    const input = screen.getByPlaceholderText('ABC123')
    await userEvent.type(input, 'abc')
    expect(input.value).toBe('ABC')
  })

  it('shows error when sala not found', async () => {
    const { gameService } = await import('../../services/gameService')
    gameService.preJoin.mockRejectedValueOnce({ response: { status: 404 } })
    render(<JoinPage />)
    const input = screen.getByPlaceholderText('ABC123')
    await userEvent.type(input, 'ABC123')
    await userEvent.click(screen.getByRole('button', { name: /unirse/i }))
    expect(await screen.findByText('Sala no encontrada. Verifica el código.')).toBeInTheDocument()
  })
})
