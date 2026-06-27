import { Box, Typography, Paper } from '@mui/material'
import Timer from '../components/Timer'
import QuestionMedia from '../components/QuestionMedia'
import AnswerButton from '../components/AnswerButton'
import ScoreDisplay from '../components/ScoreDisplay'
import { useGameStore } from '../../../stores/useGameStore'

export default function Question() {
  const { currentQuestion, score } = useGameStore()
  if (!currentQuestion) return null

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Pregunta {(currentQuestion.index ?? 0) + 1} de {currentQuestion.total ?? '?'}
        </Typography>
        <ScoreDisplay score={score} />
      </Box>
      <Timer totalSeconds={currentQuestion.tiempo_limite} />
      <Paper elevation={2} sx={{ p: 3, mt: 2, mb: 3, borderRadius: 3 }}>
        <QuestionMedia url={currentQuestion.image_url} />
        <Typography variant="h5" fontWeight={700} textAlign="center">
          {currentQuestion.texto}
        </Typography>
      </Paper>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
        {currentQuestion.opciones.map((op, i) => (
          <AnswerButton key={op.id_opcion} index={i} label={op.texto} disabled />
        ))}
      </Box>
      <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
        Espera... las respuestas se habilitarán en un momento
      </Typography>
    </Box>
  )
}
