import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Paper, Chip, Alert,
  Button, Stack, CircularProgress,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { historyService } from '../../services/historyService'

export default function HistoryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [detalle, setDetalle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    historyService.getDetail(id)
      .then(setDetalle)
      .catch(() => navigate('/grades', { replace: true }))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
  if (!detalle) return null

  const { partida, respuestas } = detalle
  const titulo = partida.tbl_t_partida?.tbl_t_prueba?.titulo ?? 'Cuestionario'
  const materia = partida.tbl_m_estudiante_materia?.tbl_m_materia?.nombre ?? '—'
  const materiaId = partida.tbl_m_estudiante_materia?.tbl_m_materia?.id_materia
  const totalPreguntas = partida.tbl_t_partida?.tbl_t_prueba?._count?.tbl_t_pregunta ?? respuestas.length

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/grades${materiaId ? `?materiaId=${materiaId}` : ''}`)}
        sx={{ mb: 2 }}
      >
        Volver a calificaciones
      </Button>

      <Typography variant="h5" fontWeight={700} mb={0.5}>{titulo}</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>{materia}</Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
        <Chip label={`${partida.puntaje_total ?? 0} pts`} color="primary" />
        <Chip
          label={`${partida.respuestas_correctas ?? 0}/${totalPreguntas} correctas`}
          color="success"
          variant="outlined"
        />
      </Box>

      <Stack spacing={2}>
        {respuestas.map((r, i) => {
          const opciones = r.tbl_t_pregunta?.tbl_t_opcion ?? []
          const correcta = opciones.find((o) => o.es_correcta)
          const seleccionada = r.tbl_t_opcion
          const isCorrect = (r.puntaje_obtenido ?? 0) > 0
          return (
            <Paper
              key={r.id_respuesta}
              elevation={1}
              sx={{ p: 2, borderLeft: `4px solid ${isCorrect ? '#43a047' : '#e53935'}` }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {isCorrect
                  ? <CheckCircleIcon color="success" fontSize="small" />
                  : <CancelIcon color="error" fontSize="small" />}
                <Typography fontWeight={600} variant="body2">Pregunta {i + 1}</Typography>
                <Chip
                  size="small"
                  label={`${r.puntaje_obtenido ?? 0} pts`}
                  color={isCorrect ? 'success' : 'default'}
                />
              </Box>

              <Typography variant="body1" mb={1}>{r.tbl_t_pregunta?.texto}</Typography>

              <Typography variant="body2">
                Tu respuesta: <strong>{seleccionada?.texto ?? '—'}</strong>
                {!isCorrect && correcta && (
                  <> · Correcta: <strong>{correcta.texto}</strong></>
                )}
              </Typography>

              {!isCorrect && correcta?.retroalimentacion && (
                <Alert severity="info" sx={{ mt: 1 }}>{correcta.retroalimentacion}</Alert>
              )}
            </Paper>
          )
        })}
      </Stack>
    </Box>
  )
}
