import { Box, Typography, Table, TableBody, TableCell, TableRow, TableHead, Paper, Chip, CircularProgress } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useGameStore } from '../../../stores/useGameStore'
import { useAuthStore } from '../../../stores/useAuthStore'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function Leaderboard() {
  const { leaderboard, myPosition } = useGameStore()
  const idEstudianteMateria = useAuthStore((s) => s.idEstudianteMateria)

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <EmojiEventsIcon color="warning" />
        <Typography variant="h5" fontWeight={700}>Tabla de posiciones</Typography>
      </Box>
      {myPosition && (
        <Chip label={`Tu posición: #${myPosition}`} color="primary" sx={{ mb: 2, fontWeight: 700 }} />
      )}
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>#</TableCell>
              <TableCell>Jugador</TableCell>
              <TableCell align="right">Puntos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((entry) => {
              const isMe = String(entry.playerId) === String(idEstudianteMateria)
              return (
                <TableRow key={entry.playerId} sx={{ bgcolor: isMe ? '#e3f2fd' : 'inherit' }}>
                  <TableCell>{MEDALS[entry.position] || `#${entry.position}`}</TableCell>
                  <TableCell sx={{ fontWeight: isMe ? 700 : 400 }}>
                    {entry.nickname}{isMe && ' (tú)'}
                  </TableCell>
                  <TableCell align="right">{entry.score}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary" mt={1}>
          Esperando al profesor...
        </Typography>
      </Box>
    </Box>
  )
}
