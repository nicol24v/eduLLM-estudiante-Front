import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Alert, Chip, IconButton,
} from '@mui/material'
import GradeIcon from '@mui/icons-material/Grade'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { historyService } from '../../services/historyService'
import { useAuthStore } from '../../stores/useAuthStore'

function calcNota(correctas, total) {
  if (!total) return 0
  return Math.round((correctas / total) * 10 * 10) / 10
}

function notaColor(nota) {
  if (nota >= 7) return 'success'
  if (nota >= 5) return 'warning'
  return 'error'
}

export default function GradesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const materiaId = searchParams.get('materiaId')
  const nombre = useAuthStore((s) => s.nombre)
  const apellidoPaterno = useAuthStore((s) => s.apellidoPaterno)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    historyService.getList(materiaId)
      .then((historial) => {
        const list = historial
          .map((p) => {
            const prueba = p.tbl_t_partida?.tbl_t_prueba
            const total = prueba?._count?.tbl_t_pregunta ?? 0
            const correctas = p.respuestas_correctas ?? 0
            return {
              id: p.id_partida_estudiante,
              titulo: prueba?.titulo ?? 'Cuestionario',
              nota: calcNota(correctas, total),
              fecha: p.fecha_creacion,
            }
          })
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        setQuizzes(list)
      })
      .catch(() => setError('No se pudo cargar las calificaciones.'))
      .finally(() => setLoading(false))
  }, [materiaId])

  const promedio = quizzes.length
    ? Math.round((quizzes.reduce((acc, q) => acc + q.nota, 0) / quizzes.length) * 10) / 10
    : null

  const displayName = [nombre, apellidoPaterno].filter(Boolean).join(' ')

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  )

  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <GradeIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>Mis Calificaciones</Typography>
      </Box>

      {displayName && (
        <Typography variant="body2" color="text.secondary" mb={3}>
          Estudiante: <strong>{displayName}</strong>
        </Typography>
      )}

      {quizzes.length === 0 ? (
        <Typography color="text.secondary">
          No tienes cuestionarios registrados aún.
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                    Cuestionario
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }} align="center">
                    Fecha
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }} align="center">
                    Nota
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }} align="center">
                    Revisión
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quizzes.map((q) => (
                  <TableRow
                    key={q.id}
                    sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{q.titulo}</TableCell>
                    <TableCell align="center" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      {new Date(q.fecha).toLocaleDateString('es-EC', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${q.nota} / 10`}
                        color={notaColor(q.nota)}
                        size="small"
                        sx={{ fontWeight: 700, minWidth: 72 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/grades/${q.id}`)}
                        aria-label="Ver revisión"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'grey.50',
            }}
          >
            <Typography fontWeight={600} color="text.secondary">
              Promedio final
            </Typography>
            <Chip
              label={`${promedio} / 10`}
              color={notaColor(promedio)}
              sx={{ fontWeight: 700, fontSize: '1rem', px: 1 }}
            />
          </Box>
        </>
      )}
    </Box>
  )
}
