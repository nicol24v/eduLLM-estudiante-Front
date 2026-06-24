import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  status: null,
  codigoAcceso: null,
  quizTitle: null,
  totalPreguntas: null,
  currentQuestion: null,
  myAnswer: null,
  score: 0,
  leaderboard: [],
  myPosition: null,
  answerHistory: [],
  idPartidaEstudiante: null,

  initGame: (codigoAcceso, quizTitle, totalPreguntas) =>
    set({ codigoAcceso, quizTitle, totalPreguntas, status: 'SHOW_ROOM', score: 0, answerHistory: [], myAnswer: null }),

  setQuestion: (questionData) =>
    set({ currentQuestion: questionData, myAnswer: null, status: 'SHOW_QUESTION' }),

  openAnswers: () => set({ status: 'SELECT_ANSWER' }),

  submitAnswer: (opcionId, ackResult) => {
    const { currentQuestion, score, answerHistory } = get()
    const correctOption = currentQuestion?.opciones?.find((o) => o.es_correcta)
    set({
      status: 'POST_ANSWER',
      myAnswer: {
        opcionId,
        isCorrect: ackResult.isCorrect,
        points: ackResult.points,
        retroalimentacion: ackResult.retroalimentacion ?? null,
        correctOpcionId: ackResult.correctOpcionId ?? correctOption?.id_opcion ?? null,
      },
      score: score + (ackResult.points ?? 0),
      answerHistory: [
        ...answerHistory,
        {
          pregunta_id: currentQuestion?.id_pregunta ?? null,
          texto: currentQuestion?.texto ?? '',
          opciones: currentQuestion?.opciones ?? [],
          selectedOpcionId: opcionId,
          isCorrect: ackResult.isCorrect,
          correctOpcionId: ackResult.correctOpcionId ?? correctOption?.id_opcion ?? null,
          retroalimentacion: ackResult.retroalimentacion ?? null,
          points: ackResult.points,
        },
      ],
    })
  },

  setLeaderboard: (leaderboard, myPlayerId) => {
    const myEntry = leaderboard.find((e) => String(e.playerId) === String(myPlayerId))
    set({ status: 'SHOW_LEADERBOARD', leaderboard, myPosition: myEntry?.position ?? null })
  },

  setFinished: (leaderboard, myPlayerId, idPartidaEstudiante) => {
    const myEntry = leaderboard.find((e) => String(e.playerId) === String(myPlayerId))
    set({ status: 'FINISHED', leaderboard, myPosition: myEntry?.position ?? null, idPartidaEstudiante })
  },

  setStatus: (status) => set({ status }),

  reset: () => set({
    status: null, codigoAcceso: null, quizTitle: null, totalPreguntas: null,
    currentQuestion: null, myAnswer: null, score: 0, leaderboard: [],
    myPosition: null, answerHistory: [], idPartidaEstudiante: null,
  }),
}))
