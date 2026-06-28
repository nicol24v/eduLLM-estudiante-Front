import { Box, Typography, Alert, CircularProgress } from '@mui/material'
import { keyframes } from '@emotion/react'
import ScoreDisplay from '../components/ScoreDisplay'
import { useGameStore } from '../../../stores/useGameStore'
import ScienceBackground from '../../../components/ScienceBackground'

const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.5); }
  60%  { transform: scale(1.15); }
  100% { opacity: 1; transform: scale(1); }
`

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`

export default function PostAnswer() {
  const { myAnswer, score, currentQuestion } = useGameStore()
  if (!myAnswer) return null

  const { isCorrect, points, retroalimentacion } = myAnswer
  const selectedOption = currentQuestion?.opciones?.find((o) => o.id_opcion === myAnswer.opcionId)

  const cardBg = isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'
  const cardBorder = isCorrect
    ? '1px solid rgba(34, 197, 94, 0.35)'
    : '1px solid rgba(239, 68, 68, 0.35)'

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #2e1065 100%)',
        overflow: 'hidden',
        px: 2,
      }}
    >
      <ScienceBackground />
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: 480,
          textAlign: 'center',
        }}
      >
      <Box
        sx={{
          background: cardBg,
          backdropFilter: 'blur(16px)',
          border: cardBorder,
          borderRadius: '20px',
          px: { xs: 3, sm: 5 },
          py: { xs: 4, sm: 5 },
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: '4rem',
            lineHeight: 1,
            mb: 0.5,
            display: 'block',
            animation: `${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
          }}
        >
          {isCorrect ? '🥳' : '😭'}
        </Typography>

        <Typography
          sx={{
            fontSize: '2rem',
            lineHeight: 1,
            mb: 2,
            display: 'block',
            animation: `${fadeSlideUp} 0.4s ease-out 0.2s both`,
          }}
        >
          {isCorrect ? '✨' : '💔'}
        </Typography>

        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            color: 'white',
            mb: 1,
            animation: `${fadeSlideUp} 0.4s ease-out 0.1s both`,
          }}
        >
          {isCorrect ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta'}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            mb: 2,
            animation: `${fadeSlideUp} 0.4s ease-out 0.2s both`,
          }}
        >
          Tu respuesta: <strong>{selectedOption?.texto ?? '—'}</strong>
        </Typography>

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            color: isCorrect ? '#4ade80' : 'rgba(255,255,255,0.5)',
            mb: 2,
            animation: `${fadeSlideUp} 0.4s ease-out 0.3s both`,
          }}
        >
          {isCorrect ? `+${points} pts` : '+0 pts'}
        </Typography>

        {retroalimentacion && (
          <Box sx={{ animation: `${fadeSlideUp} 0.4s ease-out 0.4s both` }}>
            <Alert severity="info" sx={{ textAlign: 'left', mt: 1 }}>
              <strong>Explicación:</strong> {retroalimentacion}
            </Alert>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
        <ScoreDisplay score={score} />
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Esperando al profesor...
        </Typography>
        <CircularProgress size={20} sx={{ color: 'white' }} />
      </Box>
      </Box>
    </Box>
  )
}
