import { useState, useEffect, useRef } from 'react'
import { Box, Paper, Typography } from '@mui/material'

const ROBOT_SIZE = 80

export default function RobotFrases({ frases }) {
  const [fraseActual, setFraseActual] = useState('')
  const [visible, setVisible] = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!frases?.length) return

    setFraseActual(frases[Math.floor(Math.random() * frases.length)])

    intervalRef.current = setInterval(() => {
      setFraseActual(frases[Math.floor(Math.random() * frases.length)])
    }, 30000)

    return () => clearInterval(intervalRef.current)
  }, [frases])

  useEffect(() => {
    if (!visible && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [visible])

  const handleToggle = () => {
    setVisible((v) => !v)
  }

  if (!frases?.length || !fraseActual) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1,
      }}
    >
      {visible && (
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
      )}

      <Box
        component="img"
        src="/robot.svg"
        alt="Robot"
        onClick={handleToggle}
        sx={{
          width: ROBOT_SIZE,
          height: ROBOT_SIZE,
          display: 'block',
          cursor: 'pointer',
          opacity: visible ? 1 : 0.5,
          transition: 'opacity 0.2s',
          '&:hover': { opacity: visible ? 0.8 : 0.7 },
        }}
      />
    </Box>
  )
}
