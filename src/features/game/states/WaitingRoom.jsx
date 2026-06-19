import { Box, Typography, Chip, Divider, CircularProgress } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'

export default function WaitingRoom({ players = [], code }) {
  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Sala: <Chip label={code} color="primary" sx={{ fontWeight: 700, fontSize: '1.2rem' }} />
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Esperando que el profesor inicie la prueba...
      </Typography>
      <CircularProgress sx={{ mb: 3 }} />
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'center' }}>
        <PeopleIcon color="primary" />
        <Typography fontWeight={600}>Participantes ({players.length})</Typography>
      </Box>
      {players.map((p) => (
        <Chip key={p.playerId} label={p.nickname} sx={{ m: 0.5 }} />
      ))}
    </Box>
  )
}
