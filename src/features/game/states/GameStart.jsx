import { Box, Typography, CircularProgress } from '@mui/material'

export default function GameStart({ quizTitle, totalPreguntas }) {
  return (
    <Box sx={{ textAlign: 'center', p: 6 }}>
      <Typography variant="h3" fontWeight={700} mb={2} color="primary">
        ¡La prueba comienza!
      </Typography>
      <Typography variant="h5" mb={1}>{quizTitle}</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        {totalPreguntas} preguntas · ¡Prepárate!
      </Typography>
      <CircularProgress size={60} />
    </Box>
  )
}
