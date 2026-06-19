import { Button, Box } from '@mui/material'

const COLORS = ['#e53935', '#1e88e5', '#f9a825', '#43a047']
const ICONS = ['▲', '◆', '●', '■']

export default function AnswerButton({ index, label, disabled, onClick, selected }) {
  const color = COLORS[index % 4]
  const icon = ICONS[index % 4]

  return (
    <Button
      variant="contained"
      fullWidth
      disabled={disabled}
      onClick={onClick}
      sx={{
        bgcolor: selected ? `${color}cc` : color,
        '&:hover': { bgcolor: `${color}dd` },
        '&.Mui-disabled': { bgcolor: `${color}88`, color: 'white' },
        color: 'white',
        fontWeight: 700,
        fontSize: '1rem',
        p: 2,
        borderRadius: 2,
        textTransform: 'none',
        justifyContent: 'flex-start',
        gap: 2,
        border: selected ? '3px solid white' : '3px solid transparent',
      }}
    >
      <Box component="span" sx={{ fontSize: '1.2rem' }}>{icon}</Box>
      {label}
    </Button>
  )
}
