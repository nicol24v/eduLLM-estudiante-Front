import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import ScoreDisplay from '../components/ScoreDisplay'
import { useGameStore } from '../../../stores/useGameStore'

export default function PostAnswer() {
  const { myAnswer, score, currentQuestion } = useGameStore()
  if (!myAnswer) return null

  const { isCorrect, points, retroalimentacion } = myAnswer
  const selectedOption = currentQuestion?.opciones?.find((o) => o.id_opcion === myAnswer.opcionId)

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 3, bgcolor: isCorrect ? '#e8f5e9' : '#ffebee' }}>
        {isCorrect ? (
          <CheckCircleIcon sx={{ fontSize: 64, color: '#43a047', mb: 1 }} />
        ) : (
          <CancelIcon sx={{ fontSize: 64, color: '#e53935', mb: 1 }} />
        )}
        <Typography variant="h5" fontWeight={700} mb={1}>
          {isCorrect ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta'}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          Tu respuesta: <strong>{selectedOption?.texto ?? '—'}</strong>
        </Typography>
        <Typography variant="h4" fontWeight={700} color={isCorrect ? 'success.main' : 'text.secondary'} mb={2}>
          {isCorrect ? `+${points} pts` : '+0 pts'}
        </Typography>
        {retroalimentacion && (
          <Alert severity="info" sx={{ textAlign: 'left', mt: 1 }}>
            <strong>Explicación:</strong> {retroalimentacion}
          </Alert>
        )}
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
        <ScoreDisplay score={score} />
        <Typography variant="body2" color="text.secondary">
          Esperando al profesor...
        </Typography>
        <CircularProgress size={20} />
      </Box>
    </Box>
  )
}
