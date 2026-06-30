import { useState, useEffect } from 'react'
import { Box, Paper, Typography } from '@mui/material'

const ROBOT_SIZE = 80

export default function RobotFrases({ frases }) {
  const [fraseActual, setFraseActual] = useState('')

  useEffect(() => {
    if (!frases?.length) return

    setFraseActual(frases[Math.floor(Math.random() * frases.length)])

    const interval = setInterval(() => {
      setFraseActual(frases[Math.floor(Math.random() * frases.length)])
    }, 30000)

    return () => clearInterval(interval)
  }, [frases])

  if (!frases?.length || !fraseActual) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          px: 2,
          py: 1.5,
          maxWidth: 260,
          borderRadius: 3,
          position: 'relative',
          bgcolor: 'white',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            right: 30,
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '12px solid white',
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontStyle: 'italic', color: 'text.primary', lineHeight: 1.5 }}
        >
          &ldquo;{fraseActual}&rdquo;
        </Typography>
      </Paper>

      <Box
        component="img"
        src="/robot.svg"
        alt="Robot"
        sx={{ width: ROBOT_SIZE, height: ROBOT_SIZE, display: 'block' }}
      />
    </Box>
  )
}
