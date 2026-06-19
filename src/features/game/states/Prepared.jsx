import { Box, Typography } from '@mui/material'

export default function Prepared() {
  return (
    <Box sx={{ textAlign: 'center', p: 6 }}>
      <Typography variant="h2" fontWeight={700} mb={2}>⏳</Typography>
      <Typography variant="h4" fontWeight={700}>Prepárate...</Typography>
      <Typography variant="body1" color="text.secondary" mt={2}>
        La siguiente pregunta está por comenzar
      </Typography>
    </Box>
  )
}
