import { Box, Button, Typography, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'

export default function HomePage() {
  const navigate = useNavigate()
  const nombre = useAuthStore((s) => s.nombre)

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          {nombre ? `¡Hola, ${nombre}!` : '¡Bienvenido!'}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={6}>
          Ingresa el código de sala que te compartió tu profesor para unirte a una prueba.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<SportsEsportsIcon />}
          onClick={() => navigate('/join')}
          sx={{ px: 6, py: 2, fontSize: '1.1rem', borderRadius: 3 }}
        >
          Unirse a sala
        </Button>
      </Box>
    </Container>
  )
}
