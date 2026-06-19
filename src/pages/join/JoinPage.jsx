import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Container } from '@mui/material'
import { useAuthStore } from '../../stores/useAuthStore'
import { gameService } from '../../services/gameService'

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
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ width: '100%', p: 2 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
              Ingresar código de sala
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleJoin}>
              <TextField
                label="Código de sala"
                fullWidth
                margin="normal"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '2rem', letterSpacing: '0.5rem' } }}
                placeholder="ABC123"
                required
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading || code.trim().length < 4}>
                {loading ? 'Buscando sala...' : 'Unirse'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
