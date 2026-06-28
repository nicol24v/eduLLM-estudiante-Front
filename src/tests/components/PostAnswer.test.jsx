import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import PostAnswer from '../../features/game/states/PostAnswer'
import { useGameStore } from '../../stores/useGameStore'

vi.mock('../../stores/useGameStore', () => ({
  useGameStore: vi.fn(),
}))

vi.mock('../../features/game/components/ScoreDisplay', () => ({
  default: ({ score }) => <div data-testid="score-display">{score}</div>,
}))

const correctState = {
  myAnswer: {
    isCorrect: true,
    points: 150,
    retroalimentacion: 'La mitocondria produce energía.',
    opcionId: 'opt-1',
  },
  score: 450,
  currentQuestion: { opciones: [{ id_opcion: 'opt-1', texto: 'Mitocondria' }] },
}

const incorrectState = {
  myAnswer: {
    isCorrect: false,
    points: 0,
    retroalimentacion: null,
    opcionId: 'opt-2',
  },
  score: 300,
  currentQuestion: { opciones: [{ id_opcion: 'opt-2', texto: 'Núcleo' }] },
}

describe('PostAnswer — respuesta correcta', () => {
  beforeEach(() => vi.mocked(useGameStore).mockReturnValue(correctState))

  it('renders without crashing', () => {
    const { container } = render(<PostAnswer />)
    expect(container.firstChild).toBeTruthy()
  })

  it('shows happy emoji 🥳', () => {
    render(<PostAnswer />)
    expect(screen.getByText('🥳')).toBeInTheDocument()
  })

  it('shows sparkle emoji ✨', () => {
    render(<PostAnswer />)
    expect(screen.getByText('✨')).toBeInTheDocument()
  })

  it('shows correct title', () => {
    render(<PostAnswer />)
    expect(screen.getByText('¡Respuesta Correcta!')).toBeInTheDocument()
  })

  it('shows selected answer text', () => {
    render(<PostAnswer />)
    expect(screen.getByText('Mitocondria')).toBeInTheDocument()
  })

  it('shows points earned', () => {
    render(<PostAnswer />)
    expect(screen.getByText('+150 pts')).toBeInTheDocument()
  })

  it('shows retroalimentacion when present', () => {
    render(<PostAnswer />)
    expect(screen.getByText(/mitocondria produce energía/)).toBeInTheDocument()
  })

  it('shows ScoreDisplay', () => {
    render(<PostAnswer />)
    expect(screen.getByTestId('score-display')).toBeInTheDocument()
  })

  it('shows waiting message', () => {
    render(<PostAnswer />)
    expect(screen.getByText('Esperando al profesor...')).toBeInTheDocument()
  })
})

describe('PostAnswer — respuesta incorrecta', () => {
  beforeEach(() => vi.mocked(useGameStore).mockReturnValue(incorrectState))

  it('shows sad emoji 😭', () => {
    render(<PostAnswer />)
    expect(screen.getByText('😭')).toBeInTheDocument()
  })

  it('shows broken heart emoji 💔', () => {
    render(<PostAnswer />)
    expect(screen.getByText('💔')).toBeInTheDocument()
  })

  it('shows incorrect title', () => {
    render(<PostAnswer />)
    expect(screen.getByText('Respuesta Incorrecta')).toBeInTheDocument()
  })

  it('shows zero points', () => {
    render(<PostAnswer />)
    expect(screen.getByText('+0 pts')).toBeInTheDocument()
  })

  it('does not show retroalimentacion when null', () => {
    render(<PostAnswer />)
    expect(screen.queryByText(/Explicación/)).not.toBeInTheDocument()
  })
})

describe('PostAnswer — sin respuesta', () => {
  it('renders nothing when myAnswer is null', () => {
    vi.mocked(useGameStore).mockReturnValue({ myAnswer: null, score: 0, currentQuestion: null })
    const { container } = render(<PostAnswer />)
    expect(container.firstChild).toBeNull()
  })
})
