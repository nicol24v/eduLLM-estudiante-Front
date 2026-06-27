import fondoCuest from '../../assets/fondo-cuest.jpg'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import { useAuthStore } from '../../stores/useAuthStore'
import { useGameStore } from '../../stores/useGameStore'
import { usePlayerSocket } from '../../hooks/usePlayerSocket'
import { useGameAudio } from '../../hooks/useGameAudio'

import WaitingRoom from '../../features/game/states/WaitingRoom'
import GameStart from '../../features/game/states/GameStart'
import Prepared from '../../features/game/states/Prepared'
import Question from '../../features/game/states/Question'
import Answers from '../../features/game/states/Answers'
import PostAnswer from '../../features/game/states/PostAnswer'
import Leaderboard from '../../features/game/states/Leaderboard'
import FinalResults from '../../features/game/states/FinalResults'

const STATE_BG = {
  SHOW_ROOM: '#e3f2fd',
  SHOW_START: '#1a237e',
  SHOW_PREPARED: '#1a237e',
  SHOW_QUESTION: '#121212',
  SELECT_ANSWER: '#121212',
  POST_ANSWER: '#212121',
  SHOW_LEADERBOARD: '#1a237e',
  FINISHED: '#f5f5f5',
}

const STATE_COLOR = {
  SHOW_START: 'white',
  SHOW_PREPARED: 'white',
  SHOW_QUESTION: 'white',
  SELECT_ANSWER: 'white',
  POST_ANSWER: 'white',
  SHOW_LEADERBOARD: 'white',
}

export default function GamePage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { idEstudianteMateria, token } = useAuthStore()
  const { status, myAnswer, myPosition, quizTitle, totalPreguntas, leaderboard } = useGameStore()

  useEffect(() => {
    if (!token || !idEstudianteMateria) {
      navigate('/join', { replace: true })
    }
  }, [token, idEstudianteMateria])

  const { sendAnswer, leaveRoom } = usePlayerSocket(code)
  useGameAudio(status, myAnswer?.isCorrect, myPosition)

  const bg = STATE_BG[status] || '#f5f5f5'
  const color = STATE_COLOR[status] || 'inherit'
  const isQuestionState = status === 'SHOW_QUESTION' || status === 'SELECT_ANSWER'

  const renderState = () => {
    switch (status) {
      case 'SHOW_ROOM':
        return <WaitingRoom players={leaderboard} code={code} onLeave={leaveRoom} />
      case 'SHOW_START':
        return <GameStart quizTitle={quizTitle} totalPreguntas={totalPreguntas} />
      case 'SHOW_PREPARED':
        return <Prepared />
      case 'SHOW_QUESTION':
        return <Question />
      case 'SELECT_ANSWER':
        return <Answers sendAnswer={sendAnswer} />
      case 'POST_ANSWER':
        return <PostAnswer />
      case 'SHOW_LEADERBOARD':
        return <Leaderboard />
      case 'FINISHED':
        return <FinalResults />
      default:
        return null
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      color,
      fontFamily: "'Fredoka One', 'Nunito', cursive",
      transition: 'background 0.4s',
      ...(isQuestionState
        ? {
            background: `linear-gradient(rgba(10,10,30,0.60), rgba(10,10,30,0.60)), url(${fondoCuest})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }
        : { bgcolor: bg }
      ),
    }}>
      <Container maxWidth="md" sx={{ py: 2 }}>
        {renderState()}
      </Container>
    </Box>
  )
}
