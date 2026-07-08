import { Box } from '@mui/material'

export default function ScienceBackground() {
  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
      {/* Blob violeta — top right */}
      <Box sx={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%', background: '#7c3aed',
        filter: 'blur(100px)', opacity: 0.5,
        top: -100, right: -100,
      }} />
      {/* Blob azul — bottom left */}
      <Box sx={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', background: '#1565c0',
        filter: 'blur(100px)', opacity: 0.5,
        bottom: -80, left: -80,
      }} />
      {/* Blob lila — centro */}
      <Box sx={{
        position: 'absolute', width: 350, height: 350,
        borderRadius: '50%', background: '#a855f7',
        filter: 'blur(120px)', opacity: 0.3,
        top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
      }} />

      {/* Patrón SVG ciencias — átomo, hoja, molécula, planeta */}
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}
      >
        <defs>
          <pattern id="science-bg-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Átomo */}
            <circle cx="20" cy="20" r="3" fill="white" />
            <ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="white" strokeWidth="1" />
            <ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="white" strokeWidth="1" transform="rotate(60 20 20)" />
            <ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="white" strokeWidth="1" transform="rotate(120 20 20)" />
            {/* Hoja */}
            <path d="M70 45 Q70 25 85 25 Q85 40 70 45Z" fill="none" stroke="white" strokeWidth="1" />
            <line x1="70" y1="45" x2="85" y2="25" stroke="white" strokeWidth="0.5" />
            {/* Molécula */}
            <circle cx="25" cy="85" r="4" fill="none" stroke="white" strokeWidth="1" />
            <circle cx="40" cy="78" r="3" fill="none" stroke="white" strokeWidth="1" />
            <circle cx="40" cy="92" r="3" fill="none" stroke="white" strokeWidth="1" />
            <line x1="29" y1="82" x2="37" y2="79" stroke="white" strokeWidth="1" />
            <line x1="29" y1="88" x2="37" y2="91" stroke="white" strokeWidth="1" />
            {/* Planeta */}
            <circle cx="90" cy="90" r="7" fill="none" stroke="white" strokeWidth="1" />
            <ellipse cx="90" cy="90" rx="14" ry="4" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#science-bg-pattern)" />
      </Box>

      {/* Acento átomo — derecha, oculto en mobile */}
      <Box
        component="svg"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        sx={{
          position: 'absolute', right: -60, top: '50%', transform: 'translateY(-50%)',
          width: { xs: 0, sm: 200, md: 280 },
          height: { xs: 0, sm: 200, md: 280 },
          display: { xs: 'none', sm: 'block' },
          filter: 'drop-shadow(0 0 24px rgba(168, 85, 247, 0.6))',
          opacity: 0.85,
        }}
      >
        <circle cx="150" cy="150" r="12" fill="white" opacity="0.9" />
        <ellipse cx="150" cy="150" rx="120" ry="45" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
        <ellipse cx="150" cy="150" rx="120" ry="45" fill="none" stroke="white" strokeWidth="2" opacity="0.7" transform="rotate(60 150 150)" />
        <ellipse cx="150" cy="150" rx="120" ry="45" fill="none" stroke="white" strokeWidth="2" opacity="0.7" transform="rotate(120 150 150)" />
      </Box>
    </Box>
  )
}
