import { Box, Typography, Button, Paper, Chip, Alert, Stack } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../../stores/useGameStore'
import { GATEWAY } from '../../../config'

export default function FinalResults() {
  const navigate = useNavigate()
  const { score, myPosition, answerHistory, quizTitle, idPartidaEstudiante, reset } = useGameStore()

  const handleHome = () => {
    reset()
    navigate('/')
  }

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <EmojiEventsIcon sx={{ fontSize: 64, color: '#f9a825' }} />
        <Typography variant="h4" fontWeight={700} mt={1}>{quizTitle}</Typography>
        <Typography variant="h2" fontWeight={700} color="primary" mt={1}>{score} pts</Typography>
        {myPosition && (
          <Chip label={`Posición #${myPosition}`} color="success" sx={{ mt: 1, fontWeight: 700, fontSize: '1rem' }} />
        )}
      </Box>

      <Typography variant="h6" fontWeight={700} mb={2}>Mi desempeño</Typography>

      <Stack spacing={2}>
        {answerHistory.map((entry, i) => {
          const selected = entry.opciones.find((o) => o.id_opcion === entry.selectedOpcionId)
          const correct = entry.opciones.find((o) => o.id_opcion === entry.correctOpcionId)
          return (
            <Paper key={i} elevation={1} sx={{ p: 2, borderRadius: 2, borderLeft: `4px solid ${entry.isCorrect ? '#43a047' : '#e53935'}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {entry.isCorrect
                  ? <CheckCircleIcon color="success" fontSize="small" />
                  : <CancelIcon color="error" fontSize="small" />}
                <Typography fontWeight={600} variant="body2">Pregunta {i + 1}</Typography>
                <Chip size="small" label={`+${entry.points} pts`} color={entry.isCorrect ? 'success' : 'default'} />
              </Box>
              <Typography variant="body1" mb={1}>{entry.texto}</Typography>
              <Typography variant="body2">
                Tu respuesta: <strong>{selected?.texto ?? '—'}</strong>
                {!entry.isCorrect && correct && (
                  <> · Correcta: <strong>{correct.texto}</strong></>
                )}
              </Typography>
              {entry.retroalimentacion && (
                <Alert severity="info" sx={{ mt: 1 }}>{entry.retroalimentacion}</Alert>
              )}
            </Paper>
          )
        })}
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button variant="outlined" fullWidth onClick={() => window.location.href = `${GATEWAY}/tutor?idPartidaEstudiante=${idPartidaEstudiante}`}>
          Hablar con tu tutor virtual
        </Button>
        <Button variant="contained" fullWidth onClick={handleHome}>
          Volver al inicio
        </Button>
      </Stack>
    </Box>
  )
}
