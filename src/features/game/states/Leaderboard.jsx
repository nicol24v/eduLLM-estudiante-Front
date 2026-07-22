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
        <EmojiEventsIcon color="warning" sx={{ fontSize: 40, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.8))' }} />
        <Typography
          variant="h4"
          fontWeight={800}
          color="#fff"
          sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)' }}
        >
          Tabla de posiciones
        </Typography>
      </Box>
      {myPosition && (
        <Chip label={`Tu posición: #${myPosition}`} color="primary" sx={{ mb: 2, fontWeight: 700 }} />
      )}
      <Paper
        sx={{
          bgcolor: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(245,245,245,0.9)' }}>
              <TableCell>#</TableCell>
              <TableCell>Jugador</TableCell>
              <TableCell align="right">Puntos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((entry) => {
              const isMe = String(entry.playerId) === String(idEstudianteMateria)
              return (
                <TableRow key={entry.playerId} sx={{ bgcolor: isMe ? 'rgba(227,242,253,0.9)' : 'inherit' }}>
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
        <CircularProgress size={24} sx={{ color: '#fff' }} />
        <Typography variant="body2" mt={1} color="#fff">
          Esperando al profesor...
        </Typography>
      </Box>
    </Box>
  )
}
