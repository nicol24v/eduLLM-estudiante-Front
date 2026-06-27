import { Box, Typography, Grid, Paper } from '@mui/material'
import { useState } from 'react'
import Timer from '../components/Timer'
import QuestionMedia from '../components/QuestionMedia'
import AnswerButton from '../components/AnswerButton'
import ScoreDisplay from '../components/ScoreDisplay'
import { useGameStore } from '../../../stores/useGameStore'

export default function Answers({ sendAnswer }) {
  const { currentQuestion, score } = useGameStore()
  const [selected, setSelected] = useState(null)

  if (!currentQuestion) return null

  const handleSelect = (opcionId) => {
    if (selected !== null) return
    setSelected(opcionId)
    sendAnswer(opcionId)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Pregunta {(currentQuestion.index ?? 0) + 1} de {currentQuestion.total ?? '?'}
        </Typography>
        <ScoreDisplay score={score} />
      </Box>
      <Timer totalSeconds={currentQuestion.tiempo_limite} />
      <Paper elevation={2} sx={{ p: 3, mt: 2, mb: 3, borderRadius: 3 }}>
        <QuestionMedia url={currentQuestion.image_url} />
        <Typography variant="h5" fontWeight={700} textAlign="center">
          {currentQuestion.texto}
        </Typography>
      </Paper>
      <Grid container spacing={2} alignItems="stretch">
        {currentQuestion.opciones.map((op, i) => (
          <Grid item xs={6} key={op.id_opcion}>
            <AnswerButton
              index={i}
              label={op.texto}
              disabled={selected !== null}
              selected={selected === op.id_opcion}
              onClick={() => handleSelect(op.id_opcion)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
