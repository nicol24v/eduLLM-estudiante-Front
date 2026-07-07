import { useEffect, useState } from 'react'
import {
  Box, Button, Typography, Grid, Card,
  CardActionArea, CardContent, CircularProgress,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import BarChartIcon from '@mui/icons-material/BarChart'
import { historyService } from '../../services/historyService'
import { gameService } from '../../services/gameService'
import ScienceBackground from '../../components/ScienceBackground'
import RobotFrases from '../../components/RobotFrases'

export default function HomePage() {
  const navigate = useNavigate()
  const nombre = useAuthStore((s) => s.nombre)
  const [stats, setStats] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [frases, setFrases] = useState([])

  useEffect(() => {
    gameService.getFrases()
      .then((res) => setFrases(Array.isArray(res) ? res : (res?.frases ?? [])))
      .catch(() => {})
  }, [])

  useEffect(() => {
    historyService.getStats()
      .then(setStats)
      .catch(() => setStats([]))
      .finally(() => setLoadingStats(false))
  }, [])

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1565c0 0%, #7c3aed 55%, #a855f7 100%)',
        overflow: 'hidden',
        px: 2,
        py: 6,
      }}
    >
      <ScienceBackground />

      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: 560,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: 'white',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
          }}
        >
          {nombre ? `¡Hola, ${nombre}!` : '¡Bienvenido!'}
        </Typography>

        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 5 }}>
          Ingresa el código de sala que te compartió tu profesor para unirte a una prueba.
        </Typography>

        {/* Card glassmorphism — desktop: blur, mobile: opaco */}
        <Box
          sx={{
            background: { xs: 'rgba(255,255,255,0.88)', md: 'rgba(255,255,255,0.12)' },
            backdropFilter: { xs: 'none', md: 'blur(16px)' },
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '20px',
            px: { xs: 3, sm: 5 },
            py: { xs: 3, sm: 4 },
            mb: 5,
          }}
        >
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<SportsEsportsIcon />}
            onClick={() => navigate('/join')}
            sx={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed, #1565c0)',
              borderRadius: '12px',
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: '0 4px 24px rgba(124, 58, 237, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 32px rgba(124, 58, 237, 0.55)',
                background: 'linear-gradient(135deg, #a855f7, #7c3aed, #1565c0)',
              },
            }}
          >
            Unirse a sala
          </Button>
        </Box>

        {loadingStats ? (
          <CircularProgress size={28} sx={{ color: 'white' }} />
        ) : stats.length > 0 ? (
          <Box sx={{ textAlign: 'left' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BarChartIcon sx={{ color: 'rgba(255,255,255,0.9)', fontSize: 'small' }} />
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'white' }}>
                Mi promedio por materia
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {stats.map((s) => (
                <Grid item xs={12} sm={6} key={s.id_estudiante_materia}>
                  <Card
                    elevation={0}
                    sx={{
                      background: { xs: 'rgba(255,255,255,0.85)', md: 'rgba(255,255,255,0.12)' },
                      backdropFilter: { xs: 'none', md: 'blur(12px)' },
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 3,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)' },
                    }}
                  >
                    <CardActionArea onClick={() => navigate(`/history?materiaId=${s.materia.id_materia}`)}>
                      <CardContent>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ color: { xs: 'text.secondary', md: 'rgba(255,255,255,0.7)' } }}
                        >
                          {s.materia.nombre}
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          sx={{ color: { xs: 'primary.main', md: 'white' }, mt: 0.5 }}
                        >
                          {s.promedio_puntaje}
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: { xs: 'text.secondary', md: 'rgba(255,255,255,0.6)' }, ml: 0.5 }}
                          >
                            pts
                          </Typography>
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: { xs: 'text.secondary', md: 'rgba(255,255,255,0.6)' } }}
                        >
                          {s.total_partidas} {s.total_partidas === 1 ? 'cuestionario' : 'cuestionarios'}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : null}
      </Box>
      <RobotFrases frases={frases} />
    </Box>
  )
}
