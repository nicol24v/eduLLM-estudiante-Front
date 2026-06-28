# Componentes y páginas

## Componentes compartidos

### `Layout` — `src/components/Layout.jsx`

Navbar global de la aplicación.

**Props:** `children` (contenido de la página)

**Estructura:**
- `AppBar` con glassmorphism oscuro (`rgba(10,14,39,0.88)`)
- Logo "EduQuiz" con icono `ScienceIcon` en violeta — navega a `/`
- Botones de navegación tipo pill (border-radius 24px) — actualmente: Historial
- Nombre del usuario en la derecha
- Botón "Cerrar sesión" → llama al gateway y limpia el store

**Notas:**
- El array `NAV_ITEMS` permite añadir más ítems de navegación sin modificar el JSX
- En mobile (xs), los labels de los botones se ocultan y solo se muestra el ícono

---

### `ScienceBackground` — `src/components/ScienceBackground.jsx`

Fondo decorativo reutilizable. Se coloca como primer hijo de cualquier página que use el gradiente azul-violeta.

**Props:** ninguna

**Elementos:**
1. 3 blobs circulares con blur (aurora borealis)
2. Patrón SVG repetido con iconos de ciencias (opacidad 12%)
3. Átomo SVG decorativo en el lado derecho (visible desde `sm`)

**Uso:**
```jsx
import ScienceBackground from '../../components/ScienceBackground'

<Box sx={{ position: 'relative', ... }}>
  <ScienceBackground />
  {/* contenido de la página */}
</Box>
```

**Páginas que lo usan:** `JoinPage`, `HomePage`, `WaitingRoom`

---

## Páginas

### `JoinPage` — `src/pages/join/JoinPage.jsx`

Página donde el estudiante ingresa el código de sala para unirse a un cuestionario.

**Ruta:** `/join`

**Funcionalidades:**
- Input de código dividido en **6 cajitas OTP** individuales
- Auto-avance al siguiente campo al escribir
- Retroceso al campo anterior con Backspace si el campo está vacío
- Soporte para **pegar** (Ctrl+V) un código completo de 6 caracteres
- Navegación con teclas de flecha (← →)
- Botón "Unirse" activo solo cuando los 6 dígitos están completos
- Manejo de errores: sala no encontrada, prueba ya iniciada, sin matrícula

**Decoraciones visuales:**
- `ScienceBackground` (blobs + patrón + átomo derecha)
- 5 átomos adicionales en las esquinas y centro-izquierda (visible desde `sm`)
- Tierra kawaii flotante:
  - **Desktop (sm+):** absoluta, esquina inferior-izquierda
  - **Mobile (xs):** inline, centrada debajo del formulario

**Animaciones de entrada:**
```
título      → fadeSlideUp, delay 0s
subtítulo   → fadeSlideUp, delay 0.1s
card/form   → fadeSlideUp, delay 0.2s
tierra      → float, infinite
```

**Estado local:**
- `chars: string[]` — array de 6 caracteres del código
- `error: string` — mensaje de error de la API
- `loading: boolean` — estado de la petición

---

### `HomePage` — `src/pages/home/HomePage.jsx`

Dashboard del estudiante autenticado.

**Ruta:** `/`

**Contenido:**
- Saludo personalizado con el nombre del estudiante
- Botón para ir a `/join`
- Cards con promedios por materia (cargados desde la API)

---

### `WaitingRoom` — `src/features/game/states/WaitingRoom.jsx`

Pantalla de espera mientras el profesor inicia la prueba.

**Props:**
- `players: Array<{ playerId, nickname }>` — lista de jugadores conectados
- `code: string` — código de sala

**Diseño:**
- `position: fixed, inset: 0, zIndex: 10` — cubre toda la pantalla sin afectar otros estados del juego
- Gradiente azul-violeta idéntico a `JoinPage`/`HomePage`
- `ScienceBackground` con blobs y átomo
- Card glassmorphism central con:
  - Chip con el código de sala
  - Texto "Esperando que el profesor inicie..."
  - `CircularProgress` (spinner)
  - Lista de participantes como chips

> **Por qué `position: fixed`:** `WaitingRoom` se renderiza dentro de `GamePage` que usa un `Container` con fondo propio (`#e3f2fd`). Al usar `fixed`, WaitingRoom "escapa" del contenedor y cubre la pantalla completa sin necesidad de modificar `GamePage`, lo que evita afectar el resto de los estados del juego.

---

### `GamePage` — `src/pages/game/GamePage.jsx`

Orquestador del flujo de juego. Renderiza el estado correcto según `useGameStore`.

**Ruta:** `/game/:code`

**Estados del juego:**

| Estado | Componente | Fondo |
|---|---|---|
| `SHOW_ROOM` | `WaitingRoom` | Manejado por WaitingRoom (fixed) |
| `SHOW_START` | `GameStart` | `#1a237e` |
| `SHOW_PREPARED` | `Prepared` | `#1a237e` |
| `SHOW_QUESTION` | `Question` | `#121212` |
| `SELECT_ANSWER` | `Answers` | `#121212` |
| `POST_ANSWER` | `PostAnswer` | `#212121` |
| `SHOW_LEADERBOARD` | `Leaderboard` | `#1a237e` |
| `FINISHED` | `FinalResults` | `#f5f5f5` |

---

## Stores (Zustand)

### `useAuthStore` — `src/stores/useAuthStore.js`

| Campo | Tipo | Descripción |
|---|---|---|
| `token` | string | JWT del estudiante |
| `nombre` | string | Primer nombre |
| `apellidoPaterno` | string | Apellido |
| `idEstudianteMateria` | number | ID de materia del estudiante |
| `logout()` | fn | Limpia el store |
| `setPreJoinData()` | fn | Guarda datos del pre-join |

### `useGameStore` — `src/stores/useGameStore.js`

Maneja el estado en tiempo real del juego: `status`, `leaderboard`, `myAnswer`, `myPosition`, `quizTitle`, `totalPreguntas`.

---

## Hooks personalizados

### `usePlayerSocket` — `src/hooks/usePlayerSocket.js`

Conecta al WebSocket del juego. Escucha eventos del servidor y actualiza `useGameStore`. Expone `sendAnswer` y `leaveRoom`.

### `useGameAudio` — `src/hooks/useGameAudio.js`

Reproduce sonidos según el estado del juego (música, efectos de respuesta correcta/incorrecta, resultado final).
