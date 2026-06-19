import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useGameStore } from '../stores/useGameStore'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const { nombre, apellidoPaterno, logout } = useAuthStore()
  const reset = useGameStore((s) => s.reset)

  const handleLogout = () => {
    reset()
    logout()
    navigate('/login', { replace: true })
  }

  const displayName = [nombre, apellidoPaterno].filter(Boolean).join(' ')

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            EduQuiz
          </Typography>
          {displayName && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              {displayName}
            </Typography>
          )}
          <Button color="inherit" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  )
}
