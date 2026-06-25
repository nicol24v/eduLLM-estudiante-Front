# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar el HomePage y el navbar de EduQuiz Estudiante con gradiente azul/lila Aurora Borealis, glassmorphism, y decoraciones de ciencias naturales.

**Architecture:** Se crea un componente `ScienceBackground` reutilizable que encapsula todos los elementos decorativos (blobs, patrón SVG, acentos ilustrados). El navbar en `Layout.jsx` se rediseña con glassmorphism oscuro y botones pill. El `HomePage.jsx` integra `ScienceBackground` como fondo absoluto y usa glassmorphism para la card central y las tarjetas de stats.

**Tech Stack:** React 19, MUI v9, Vitest + @testing-library/react, CSS transitions via MUI `sx` prop.

## Global Constraints

- MUI v9 (`@mui/material ^9.1.1`) — usar la API de `Grid` con `item xs sm` consistente con el código existente
- Framer Motion **no instalado** — toda animación via `transition` en `sx` o CSS puro
- No instalar nuevas dependencias npm
- Íconos: solo `@mui/icons-material` o SVG inline — sin imágenes externas
- Glassmorphism en mobile: `rgba(255,255,255,0.88)` sin `backdropFilter` (rendimiento en Android gama baja)
- Acentos ilustrados ocultos en `xs` (`display: { xs: 'none', sm: 'block' }`)
- Dev server: `npm run dev` → http://localhost:8003
- Tests: `npm test` (vitest run)

---

### Task 1: ScienceBackground — componente decorativo de fondo

**Files:**
- Create: `src/components/ScienceBackground.jsx`
- Create: `src/tests/components/ScienceBackground.test.jsx`

**Interfaces:**
- Produces: `ScienceBackground` — default export, sin props. Debe renderizarse dentro de un contenedor con `position: relative`. Se posiciona absolutamente (`inset: 0`, `z-index: 0`) y contiene todos los elementos decorativos.

---

- [ ] **Step 1: Escribir el test**

Crear `src/tests/components/ScienceBackground.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ScienceBackground from '../../components/ScienceBackground'

describe('ScienceBackground', () => {
  it('renders without crashing', () => {
    const { container } = render(<ScienceBackground />)
    expect(container.firstChild).toBeTruthy()
  })

  it('SVG decorative elements have aria-hidden', () => {
    const { container } = render(<ScienceBackground />)
    container.querySelectorAll('svg').forEach((svg) => {
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })
  })
})
```

- [ ] **Step 2: Correr el test — verificar que falla**

```bash
npm test -- ScienceBackground
```
Expected: FAIL — `Cannot find module '../../components/ScienceBackground'`

- [ ] **Step 3: Crear el componente**

Crear `src/components/ScienceBackground.jsx`:

```jsx
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

      {/* Acento hoja — izquierda, oculta en mobile */}
      <Box
        component="svg"
        viewBox="0 0 200 400"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        sx={{
          position: 'absolute', left: -40, top: '50%', transform: 'translateY(-50%)',
          width: { xs: 0, sm: 160, md: 200 },
          height: { xs: 0, sm: 320, md: 400 },
          opacity: 0.2,
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <path d="M100 380 Q20 280 20 140 Q20 20 100 10 Q180 20 180 140 Q180 280 100 380Z" fill="white" />
        <line x1="100" y1="380" x2="100" y2="10" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <path d="M100 300 Q60 260 40 200" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
        <path d="M100 300 Q140 260 160 200" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
        <path d="M100 220 Q60 180 45 130" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
        <path d="M100 220 Q140 180 155 130" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
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
        <circle cx="270" cy="150" r="5" fill="#a855f7" />
        <circle cx="90" cy="97" r="5" fill="#7c3aed" />
        <circle cx="90" cy="203" r="5" fill="#a855f7" />
      </Box>
    </Box>
  )
}
```

- [ ] **Step 4: Correr el test — verificar que pasa**

```bash
npm test -- ScienceBackground
```
Expected: PASS — 2 tests pasan

- [ ] **Step 5: Commit**

```bash
git add src/components/ScienceBackground.jsx src/tests/components/ScienceBackground.test.jsx
git commit -m "feat: add ScienceBackground decorative component"
```

---

### Task 2: Navbar rediseñado (Layout.jsx)

**Files:**
- Modify: `src/components/Layout.jsx`
- Create: `src/tests/components/Layout.test.jsx`

**Interfaces:**
- Consumes: `useAuthStore()` sin selector → `{ nombre, apellidoPaterno, logout }`, `useGameStore(selector)` → `reset`
- Produces: `Layout({ children })` — misma API pública, solo cambia la presentación visual

---

- [ ] **Step 1: Escribir el test (baseline + regression)**

Crear `src/tests/components/Layout.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Layout from '../../components/Layout'

vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../../stores/useAuthStore', () => ({
  useAuthStore: () => ({ nombre: 'Ana', apellidoPaterno: 'García', logout: vi.fn() }),
}))
vi.mock('../../stores/useGameStore', () => ({
  useGameStore: (selector) => selector({ reset: vi.fn() }),
}))

describe('Layout navbar', () => {
  it('renders EduQuiz logo text', () => {
    render(<Layout><div /></Layout>)
    expect(screen.getByText('EduQuiz')).toBeInTheDocument()
  })

  it('renders Historial pill button', () => {
    render(<Layout><div /></Layout>)
    expect(screen.getByText('Historial')).toBeInTheDocument()
  })

  it('renders logout button', () => {
    render(<Layout><div /></Layout>)
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(<Layout><div data-testid="child-content">hello</div></Layout>)
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Correr el test — confirmar baseline en Layout actual**

```bash
npm test -- Layout
```
Expected: PASS — los 4 tests pasan sobre el Layout actual (son regression guards)

- [ ] **Step 3: Reemplazar Layout.jsx completo**

Reemplazar el contenido completo de `src/components/Layout.jsx`:

```jsx
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import ScienceIcon from '@mui/icons-material/Science'
import BarChartIcon from '@mui/icons-material/BarChart'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useGameStore } from '../stores/useGameStore'

const GATEWAY = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const NAV_ITEMS = [
  { label: 'Historial', path: '/history', icon: <BarChartIcon fontSize="small" />, color: '#1e40af' },
  // Para añadir más ítems: { label: 'Nombre', path: '/ruta', icon: <Icon />, color: '#6d28d9' }
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const { nombre, apellidoPaterno, logout } = useAuthStore()
  const reset = useGameStore((s) => s.reset)

  const handleLogout = async () => {
    reset()
    logout()
    try {
      await axios.post(`${GATEWAY}/api/auth/logout`, {}, { withCredentials: true })
    } catch {}
    window.location.href = `${GATEWAY}/login`
  }

  const displayName = [nombre, apellidoPaterno].filter(Boolean).join(' ')

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'rgba(10, 14, 39, 0.88)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mr: 3 }}
            onClick={() => navigate('/')}
          >
            <ScienceIcon sx={{ color: '#a855f7' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              EduQuiz
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                  bgcolor: item.color,
                  color: 'white',
                  borderRadius: '24px',
                  px: { xs: 1.5, sm: 2 },
                  py: 0.75,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  '& .MuiButton-startIcon': { mr: { xs: 0, sm: 0.5 } },
                  '& .nav-label': { display: { xs: 'none', sm: 'inline' } },
                  '&:hover': { bgcolor: item.color, filter: 'brightness(1.2)' },
                  transition: 'filter 0.2s',
                  minWidth: { xs: 40, sm: 'auto' },
                }}
              >
                <span className="nav-label">{item.label}</span>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {displayName && (
            <Typography
              variant="body2"
              sx={{ mr: 2, color: 'rgba(255,255,255,0.7)', display: { xs: 'none', sm: 'block' } }}
            >
              {displayName}
            </Typography>
          )}

          <Button
            onClick={handleLogout}
            variant="outlined"
            size="small"
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.4)',
              borderRadius: '20px',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  )
}
```

- [ ] **Step 4: Correr tests — verificar que siguen pasando**

```bash
npm test -- Layout
```
Expected: PASS — los 4 tests pasan sobre el Layout redesigned

- [ ] **Step 5: Commit**

```bash
git add src/components/Layout.jsx src/tests/components/Layout.test.jsx
git commit -m "feat: redesign navbar with dark glassmorphism and pill buttons"
```

---

### Task 3: HomePage rediseñado — hero Aurora Borealis

**Files:**
- Modify: `src/pages/home/HomePage.jsx`
- Create: `src/tests/pages/HomePage.test.jsx`

**Interfaces:**
- Consumes: `ScienceBackground` de Task 1 (default export, sin props), `useAuthStore(selector)` donde `selector = (s) => s.nombre`, `historyService.getStats()` retorna `Promise<Array<{ id_estudiante_materia: number, promedio_puntaje: number, total_partidas: number, materia: { id_materia: number, nombre: string } }>>`

---

- [ ] **Step 1: Escribir los tests**

Crear `src/tests/pages/HomePage.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { historyService } from '../../services/historyService'
import HomePage from '../../pages/home/HomePage'

vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../../stores/useAuthStore', () => ({
  useAuthStore: (selector) => selector({ nombre: 'Ana' }),
}))
vi.mock('../../services/historyService', () => ({
  historyService: { getStats: vi.fn() },
}))
vi.mock('../../components/ScienceBackground', () => ({
  default: () => <div data-testid="science-bg" />,
}))

describe('HomePage', () => {
  beforeEach(() => {
    historyService.getStats.mockResolvedValue([])
  })

  it('renders personalized greeting', async () => {
    render(<HomePage />)
    expect(await screen.findByText('¡Hola, Ana!')).toBeInTheDocument()
  })

  it('renders join button', async () => {
    render(<HomePage />)
    expect(await screen.findByText('Unirse a sala')).toBeInTheDocument()
  })

  it('renders ScienceBackground', async () => {
    render(<HomePage />)
    expect(await screen.findByTestId('science-bg')).toBeInTheDocument()
  })

  it('renders stat card when stats are present', async () => {
    historyService.getStats.mockResolvedValueOnce([{
      id_estudiante_materia: 1,
      promedio_puntaje: 85,
      total_partidas: 3,
      materia: { id_materia: 1, nombre: 'Biología' },
    }])
    render(<HomePage />)
    expect(await screen.findByText('Biología')).toBeInTheDocument()
    expect(await screen.findByText('85')).toBeInTheDocument()
  })

  it('does not render stats section when stats are empty', async () => {
    render(<HomePage />)
    await screen.findByText('Unirse a sala')
    expect(screen.queryByText('Mi promedio por materia')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Correr tests — verificar que fallan donde corresponde**

```bash
npm test -- HomePage
```
Expected: `renders ScienceBackground` FAIL (ScienceBackground aún no se importa en HomePage), el resto puede pasar o fallar según el estado actual

- [ ] **Step 3: Reemplazar HomePage.jsx completo**

Reemplazar el contenido completo de `src/pages/home/HomePage.jsx`:

```jsx
import { useEffect, useState } from 'react'
import {
  Box, Button, Typography, Grid, Card,
  CardActionArea, CardContent, CircularProgress,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import BarChartIcon from '@mui/icons-material/BarChart'
import { historyService } from '../../services/historyService'
import ScienceBackground from '../../components/ScienceBackground'

export default function HomePage() {
  const navigate = useNavigate()
  const nombre = useAuthStore((s) => s.nombre)
  const [stats, setStats] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    historyService.getStats()
      .then(setStats)
      .catch(() => setStats([]))
      .finally(() => setLoadingStats(false))
  }, [])

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1565c0 0%, #7c3aed 55%, #a855f7 100%)',
        overflow: 'hidden',
        px: 2,
        py: 6,
      }}
    >
      <ScienceBackground />

      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: 560,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: 'white',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
          }}
        >
          {nombre ? `¡Hola, ${nombre}!` : '¡Bienvenido!'}
        </Typography>

        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 5 }}>
          Ingresa el código de sala que te compartió tu profesor para unirte a una prueba.
        </Typography>

        {/* Card glassmorphism — desktop: blur, mobile: opaco */}
        <Box
          sx={{
            background: { xs: 'rgba(255,255,255,0.88)', md: 'rgba(255,255,255,0.12)' },
            backdropFilter: { xs: 'none', md: 'blur(16px)' },
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '20px',
            px: { xs: 3, sm: 5 },
            py: { xs: 3, sm: 4 },
            mb: 5,
          }}
        >
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<SportsEsportsIcon />}
            onClick={() => navigate('/join')}
            sx={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed, #1565c0)',
              borderRadius: '12px',
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: '0 4px 24px rgba(124, 58, 237, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 32px rgba(124, 58, 237, 0.55)',
                background: 'linear-gradient(135deg, #a855f7, #7c3aed, #1565c0)',
              },
            }}
          >
            Unirse a sala
          </Button>
        </Box>

        {loadingStats ? (
          <CircularProgress size={28} sx={{ color: 'white' }} />
        ) : stats.length > 0 ? (
          <Box sx={{ textAlign: 'left' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BarChartIcon sx={{ color: 'rgba(255,255,255,0.9)', fontSize: 'small' }} />
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'white' }}>
                Mi promedio por materia
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {stats.map((s) => (
                <Grid item xs={12} sm={6} key={s.id_estudiante_materia}>
                  <Card
                    elevation={0}
                    sx={{
                      background: { xs: 'rgba(255,255,255,0.85)', md: 'rgba(255,255,255,0.12)' },
                      backdropFilter: { xs: 'none', md: 'blur(12px)' },
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 3,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)' },
                    }}
                  >
                    <CardActionArea onClick={() => navigate(`/history?materiaId=${s.materia.id_materia}`)}>
                      <CardContent>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ color: { xs: 'text.secondary', md: 'rgba(255,255,255,0.7)' } }}
                        >
                          {s.materia.nombre}
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          sx={{ color: { xs: 'primary.main', md: 'white' }, mt: 0.5 }}
                        >
                          {s.promedio_puntaje}
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: { xs: 'text.secondary', md: 'rgba(255,255,255,0.6)' }, ml: 0.5 }}
                          >
                            pts
                          </Typography>
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: { xs: 'text.secondary', md: 'rgba(255,255,255,0.6)' } }}
                        >
                          {s.total_partidas} {s.total_partidas === 1 ? 'cuestionario' : 'cuestionarios'}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}
```

- [ ] **Step 4: Correr tests de HomePage — verificar que pasan todos**

```bash
npm test -- HomePage
```
Expected: PASS — los 5 tests pasan

- [ ] **Step 5: Correr suite completa**

```bash
npm test
```
Expected: PASS — todos los tests existentes (stores) + los 3 nuevos suites pasan

- [ ] **Step 6: Verificación visual en dev server**

```bash
npm run dev
```
Abrir http://localhost:8003 y verificar con DevTools (toggle device toolbar para mobile):

**Desktop:**
- [ ] Navbar oscuro semitransparente, logo con ícono átomo lila + "EduQuiz" blanco
- [ ] Pill azul "Historial" con ícono visible
- [ ] Hero con gradiente azul→violeta→lila ocupa toda la pantalla
- [ ] 3 blobs difuminados en las esquinas y centro
- [ ] Patrón SVG de ciencias sutil como textura de fondo
- [ ] Silueta de hoja translúcida en el lado izquierdo
- [ ] Átomo con halo lila brillante en el lado derecho
- [ ] Card glassmorphism centrada con botón degradado "Unirse a sala"
- [ ] Hover en botón: sube levemente

**Mobile (simular con DevTools, ~390px):**
- [ ] Navbar: solo ícono en pill, nombre de usuario oculto
- [ ] Hoja y átomo ocultos
- [ ] Card opaca `rgba(255,255,255,0.88)` sin blur
- [ ] Todo apilado en columna, scroll suave

- [ ] **Step 7: Commit final**

```bash
git add src/pages/home/HomePage.jsx src/tests/pages/HomePage.test.jsx
git commit -m "feat: redesign homepage with Aurora Borealis hero and glassmorphism"
```
