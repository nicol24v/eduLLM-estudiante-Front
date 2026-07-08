import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import { keyframes } from '@emotion/react'
import { useAuthStore } from '../../stores/useAuthStore'
import { gameService } from '../../services/gameService'
import ScienceBackground from '../../components/ScienceBackground'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import cuteEarth from '../../assets/illustrations/cute-earth.svg'

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%       { transform: translateY(-14px) rotate(2deg); }
`

const AtomSvg = ({ sx }) => (
  <Box
    component="svg"
    viewBox="0 0 300 300"
    aria-hidden="true"
    sx={{
      pointerEvents: 'none',
      display: { xs: 'none', sm: 'block' },
      ...sx,
    }}
  >
    <circle cx="150" cy="150" r="10" fill="white" opacity="0.9" />
    <ellipse cx="150" cy="150" rx="120" ry="45" fill="none" stroke="white" strokeWidth="2" opacity="0.65" />
    <ellipse cx="150" cy="150" rx="120" ry="45" fill="none" stroke="white" strokeWidth="2" opacity="0.65" transform="rotate(60 150 150)" />
    <ellipse cx="150" cy="150" rx="120" ry="45" fill="none" stroke="white" strokeWidth="2" opacity="0.65" transform="rotate(120 150 150)" />
  </Box>
)

export default function JoinPage() {
  const navigate = useNavigate()
  const { setPreJoinData } = useAuthStore()
  const [chars, setChars] = useState(Array(6).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

  const code = chars.join('')
  const isComplete = code.length === 6

  const handleCharChange = (index, value) => {
    const char = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(-1)
    const newChars = [...chars]
    newChars[index] = char
    setChars(newChars)
    if (char && index < 5) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !chars[index] && index > 0) {
      const newChars = [...chars]
      newChars[index - 1] = ''
      setChars(newChars)
      inputRefs[index - 1].current?.focus()
      e.preventDefault()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus()
      e.preventDefault()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs[index + 1].current?.focus()
      e.preventDefault()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^A-Za-z0-9]/g, '')
      .toUpperCase()
      .slice(0, 6)
    const newChars = Array(6).fill('')
    for (let i = 0; i < pasted.length; i++) newChars[i] = pasted[i]
    setChars(newChars)
    inputRefs[Math.min(pasted.length, 5)].current?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isComplete || loading) return
    setError('')
    setLoading(true)
    try {
      const data = await gameService.preJoin(code)
      setPreJoinData(data.id_estudiante_materia, data.nombre, data.apellido_paterno)
      navigate(`/game/${code}`)
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
        overflow: 'clip',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <ScienceBackground />

      {/* Átomo 2 — esquina superior izquierda */}
      <AtomSvg sx={{
        position: 'absolute', top: { sm: -60, md: -70 }, left: { sm: -60, md: -70 },
        width: { sm: 200, md: 280 }, height: { sm: 200, md: 280 },
        opacity: 0.7, zIndex: 1,
        filter: 'drop-shadow(0 0 24px rgba(168,85,247,0.5))',
      }} />

      {/* Átomo 3 — centro izquierda (espejo del átomo de ScienceBackground) */}
      <AtomSvg sx={{
        position: 'absolute', top: '50%', left: { sm: -60, md: -70 },
        transform: 'translateY(-50%)',
        width: { sm: 200, md: 280 }, height: { sm: 200, md: 280 },
        opacity: 0.7, zIndex: 1,
        filter: 'drop-shadow(0 0 24px rgba(168,85,247,0.5))',
      }} />

      {/* Átomo 5 — esquina inferior izquierda */}
      <AtomSvg sx={{
        position: 'absolute', bottom: { sm: -60, md: -70 }, left: { sm: -60, md: -70 },
        width: { sm: 200, md: 280 }, height: { sm: 200, md: 280 },
        opacity: 0.7, zIndex: 1,
        filter: 'drop-shadow(0 0 24px rgba(168,85,247,0.5))',
      }} />

      {/* Átomo 6 — esquina superior derecha */}
      <AtomSvg sx={{
        position: 'absolute', top: { sm: -60, md: -70 }, right: { sm: -60, md: -70 },
        width: { sm: 200, md: 280 }, height: { sm: 200, md: 280 },
        opacity: 0.7, zIndex: 1,
        filter: 'drop-shadow(0 0 24px rgba(168,85,247,0.5))',
      }} />

      {/* Átomo 7 — esquina inferior derecha */}
      <AtomSvg sx={{
        position: 'absolute', bottom: { sm: -60, md: -70 }, right: { sm: -60, md: -70 },
        width: { sm: 200, md: 280 }, height: { sm: 200, md: 280 },
        opacity: 0.7, zIndex: 1,
        filter: 'drop-shadow(0 0 24px rgba(168,85,247,0.5))',
      }} />

      {/* Tierra kawaii flotante — abajo izquierda */}
      <Box
        component="img"
        src={cuteEarth}
        alt=""
        aria-hidden="true"
        sx={{
          position: 'absolute',
          bottom: { sm: -18, md: 0 },
          left: { sm: -22, md: 6 },
          width: { sm: 148, md: 188 },
          display: { xs: 'none', sm: 'block' },
          zIndex: 1,
          animation: `${float} 3.4s ease-in-out infinite`,
          filter: 'drop-shadow(0 8px 22px rgba(0,0,0,0.22))',
          pointerEvents: 'none',
        }}
      />

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
            animation: `${fadeSlideUp} 0.5s ease-out both`,
          }}
        >
          Ingresa el código de sala
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.75)',
            mb: { xs: 2.5, sm: 4 },
            animation: `${fadeSlideUp} 0.5s ease-out 0.1s both`,
          }}
        >
          Tu profesor te compartió un código de 6 caracteres
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            background: { xs: 'rgba(255,255,255,0.88)', md: 'rgba(255,255,255,0.12)' },
            backdropFilter: { xs: 'none', md: 'blur(16px)' },
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '20px',
            px: { xs: 2.5, sm: 4, md: 5 },
            py: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            animation: `${fadeSlideUp} 0.5s ease-out 0.2s both`,
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

          {/* 6 cajitas OTP */}
          <Box sx={{ display: 'flex', gap: { xs: '6px', sm: '10px' }, justifyContent: 'center' }}>
            {chars.map((char, i) => (
              <Box
                key={i}
                component="input"
                ref={inputRefs[i]}
                value={char}
                maxLength={1}
                autoComplete="off"
                inputMode="text"
                onChange={(e) => handleCharChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                sx={{
                  width: { xs: '42px', sm: '56px' },
                  height: { xs: '54px', sm: '68px' },
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  fontWeight: 700,
                  textAlign: 'center',
                  fontFamily: 'inherit',
                  letterSpacing: 0,
                  caretColor: 'transparent',
                  borderRadius: '12px',
                  outline: 'none',
                  border: '2px solid',
                  borderColor: char
                    ? 'rgba(168,85,247,0.8)'
                    : 'rgba(255,255,255,0.25)',
                  background: char
                    ? { xs: 'rgba(124,58,237,0.08)', md: 'rgba(168,85,247,0.2)' }
                    : { xs: 'rgba(255,255,255,0.75)', md: 'rgba(255,255,255,0.08)' },
                  color: { xs: char ? '#6d28d9' : '#374151', md: 'white' },
                  boxShadow: char ? '0 0 14px rgba(168,85,247,0.35)' : 'none',
                  transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                  '&:focus': {
                    borderColor: 'rgba(255,255,255,0.85)',
                    boxShadow: '0 0 0 3px rgba(255,255,255,0.18)',
                    background: { xs: 'rgba(255,255,255,0.95)', md: 'rgba(255,255,255,0.16)' },
                  },
                }}
              />
            ))}
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            startIcon={<SportsEsportsIcon />}
            disabled={loading || !isComplete}
            sx={{
              background: isComplete
                ? 'linear-gradient(135deg, #a855f7, #7c3aed, #1565c0)'
                : 'transparent',
              borderRadius: '12px',
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 700,
              boxShadow: isComplete ? '0 4px 24px rgba(124,58,237,0.45)' : 'none',
              transition: 'all 0.3s ease',
              '&:hover:not(:disabled)': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 32px rgba(124,58,237,0.55)',
                background: 'linear-gradient(135deg, #a855f7, #7c3aed, #1565c0)',
              },
              '&.Mui-disabled': {
                background: { xs: 'rgba(0,0,0,0.06)', md: 'rgba(255,255,255,0.08)' },
                color: { xs: 'rgba(0,0,0,0.28)', md: 'rgba(255,255,255,0.28)' },
              },
            }}
          >
            {loading ? 'Buscando sala...' : 'Unirse'}
          </Button>
        </Box>

        {/* Tierra kawaii — mobile: debajo del form, centrada */}
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            justifyContent: 'center',
            mt: 3,
          }}
        >
          <Box
            component="img"
            src={cuteEarth}
            alt=""
            aria-hidden="true"
            sx={{
              width: 120,
              animation: `${float} 3.4s ease-in-out infinite`,
              filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.2))',
              pointerEvents: 'none',
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
