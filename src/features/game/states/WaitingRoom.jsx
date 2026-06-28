import { Box, Typography, Chip, Divider, CircularProgress } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import ScienceBackground from '../../../components/ScienceBackground'

export default function WaitingRoom({ players = [], code }) {
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
          variant="h5"
          sx={{
            fontWeight: 700,
            color: 'white',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            mb: 2,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          Sala:{' '}
          <Chip
            label={code}
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(8px)',
              verticalAlign: 'middle',
            }}
          />
        </Typography>

        <Box
          sx={{
            background: { xs: 'rgba(255,255,255,0.88)', md: 'rgba(255,255,255,0.12)' },
            backdropFilter: { xs: 'none', md: 'blur(16px)' },
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '20px',
            px: { xs: 3, sm: 5 },
            py: { xs: 3, sm: 4 },
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: { xs: 'text.secondary', md: 'rgba(255,255,255,0.85)' }, mb: 3 }}
          >
            Esperando que el profesor inicie la prueba...
          </Typography>

          <CircularProgress
            sx={{ color: { xs: 'primary.main', md: 'white' }, mb: 3 }}
          />

          <Divider sx={{ borderColor: { xs: 'divider', md: 'rgba(255,255,255,0.2)' }, mb: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, justifyContent: 'center' }}>
            <PeopleIcon sx={{ color: { xs: 'primary.main', md: 'rgba(255,255,255,0.9)' } }} />
            <Typography
              fontWeight={600}
              sx={{ color: { xs: 'text.primary', md: 'white' } }}
            >
              Participantes ({players.length})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
            {players.map((p) => (
              <Chip
                key={p.playerId}
                label={p.nickname}
                sx={{
                  background: { xs: 'rgba(0,0,0,0.06)', md: 'rgba(255,255,255,0.18)' },
                  color: { xs: 'text.primary', md: 'white' },
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
