import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import axios from 'axios'
import { useAuthStore } from '../../stores/useAuthStore'

const GATEWAY = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function DashboardPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(`${GATEWAY}/api/auth/verify`, { withCredentials: true })
      .then(({ data }) => {
        if (!data?.authenticated) {
          window.location.href = `${GATEWAY}/login`
          return
        }

        const rol = (data.rol || '').replace(/^ROLE_/, '').toLowerCase()
        if (rol !== 'estudiante') {
          setError('Este acceso es solo para estudiantes.')
          return
        }

        login(data.token, {
          id_usuario: data.idUsuario,
          rol: data.rol,
        })
        navigate('/join', { replace: true })
      })
      .catch(() => {
        window.location.href = `${GATEWAY}/login`
      })
  }, [])

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Verificando sesión...
      </Typography>
    </Box>
  )
}
