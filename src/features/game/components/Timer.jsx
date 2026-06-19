import { Box, LinearProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

export default function Timer({ totalSeconds, onExpire }) {
  const [remaining, setRemaining] = useState(totalSeconds)

  useEffect(() => {
    setRemaining(totalSeconds)
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval)
          onExpire?.()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [totalSeconds])

  const pct = (remaining / totalSeconds) * 100
  const color = pct > 50 ? 'success' : pct > 25 ? 'warning' : 'error'

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" textAlign="center" fontWeight={700} mb={0.5}>
        ⏱ {remaining}s
      </Typography>
      <LinearProgress variant="determinate" value={pct} color={color} sx={{ height: 10, borderRadius: 5 }} />
    </Box>
  )
}
