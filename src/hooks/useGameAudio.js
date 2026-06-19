import { useEffect, useRef } from 'react'

const SFX = {
  show: '/sounds/show.mp3',
  answersMusic: '/sounds/answersMusic.mp3',
  answersSound: '/sounds/answersSound.mp3',
  boump: '/sounds/boump.mp3',
  results: '/sounds/results.mp3',
  snearRoll: '/sounds/snearRoll.mp3',
  first: '/sounds/first.mp3',
  second: '/sounds/second.mp3',
  third: '/sounds/three.mp3',
}

export function useGameAudio(status, isCorrect, myPosition) {
  const currentRef = useRef(null)

  const play = (key) => {
    if (currentRef.current) {
      currentRef.current.pause()
      currentRef.current.currentTime = 0
    }
    const audio = new Audio(SFX[key])
    audio.volume = 0.6
    audio.play().catch(() => {})
    currentRef.current = audio
  }

  useEffect(() => {
    if (status === 'SHOW_QUESTION') play('show')
    else if (status === 'SELECT_ANSWER') play('answersMusic')
    else if (status === 'SHOW_LEADERBOARD') play('results')
    else if (status === 'FINISHED') {
      play('snearRoll')
      if (myPosition === 1) setTimeout(() => play('first'), 2000)
      else if (myPosition === 2) setTimeout(() => play('second'), 2000)
      else if (myPosition === 3) setTimeout(() => play('third'), 2000)
    }
  }, [status])

  useEffect(() => {
    if (status === 'POST_ANSWER') {
      play(isCorrect ? 'boump' : 'answersSound')
    }
  }, [status, isCorrect])

  return { playSound: play }
}
