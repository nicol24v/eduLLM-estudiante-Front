import { Box, Typography } from '@mui/material'
import { keyframes } from '@emotion/react'
import ScienceBackground from '../../../components/ScienceBackground'
import cuteEarth from '../../../assets/illustrations/cute-earth.svg'

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%       { transform: translateY(-14px) rotate(2deg); }
`

const pulse = keyframes`
  0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
  40%           { opacity: 1;   transform: scale(1.2); }
`

const PARTICLES = [
  { top: '12%', left: '8%',   size: 8,  color: 'rgba(168,85,247,0.6)',   duration: '3.1s', delay: '0s'   },
  { top: '25%', right: '10%', size: 6,  color: 'rgba(255,255,255,0.4)',  duration: '2.8s', delay: '0.7s' },
  { top: '70%', left: '15%',  size: 10, color: 'rgba(255,255,255,0.35)', duration: '4.2s', delay: '0.3s' },
  { top: '60%', right: '8%',  size: 7,  color: 'rgba(168,85,247,0.5)',   duration: '3.6s', delay: '1.1s' },
]

export default function GameStart({ quizTitle, totalPreguntas }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1565c0 0%, #7c3aed 55%, #a855f7 100%)',
        overflow: 'hidden',
        px: 2,
      }}
    >
      <ScienceBackground />

      {PARTICLES.map((p, i) => (
        <Box
          key={i}
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            right: p.right,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            animation: `${float} ${p.duration} ease-in-out ${p.delay} infinite`,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      ))}

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
        <Box
          sx={{
            background: { xs: 'rgba(255,255,255,0.88)', md: 'rgba(255,255,255,0.12)' },
            backdropFilter: { xs: 'none', md: 'blur(16px)' },
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '20px',
            px: { xs: 3, sm: 5 },
            py: { xs: 4, sm: 5 },
          }}
        >
          <Typography
            sx={{
              fontSize: '3rem',
              lineHeight: 1,
              mb: 2,
              display: 'block',
              animation: `${fadeSlideUp} 0.5s ease-out both`,
            }}
          >
            🚀
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              color: { xs: 'primary.main', md: 'white' },
              textShadow: { md: '0 2px 12px rgba(0,0,0,0.3)' },
              mb: 1.5,
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              animation: `${fadeSlideUp} 0.5s ease-out 0.1s both`,
            }}
          >
            ¡La prueba comienza!
          </Typography>

          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              color: { xs: 'text.primary', md: 'rgba(255,255,255,0.95)' },
              mb: 1,
              fontSize: { xs: '1.1rem', sm: '1.35rem' },
              animation: `${fadeSlideUp} 0.5s ease-out 0.2s both`,
            }}
          >
            {quizTitle}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: { xs: 'text.secondary', md: 'rgba(255,255,255,0.75)' },
              mb: 3,
              animation: `${fadeSlideUp} 0.5s ease-out 0.3s both`,
            }}
          >
            {totalPreguntas} preguntas · ¡Prepárate!
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              animation: `${fadeSlideUp} 0.5s ease-out 0.4s both`,
            }}
          >
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                aria-hidden="true"
                sx={{
                  fontSize: '1.5rem',
                  color: { xs: 'primary.main', md: 'rgba(255,255,255,0.9)' },
                  animation: `${pulse} 1.2s ease-in-out ${i * 0.16}s infinite`,
                  lineHeight: 1,
                }}
              >
                ●
              </Box>
            ))}
          </Box>
        </Box>

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
              width: 100,
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
