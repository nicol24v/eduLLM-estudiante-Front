import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useAuthStore } from '../stores/useAuthStore'
import { useGameStore } from '../stores/useGameStore'

export function usePlayerSocket(codigoAcceso) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const socketRef = useRef(null)
  const intentionalLeave = useRef(false)

  const { token, idEstudianteMateria, nombre, apellidoPaterno } = useAuthStore()
  const {
    initGame, setQuestion, openAnswers,
    submitAnswer, setLeaderboard, setFinished, setStatus, reset,
    addPlayer, removePlayer,
  } = useGameStore()

  const nickname = [nombre, apellidoPaterno].filter(Boolean).join(' ') || 'Estudiante'

  useEffect(() => {
    if (!codigoAcceso || !token || !idEstudianteMateria) return

    const socket = io(import.meta.env.VITE_SOCKET_URL || undefined, {
      path: '/game/socket.io',
      query: { role: 'player' },
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit(
        'player:join',
        { codigoAcceso, playerId: String(idEstudianteMateria), nickname },
        (res) => {
          if (!res?.ok) {
            enqueueSnackbar(res?.error || 'No se pudo unir a la sala', { variant: 'error' })
            navigate('/join', { replace: true })
            return
          }
          initGame(codigoAcceso, res.data?.titulo ?? '', res.data?.totalPreguntas ?? 0, res.data?.players ?? [])

          const { status, currentQuestion } = res.data || {}
          if (status === 'SHOW_START') {
            setStatus('SHOW_START')
          } else if ((status === 'SHOW_QUESTION' || status === 'SELECT_ANSWER') && currentQuestion) {
            const elapsedSec = Math.floor((currentQuestion.elapsedMs || 0) / 1000)
            const question = {
              ...currentQuestion,
              tiempo_limite: Math.max(1, currentQuestion.tiempo_limite - elapsedSec),
            }
            setQuestion(question)
            if (status === 'SELECT_ANSWER') {
              openAnswers()
            }
          }
        },
      )
    })

    socket.on('game:player_joined', ({ playerId, nickname }) => {
      addPlayer({ playerId, nickname })
    })

    socket.on('game:player_left', ({ playerId }) => {
      removePlayer(playerId)
    })

    socket.on('game:started', () => {
      setStatus('SHOW_START')
    })

    socket.on('game:question', (questionData) => {
      setQuestion(questionData)
    })

    socket.on('game:open_answers', () => {
      openAnswers()
    })

    socket.on('game:responses', () => {
      const state = useGameStore.getState()
      if (state.status === 'SELECT_ANSWER' || state.status === 'SHOW_QUESTION') {
        useGameStore.setState({
          status: 'POST_ANSWER',
          myAnswer: {
            opcionId: null,
            isCorrect: false,
            points: 0,
            retroalimentacion: null,
            correctOpcionId: null,
          },
        })
      }
    })

    socket.on('game:leaderboard', ({ leaderboard }) => {
      setLeaderboard(leaderboard, String(idEstudianteMateria))
    })

    socket.on('game:finished', ({ leaderboard, idPartidaEstudianteMap }) => {
      const idPartidaEstudiante = idPartidaEstudianteMap?.[String(idEstudianteMateria)] ?? null
      setFinished(leaderboard, String(idEstudianteMateria), idPartidaEstudiante)
    })

    socket.on('game:kicked', () => {
      enqueueSnackbar('Fuiste expulsado de la sala', { variant: 'warning' })
      reset()
      navigate('/join', { replace: true })
    })

    socket.on('disconnect', () => {
      if (!intentionalLeave.current) {
        enqueueSnackbar('Conexión perdida. Reconectando...', { variant: 'info' })
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [codigoAcceso, token, idEstudianteMateria])

  const sendAnswer = useCallback((opcionId) => {
    const socket = socketRef.current
    if (!socket || !idEstudianteMateria) return

    socket.emit(
      'player:answer',
      { codigoAcceso, playerId: String(idEstudianteMateria), opcionId },
      (res) => {
        if (res?.ok && res.data?.accepted) {
          submitAnswer(opcionId, res.data)
        }
      },
    )
  }, [codigoAcceso, idEstudianteMateria, submitAnswer])

  const leaveRoom = useCallback(() => {
    intentionalLeave.current = true
    socketRef.current?.emit('player:leave')
    reset()
    navigate('/join', { replace: true })
  }, [reset, navigate])

  return { sendAnswer, leaveRoom }
}
