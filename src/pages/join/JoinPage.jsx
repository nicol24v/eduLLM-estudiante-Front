import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Typography } from '@mui/material'
import { useAuthStore } from '../../stores/useAuthStore'
import { gameService } from '../../services/gameService'
import ScienceBackground from '../../components/ScienceBackground'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'

export default function JoinPage() {
  const navigate = useNavigate()
  const { setPreJoinData } = useAuthStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleJoin = async (e) => {
    e.preventDefault()
    setError('')
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return

    setLoading(true)
    try {
      const data = await gameService.preJoin(trimmed)
      setPreJoinData(data.id_estudiante_materia, data.nombre, data.apellido_paterno)
      navigate(`/game/${trimmed}`)
    } catch (err) {
      const status = err.response?.status
      if (status === 404) setError('Sala no encontrada. Verifica el código.')
      else if (status === 400) setError('La prueba ya comenzó. No puedes unirte.')
      else if (status === 403) setError('No estás matriculado en la materia de este cuestionario.')
      else setError('Error al unirse. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1565c0 0%, #7c3aed 55%, #a855f7 100%)',
        overflow: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
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
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'white',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          Ingresa el código de sala
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: { xs: 2, sm: 4 } }}>
          Tu profesor te compartió un código de 6 caracteres
        </Typography>

        <Box
          component="form"
          onSubmit={handleJoin}
          sx={{
            background: { xs: 'rgba(255,255,255,0.88)', md: 'rgba(255,255,255,0.12)' },
            backdropFilter: { xs: 'none', md: 'blur(16px)' },
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '20px',
            px: { xs: 2, sm: 4, md: 5 },
            py: { xs: 3, sm: 4, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {error && (
            <Box
              sx={{
                bgcolor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: 2,
                px: 2,
                py: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: { xs: '#b91c1c', md: '#fca5a5' } }}
              >
                {error}
              </Typography>
            </Box>
          )}

          <TextField
            placeholder="ABC123"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            aria-label="Código de sala"
            slotProps={{
              htmlInput: { maxLength: 6 },
            }}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                background: { xs: 'rgba(255,255,255,0.9)', md: 'rgba(255,255,255,0.15)' },
                color: { xs: 'text.primary', md: 'white' },
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.6)' },
                '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.8)' },
              },
              '& input': {
                textAlign: 'center',
                fontWeight: 700,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                letterSpacing: { xs: '0.35rem', sm: '0.5rem', md: '0.6rem' },
              },
              '& input::placeholder': {
                color: { xs: 'rgba(0,0,0,0.3)', md: 'rgba(255,255,255,0.4)' },
                letterSpacing: { xs: '0.35rem', sm: '0.5rem', md: '0.6rem' },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            startIcon={<SportsEsportsIcon />}
            disabled={loading || code.trim().length < 4}
            sx={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed, #1565c0)',
              borderRadius: '12px',
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 700,
              boxShadow: '0 4px 24px rgba(124, 58, 237, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover:not(:disabled)': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 32px rgba(124, 58, 237, 0.55)',
                background: 'linear-gradient(135deg, #a855f7, #7c3aed, #1565c0)',
              },
              '&.Mui-disabled': {
                background: { xs: 'rgba(0,0,0,0.08)', md: 'rgba(255,255,255,0.12)' },
                color: { xs: 'rgba(0,0,0,0.3)', md: 'rgba(255,255,255,0.35)' },
              },
            }}
          >
            {loading ? 'Buscando sala...' : 'Unirse'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
