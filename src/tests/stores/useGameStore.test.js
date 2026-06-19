import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../../stores/useGameStore'
import { act } from '@testing-library/react'

const mockQuestion = {
  index: 0,
  total: 5,
  id_pregunta: 10,
  texto: '¿Cuánto es 2+2?',
  tiempo_limite: 30,
  cooldown: 5,
  image_url: null,
  opciones: [
    { id_opcion: 1, texto: 'Tres', orden: 1, es_correcta: false, retroalimentacion: null },
    { id_opcion: 2, texto: 'Cuatro', orden: 2, es_correcta: true, retroalimentacion: 'Es 4.' },
  ],
}

beforeEach(() => { act(() => useGameStore.getState().reset()) })

describe('useGameStore', () => {
  it('initGame sets status to SHOW_ROOM', () => {
    act(() => useGameStore.getState().initGame('ABC123', 'Quiz Test', 5))
    expect(useGameStore.getState().status).toBe('SHOW_ROOM')
    expect(useGameStore.getState().codigoAcceso).toBe('ABC123')
  })

  it('setQuestion sets status to SHOW_QUESTION and resets myAnswer', () => {
    act(() => useGameStore.getState().setQuestion(mockQuestion))
    const state = useGameStore.getState()
    expect(state.status).toBe('SHOW_QUESTION')
    expect(state.currentQuestion).toEqual(mockQuestion)
    expect(state.myAnswer).toBeNull()
  })

  it('submitAnswer sets POST_ANSWER and accumulates score', () => {
    act(() => useGameStore.getState().setQuestion(mockQuestion))
    act(() => useGameStore.getState().submitAnswer(2, { isCorrect: true, points: 800, retroalimentacion: 'Es 4.', correctOpcionId: 2 }))
    const state = useGameStore.getState()
    expect(state.status).toBe('POST_ANSWER')
    expect(state.score).toBe(800)
    expect(state.myAnswer.isCorrect).toBe(true)
    expect(state.answerHistory).toHaveLength(1)
  })

  it('setLeaderboard sets SHOW_LEADERBOARD and myPosition', () => {
    const lb = [
      { position: 1, playerId: '99', nickname: 'Otro', score: 900, correctAnswers: 5 },
      { position: 2, playerId: '42', nickname: 'Yo', score: 800, correctAnswers: 4 },
    ]
    act(() => useGameStore.getState().setLeaderboard(lb, '42'))
    expect(useGameStore.getState().status).toBe('SHOW_LEADERBOARD')
    expect(useGameStore.getState().myPosition).toBe(2)
  })

  it('reset clears all state', () => {
    act(() => useGameStore.getState().initGame('X', 'Q', 3))
    act(() => useGameStore.getState().reset())
    expect(useGameStore.getState().status).toBeNull()
    expect(useGameStore.getState().score).toBe(0)
  })
})
