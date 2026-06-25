import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box, Typography, List, ListItem, ListItemButton,
  Chip, Divider, CircularProgress, Alert, Button,
} from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { historyService } from '../../services/historyService'

export default function HistoryListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const materiaId = searchParams.get('materiaId')

  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    historyService.getList(materiaId)
      .then(setHistorial)
      .catch(() => setError('No se pudo cargar el historial.'))
      .finally(() => setLoading(false))
  }, [materiaId])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>

  const materiaNombre = historial[0]?.tbl_m_estudiante_materia?.tbl_m_materia?.nombre

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        {materiaId && (
          <Button
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mr: 1 }}
          >
            Inicio
          </Button>
        )}
        <HistoryIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>
          {materiaNombre ? `Historial — ${materiaNombre}` : 'Mi historial'}
        </Typography>
      </Box>

      {historial.length === 0 ? (
        <Typography color="text.secondary">No tienes cuestionarios registrados aún.</Typography>
      ) : (
        <List disablePadding>
          {historial.map((p, i) => {
            const materia = p.tbl_m_estudiante_materia?.tbl_m_materia?.nombre ?? '—'
            const titulo = p.tbl_t_partida?.tbl_t_prueba?.titulo ?? 'Cuestionario'
            const totalPreguntas = p.tbl_t_partida?.tbl_t_prueba?._count?.tbl_t_pregunta ?? 0
            const fecha = new Date(p.fecha_creacion).toLocaleDateString('es-EC', {
              day: '2-digit', month: 'short', year: 'numeric',
            })
            return (
              <Box key={p.id_partida_estudiante}>
                {i > 0 && <Divider />}
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => navigate(`/history/${p.id_partida_estudiante}`)}
                    sx={{ py: 2 }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={600}>{titulo}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {materia} · {fecha}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip label={`${p.puntaje_total ?? 0} pts`} color="primary" size="small" />
                      <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                        {p.respuestas_correctas ?? 0}/{totalPreguntas} correctas
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
              </Box>
            )
          })}
        </List>
      )}
    </Box>
  )
}
