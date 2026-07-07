import { Button, Box } from '@mui/material'

const COLORS       = ['#e53935', '#1e88e5', '#f9a825', '#43a047']
const COLORS_DARK  = ['#b71c1c', '#1565c0', '#f57f17', '#2e7d32']
const COLORS_LIGHT = ['#ef5350', '#42a5f5', '#ffca28', '#66bb6a']
const ICONS = ['▲', '◆', '●', '■']

export default function AnswerButton({ index, label, disabled, onClick, selected }) {
  const color      = COLORS[index % 4]
  const colorDark  = COLORS_DARK[index % 4]
  const colorLight = COLORS_LIGHT[index % 4]
  const icon       = ICONS[index % 4]

  return (
    <Button
      variant="contained"
      fullWidth
      disabled={disabled}
      onClick={onClick}
      sx={{
        background: `linear-gradient(to bottom, ${colorLight} 0%, ${color} 70%)`,
        boxShadow: `0 6px 0 ${colorDark}, 0 8px 12px rgba(0,0,0,0.25)`,
        borderRadius: '14px',
        border: selected ? '3px solid white' : '3px solid transparent',
        color: 'white',
        fontWeight: 700,
        fontSize: '1rem',
        fontFamily: "'Nunito', sans-serif",
        textShadow: '0 2px 4px rgba(0,0,0,0.35)',
        textTransform: 'none',
        p: 2,
        height: '100%',
        minHeight: '72px',
        width: '100%',
        justifyContent: 'flex-start',
        gap: 2,
        transition: 'transform 0.08s, box-shadow 0.08s',
        '&:hover': {
          background: `linear-gradient(to bottom, ${colorLight} 0%, ${color} 70%)`,
          transform: 'translateY(2px)',
          boxShadow: `0 4px 0 ${colorDark}, 0 6px 8px rgba(0,0,0,0.2)`,
        },
        '&:active': {
          transform: 'translateY(6px)',
          boxShadow: `0 0px 0 ${colorDark}, 0 2px 4px rgba(0,0,0,0.15)`,
        },
        '&.Mui-disabled': {
          background: `linear-gradient(to bottom, ${colorLight}88 0%, ${color}88 70%)`,
          boxShadow: `0 6px 0 ${colorDark}88`,
          color: 'white',
        },
      }}
    >
      <Box component="span" sx={{ fontSize: '1.2rem' }}>{icon}</Box>
      {label}
    </Button>
  )
}
