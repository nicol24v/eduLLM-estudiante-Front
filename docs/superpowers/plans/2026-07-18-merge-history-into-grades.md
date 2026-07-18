# Fusionar Historial en Calificaciones — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar la página/ítem de menú "Historial" y hacer que "Calificaciones" liste una fila por intento jugado (no solo el mejor por cuestionario), con acceso condicionado a la revisión pregunta-por-pregunta según el flag `revision_disponible` de cada partida.

**Architecture:** Se reutiliza `HistoryDetailPage.jsx` sin tocar su lógica interna, remontándolo bajo `/grades/:id`. `GradesPage.jsx` deja de deduplicar y agrega una columna "Revisión" con un ícono habilitado/deshabilitado según el flag de cada partida. `HistoryListPage.jsx` y la ruta `/history` se eliminan.

**Tech Stack:** React 19, React Router 6, MUI 9, Vitest + Testing Library.

## Global Constraints

- No modificar `useGameStore`, `usePlayerSocket`, sockets, ni ningún hook/store del juego en vivo.
- No implementar backend ni front del docente en este repo; si `revision_disponible` no viene en la respuesta de la API, tratarlo como `false` (nunca asumir disponible).
- No tocar `Leaderboard.jsx`, sonidos (`useGameAudio.js`), ni ningún otro cambio ya aplicado en `GamePage.jsx` en esta sesión.
- El campo booleano de cada partida se llama `revision_disponible` (snake_case, tal como lo devuelve la API existente para otros campos como `respuestas_correctas`).

---

## File Structure

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `src/router.jsx` | Modificar | Quitar rutas `/history` y `/history/:id`; agregar `/grades/:id` |
| `src/components/Layout.jsx` | Modificar | Quitar ítem de menú "Historial" |
| `src/pages/history/HistoryDetailPage.jsx` | Modificar | Textos/rutas de navegación apuntan a `/grades` en vez de `/history` |
| `src/pages/history/HistoryListPage.jsx` | Eliminar | Ya no se usa |
| `src/tests/components/Layout.test.jsx` | Modificar | Reflejar que solo existe "Calificaciones" |
| `src/tests/pages/HistoryDetailPage.test.jsx` | Crear | Cubre el nuevo texto/ruta del botón "Volver" |
| `src/pages/home/HomePage.jsx` | Modificar | Tarjetas de materia navegan a `/grades?materiaId=X` |
| `src/tests/pages/HomePage.test.jsx` | Modificar | Cubre la nueva ruta de navegación |
| `src/pages/grades/GradesPage.jsx` | Modificar | Filtro por materia, una fila por partida, columna Revisión |
| `src/tests/pages/GradesPage.test.jsx` | Crear | Cubre filtro, no-dedup, ícono habilitado/deshabilitado, promedio |

---

### Task 1: Routing, menú y renombrado de navegación en HistoryDetailPage

**Files:**
- Modify: `src/router.jsx`
- Modify: `src/components/Layout.jsx`
- Modify: `src/pages/history/HistoryDetailPage.jsx:21,36-42`
- Delete: `src/pages/history/HistoryListPage.jsx`
- Modify: `src/tests/components/Layout.test.jsx`
- Create: `src/tests/pages/HistoryDetailPage.test.jsx`

**Interfaces:**
- Consumes: nada de tareas anteriores.
- Produces: ruta `/grades/:id` monta `HistoryDetailPage`; `Layout.jsx` `NAV_ITEMS` contiene únicamente `{ label: 'Calificaciones', path: '/grades' }`. Tareas 2 y 3 dependen de que `/grades/:id` exista y de que no quede ninguna referencia activa a `/history`.

- [ ] **Step 1: Escribir el test que falla para `Layout.jsx` (solo debe existir "Calificaciones")**

Reemplaza el contenido de `src/tests/components/Layout.test.jsx`:

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

  it('renders Calificaciones pill button', () => {
    render(<Layout><div /></Layout>)
    expect(screen.getByText('Calificaciones')).toBeInTheDocument()
  })

  it('does not render Historial pill button', () => {
    render(<Layout><div /></Layout>)
    expect(screen.queryByText('Historial')).not.toBeInTheDocument()
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

- [ ] **Step 2: Escribir el test que falla para `HistoryDetailPage.jsx` (botón "Volver a calificaciones")**

Crea `src/tests/pages/HistoryDetailPage.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { historyService } from '../../services/historyService'
import HistoryDetailPage from '../../pages/history/HistoryDetailPage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}))
vi.mock('../../services/historyService', () => ({
  historyService: { getDetail: vi.fn() },
}))

const detalleMock = {
  partida: {
    puntaje_total: 10,
    respuestas_correctas: 1,
    tbl_t_partida: { tbl_t_prueba: { titulo: 'La célula', _count: { tbl_t_pregunta: 1 } } },
    tbl_m_estudiante_materia: { tbl_m_materia: { nombre: 'Biología', id_materia: 5 } },
  },
  respuestas: [],
}

describe('HistoryDetailPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    historyService.getDetail.mockResolvedValue(detalleMock)
  })

  it('renders a "Volver a calificaciones" button', async () => {
    render(<HistoryDetailPage />)
    expect(await screen.findByText('Volver a calificaciones')).toBeInTheDocument()
  })

  it('navigates to /grades with the materiaId when the back button is clicked', async () => {
    render(<HistoryDetailPage />)
    const backButton = await screen.findByText('Volver a calificaciones')
    fireEvent.click(backButton)
    expect(mockNavigate).toHaveBeenCalledWith('/grades?materiaId=5')
  })

  it('redirects to /grades when the detail fails to load', async () => {
    historyService.getDetail.mockRejectedValueOnce(new Error('fail'))
    render(<HistoryDetailPage />)
    await screen.findByText('Volver a calificaciones').catch(() => {})
    expect(mockNavigate).toHaveBeenCalledWith('/grades', { replace: true })
  })
})
```

- [ ] **Step 3: Correr los tests nuevos y confirmar que fallan**

Run: `npx vitest run src/tests/components/Layout.test.jsx src/tests/pages/HistoryDetailPage.test.jsx`
Expected: FAIL — `Layout.test.jsx` falla en "does not render Historial pill button" (el botón "Historial" existe hoy); `HistoryDetailPage.test.jsx` falla porque el texto actual es "Volver al historial" y navega a `/history...`.

- [ ] **Step 4: Quitar el ítem "Historial" del menú**

En `src/components/Layout.jsx`, elimina el import no usado y la entrada del array:

```jsx
// antes
import BarChartIcon from '@mui/icons-material/BarChart'
import GradeIcon from '@mui/icons-material/Grade'
...
const NAV_ITEMS = [
  { label: 'Historial', path: '/history', icon: <BarChartIcon fontSize="small" />, color: '#1e40af' },
  { label: 'Calificaciones', path: '/grades', icon: <GradeIcon fontSize="small" />, color: '#6d28d9' },
]

// después
import GradeIcon from '@mui/icons-material/Grade'
...
const NAV_ITEMS = [
  { label: 'Calificaciones', path: '/grades', icon: <GradeIcon fontSize="small" />, color: '#6d28d9' },
]
```

- [ ] **Step 5: Renombrar la navegación de salida en `HistoryDetailPage.jsx`**

En `src/pages/history/HistoryDetailPage.jsx`:

```jsx
// línea 21 — antes
.catch(() => navigate('/history', { replace: true }))
// después
.catch(() => navigate('/grades', { replace: true }))
```

```jsx
// líneas 36-42 — antes
<Button
  startIcon={<ArrowBackIcon />}
  onClick={() => navigate(`/history${materiaId ? `?materiaId=${materiaId}` : ''}`)}
  sx={{ mb: 2 }}
>
  Volver al historial
</Button>

// después
<Button
  startIcon={<ArrowBackIcon />}
  onClick={() => navigate(`/grades${materiaId ? `?materiaId=${materiaId}` : ''}`)}
  sx={{ mb: 2 }}
>
  Volver a calificaciones
</Button>
```

- [ ] **Step 6: Actualizar las rutas en `router.jsx`**

En `src/router.jsx`, quita el import y las rutas de `HistoryListPage`, y mueve `HistoryDetailPage` a `/grades/:id`:

```jsx
import { createBrowserRouter } from 'react-router-dom'
import AuthCallback from './pages/auth/AuthCallback'
import DashboardPage from './pages/dashboard/DashboardPage'
import HomePage from './pages/home/HomePage'
import JoinPage from './pages/join/JoinPage'
import GamePage from './pages/game/GamePage'
import HistoryDetailPage from './pages/history/HistoryDetailPage'
import GradesPage from './pages/grades/GradesPage'
import NotFoundPage from './pages/not-found/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

const basename = import.meta.env.VITE_BASENAME || ''

export const router = createBrowserRouter([
  { path: '/auth/callback', element: <AuthCallback /> },
  { path: '/dashboard', element: <DashboardPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout>
          <HomePage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/join',
    element: (
      <ProtectedRoute>
        <Layout>
          <JoinPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/game/:code',
    element: (
      <ProtectedRoute>
        <GamePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/grades',
    element: (
      <ProtectedRoute>
        <Layout>
          <GradesPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/grades/:id',
    element: (
      <ProtectedRoute>
        <Layout>
          <HistoryDetailPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
], { basename })
```

- [ ] **Step 7: Eliminar `HistoryListPage.jsx`**

Run: `git rm src/pages/history/HistoryListPage.jsx`

- [ ] **Step 8: Correr los tests y confirmar que pasan**

Run: `npx vitest run src/tests/components/Layout.test.jsx src/tests/pages/HistoryDetailPage.test.jsx`
Expected: PASS (5 tests en `Layout.test.jsx`, 3 tests en `HistoryDetailPage.test.jsx`)

- [ ] **Step 9: Commit**

```bash
git add src/router.jsx src/components/Layout.jsx src/pages/history/HistoryDetailPage.jsx src/tests/components/Layout.test.jsx src/tests/pages/HistoryDetailPage.test.jsx
git commit -m "refactor: quitar pagina Historial y mover revision a /grades/:id"
```

---

### Task 2: HomePage navega a `/grades?materiaId=`

**Files:**
- Modify: `src/pages/home/HomePage.jsx:138`
- Modify: `src/tests/pages/HomePage.test.jsx`

**Interfaces:**
- Consumes: ruta `/grades` producida en Task 1 (acepta `?materiaId=`).
- Produces: nada consumido por otras tareas.

- [ ] **Step 1: Escribir el test que falla**

En `src/tests/pages/HomePage.test.jsx`, cambia el mock de `react-router-dom` para capturar la navegación y agrega un test:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { historyService } from '../../services/historyService'
import HomePage from '../../pages/home/HomePage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }))
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
    mockNavigate.mockClear()
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

  it('navigates to /grades with materiaId when a subject card is clicked', async () => {
    historyService.getStats.mockResolvedValueOnce([{
      id_estudiante_materia: 1,
      promedio_puntaje: 85,
      total_partidas: 3,
      materia: { id_materia: 1, nombre: 'Biología' },
    }])
    render(<HomePage />)
    const card = await screen.findByText('Biología')
    fireEvent.click(card)
    expect(mockNavigate).toHaveBeenCalledWith('/grades?materiaId=1')
  })
})
```

- [ ] **Step 2: Correr el test nuevo y confirmar que falla**

Run: `npx vitest run src/tests/pages/HomePage.test.jsx`
Expected: FAIL en "navigates to /grades with materiaId when a subject card is clicked" — hoy navega a `/history?materiaId=1`.

- [ ] **Step 3: Actualizar la navegación en `HomePage.jsx`**

```jsx
// línea 138 — antes
<CardActionArea onClick={() => navigate(`/history?materiaId=${s.materia.id_materia}`)}>

// después
<CardActionArea onClick={() => navigate(`/grades?materiaId=${s.materia.id_materia}`)}>
```

- [ ] **Step 4: Correr los tests y confirmar que pasan**

Run: `npx vitest run src/tests/pages/HomePage.test.jsx`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/home/HomePage.jsx src/tests/pages/HomePage.test.jsx
git commit -m "fix: tarjetas de materia navegan a /grades en vez de /history"
```

---

### Task 3: `GradesPage.jsx` — una fila por intento, filtro por materia y columna Revisión

**Files:**
- Modify: `src/pages/grades/GradesPage.jsx`
- Create: `src/tests/pages/GradesPage.test.jsx`

**Interfaces:**
- Consumes: ruta `/grades/:id` producida en Task 1; `historyService.getList(materiaId)` (ya existente en `src/services/historyService.js`, firma sin cambios).
- Produces: nada consumido por otras tareas — es la última pieza del flujo.

- [ ] **Step 1: Escribir los tests que fallan**

Crea `src/tests/pages/GradesPage.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { historyService } from '../../services/historyService'
import GradesPage from '../../pages/grades/GradesPage'

const mockNavigate = vi.fn()
let mockSearchParams = new URLSearchParams()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams],
}))
vi.mock('../../services/historyService', () => ({
  historyService: { getList: vi.fn() },
}))
vi.mock('../../stores/useAuthStore', () => ({
  useAuthStore: (selector) => selector({ nombre: 'Ana', apellidoPaterno: 'García' }),
}))

function partida(overrides) {
  return {
    id_partida_estudiante: 1,
    fecha_creacion: '2026-07-01T00:00:00.000Z',
    respuestas_correctas: 5,
    tbl_t_partida: {
      tbl_t_prueba: { id_prueba: 10, titulo: 'La célula', _count: { tbl_t_pregunta: 10 } },
    },
    revision_disponible: false,
    ...overrides,
  }
}

describe('GradesPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockSearchParams = new URLSearchParams()
  })

  it('renders one row per attempt instead of deduplicating by quiz', async () => {
    historyService.getList.mockResolvedValueOnce([
      partida({ id_partida_estudiante: 1, fecha_creacion: '2026-07-01T00:00:00.000Z', respuestas_correctas: 5 }),
      partida({ id_partida_estudiante: 2, fecha_creacion: '2026-07-05T00:00:00.000Z', respuestas_correctas: 8 }),
    ])
    render(<GradesPage />)
    expect(await screen.findAllByText('La célula')).toHaveLength(2)
  })

  it('fetches the list filtered by materiaId from the URL', async () => {
    mockSearchParams = new URLSearchParams('materiaId=7')
    historyService.getList.mockResolvedValueOnce([])
    render(<GradesPage />)
    await screen.findByText('No tienes cuestionarios registrados aún.')
    expect(historyService.getList).toHaveBeenCalledWith('7')
  })

  it('shows an enabled revision button that navigates to /grades/:id when revision_disponible is true', async () => {
    historyService.getList.mockResolvedValueOnce([
      partida({ id_partida_estudiante: 3, revision_disponible: true }),
    ])
    render(<GradesPage />)
    const button = await screen.findByRole('button', { name: 'Ver revisión' })
    expect(button).not.toBeDisabled()
    fireEvent.click(button)
    expect(mockNavigate).toHaveBeenCalledWith('/grades/3')
  })

  it('shows a disabled revision button when revision_disponible is false or missing', async () => {
    historyService.getList.mockResolvedValueOnce([
      partida({ id_partida_estudiante: 4, revision_disponible: false }),
    ])
    render(<GradesPage />)
    const button = await screen.findByRole('button', { name: 'Ver revisión' })
    expect(button).toBeDisabled()
  })

  it('averages the score across all attempts shown, not just the best per quiz', async () => {
    historyService.getList.mockResolvedValueOnce([
      partida({ id_partida_estudiante: 1, respuestas_correctas: 5 }),
      partida({ id_partida_estudiante: 2, respuestas_correctas: 8 }),
    ])
    render(<GradesPage />)
    expect(await screen.findByText('6.5 / 10')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Correr los tests y confirmar que fallan**

Run: `npx vitest run src/tests/pages/GradesPage.test.jsx`
Expected: FAIL — hoy `GradesPage` deduplica por cuestionario (1 fila, no 2), ignora `materiaId`, no tiene columna Revisión ni botón "Ver revisión".

- [ ] **Step 3: Reescribir `GradesPage.jsx`**

Reemplaza todo el archivo `src/pages/grades/GradesPage.jsx`:

```jsx
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Alert, Chip, IconButton, Tooltip,
} from '@mui/material'
import GradeIcon from '@mui/icons-material/Grade'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { historyService } from '../../services/historyService'
import { useAuthStore } from '../../stores/useAuthStore'

function calcNota(correctas, total) {
  if (!total) return 0
  return Math.round((correctas / total) * 10 * 10) / 10
}

function notaColor(nota) {
  if (nota >= 7) return 'success'
  if (nota >= 5) return 'warning'
  return 'error'
}

export default function GradesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const materiaId = searchParams.get('materiaId')
  const nombre = useAuthStore((s) => s.nombre)
  const apellidoPaterno = useAuthStore((s) => s.apellidoPaterno)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    historyService.getList(materiaId)
      .then((historial) => {
        const list = historial
          .map((p) => {
            const prueba = p.tbl_t_partida?.tbl_t_prueba
            const total = prueba?._count?.tbl_t_pregunta ?? 0
            const correctas = p.respuestas_correctas ?? 0
            return {
              id: p.id_partida_estudiante,
              titulo: prueba?.titulo ?? 'Cuestionario',
              nota: calcNota(correctas, total),
              fecha: p.fecha_creacion,
              revisionDisponible: p.revision_disponible ?? false,
            }
          })
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        setQuizzes(list)
      })
      .catch(() => setError('No se pudo cargar las calificaciones.'))
      .finally(() => setLoading(false))
  }, [materiaId])

  const promedio = quizzes.length
    ? Math.round((quizzes.reduce((acc, q) => acc + q.nota, 0) / quizzes.length) * 10) / 10
    : null

  const displayName = [nombre, apellidoPaterno].filter(Boolean).join(' ')

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  )

  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <GradeIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>Mis Calificaciones</Typography>
      </Box>

      {displayName && (
        <Typography variant="body2" color="text.secondary" mb={3}>
          Estudiante: <strong>{displayName}</strong>
        </Typography>
      )}

      {quizzes.length === 0 ? (
        <Typography color="text.secondary">
          No tienes cuestionarios registrados aún.
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                    Cuestionario
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }} align="center">
                    Fecha
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }} align="center">
                    Nota
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }} align="center">
                    Revisión
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quizzes.map((q) => (
                  <TableRow
                    key={q.id}
                    sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{q.titulo}</TableCell>
                    <TableCell align="center" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      {new Date(q.fecha).toLocaleDateString('es-EC', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${q.nota} / 10`}
                        color={notaColor(q.nota)}
                        size="small"
                        sx={{ fontWeight: 700, minWidth: 72 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={q.revisionDisponible ? 'Ver revisión' : 'Revisión no habilitada por el docente'}>
                        <span>
                          <IconButton
                            size="small"
                            disabled={!q.revisionDisponible}
                            onClick={() => navigate(`/grades/${q.id}`)}
                            aria-label="Ver revisión"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'grey.50',
            }}
          >
            <Typography fontWeight={600} color="text.secondary">
              Promedio final
            </Typography>
            <Chip
              label={`${promedio} / 10`}
              color={notaColor(promedio)}
              sx={{ fontWeight: 700, fontSize: '1rem', px: 1 }}
            />
          </Box>
        </>
      )}
    </Box>
  )
}
```

- [ ] **Step 4: Correr los tests y confirmar que pasan**

Run: `npx vitest run src/tests/pages/GradesPage.test.jsx`
Expected: PASS (5 tests)

- [ ] **Step 5: Correr toda la suite y el lint como chequeo de regresión**

Run: `npm run test && npm run lint`
Expected: todos los tests pasan (incluyendo `useGameStore.test.js` y el resto sin relación con este cambio); sin errores de lint.

- [ ] **Step 6: Commit**

```bash
git add src/pages/grades/GradesPage.jsx src/tests/pages/GradesPage.test.jsx
git commit -m "feat: GradesPage lista un intento por fila con columna de revision"
```
