import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ScienceIcon from '@mui/icons-material/Science'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1565c0 0%, #7c3aed 55%, #a855f7 100%)',
        px: 2,
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 420 }}>
        <SentimentDissatisfiedIcon
          sx={{ fontSize: 80, color: 'rgba(255,255,255,0.7)', mb: 2 }}
        />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            color: 'white',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            fontSize: { xs: '4rem', sm: '6rem' },
            lineHeight: 1,
            mb: 1,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
            mb: 1,
          }}
        >
          Página no encontrada
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'rgba(255,255,255,0.65)', mb: 4 }}
        >
          La página que buscas no existe o fue movida.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<ScienceIcon />}
          onClick={() => navigate('/')}
          sx={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            color: 'white',
            border: '1px solid rgba(255,255,255,0.25)',
            '&:hover': {
              background: 'rgba(255,255,255,0.25)',
            },
          }}
        >
          Volver al inicio
        </Button>
      </Box>
    </Box>
  )
}
