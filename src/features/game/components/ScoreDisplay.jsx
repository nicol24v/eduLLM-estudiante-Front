import { Chip } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'

export default function ScoreDisplay({ score }) {
  return (
    <Chip
      icon={<StarIcon />}
      label={`${score} pts`}
      color="warning"
      sx={{ fontWeight: 700, fontSize: '1rem', px: 1 }}
    />
  )
}
