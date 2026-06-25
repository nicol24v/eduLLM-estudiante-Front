import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useAuthStore } from '../../stores/useAuthStore'

const GATEWAY = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const decodeJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export default function AuthCallback() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')

    if (!token) {
      window.location.href = `${GATEWAY}/login`
      return
    }

    const decoded = decodeJwt(token)
    const rol = (decoded?.rol || decoded?.role || '').replace(/^ROLE_/, '').toLowerCase()

    if (rol !== 'estudiante') {
      window.location.href = `${GATEWAY}/login`
      return
    }

    login(token, {
      id_usuario: decoded?.idUsuario || decoded?.id_usuario,
      rol: decoded?.rol || decoded?.role,
    })
    navigate('/', { replace: true })
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Procesando autenticación...
      </Typography>
    </Box>
  )
}
