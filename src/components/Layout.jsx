import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import ScienceIcon from '@mui/icons-material/Science'
import BarChartIcon from '@mui/icons-material/BarChart'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useGameStore } from '../stores/useGameStore'

const GATEWAY = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const NAV_ITEMS = [
  { label: 'Historial', path: '/history', icon: <BarChartIcon fontSize="small" />, color: '#1e40af' },
  // Para añadir más ítems: { label: 'Nombre', path: '/ruta', icon: <Icon />, color: '#6d28d9' }
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const { nombre, apellidoPaterno, logout } = useAuthStore()
  const reset = useGameStore((s) => s.reset)

  const handleLogout = async () => {
    reset()
    logout()
    try {
      await axios.post(`${GATEWAY}/api/auth/logout`, {}, { withCredentials: true })
    } catch {}
    window.location.href = `${GATEWAY}/login`
  }

  const displayName = [nombre, apellidoPaterno].filter(Boolean).join(' ')

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'rgba(10, 14, 39, 0.88)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mr: 3 }}
            onClick={() => navigate('/')}
          >
            <ScienceIcon sx={{ color: '#a855f7' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              EduQuiz
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                  bgcolor: item.color,
                  color: 'white',
                  borderRadius: '24px',
                  px: { xs: 1.5, sm: 2 },
                  py: 0.75,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  '& .MuiButton-startIcon': { mr: { xs: 0, sm: 0.5 } },
                  '& .nav-label': { display: { xs: 'none', sm: 'inline' } },
                  '&:hover': { bgcolor: item.color, filter: 'brightness(1.2)' },
                  transition: 'filter 0.2s',
                  minWidth: { xs: 40, sm: 'auto' },
                }}
              >
                <span className="nav-label">{item.label}</span>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {displayName && (
            <Typography
              variant="body2"
              sx={{ mr: 2, color: 'rgba(255,255,255,0.7)', display: { xs: 'none', sm: 'block' } }}
            >
              {displayName}
            </Typography>
          )}

          <Button
            onClick={handleLogout}
            variant="outlined"
            size="small"
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.4)',
              borderRadius: '20px',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  )
}
