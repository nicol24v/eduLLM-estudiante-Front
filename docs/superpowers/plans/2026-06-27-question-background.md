# Question Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar la imagen `fondo-cuest.jpg` como fondo con overlay semitransparente en las pantallas de pregunta y respuesta del juego.

**Architecture:** Se modifica únicamente `GamePage.jsx`, que ya centraliza los fondos por estado mediante el objeto `STATE_BG`. Se añade un boolean `isQuestionState` y se aplica la imagen + overlay vía CSS en el `<Box>` raíz de forma condicional; el resto de estados no cambia.

**Tech Stack:** React, MUI (`Box`), Vite (asset import con hash automático).

## Global Constraints

- Solo modificar `src/pages/game/GamePage.jsx` — ningún otro archivo.
- La imagen ya existe en `src/assets/fondo-cuest.jpg`.
- El overlay debe ser `rgba(10, 10, 30, 0.60)` para mantener legibilidad.
- Los estados afectados son únicamente `SHOW_QUESTION` y `SELECT_ANSWER`.

---

### Task 1: Aplicar fondo de imagen en GamePage

**Files:**
- Modify: `src/pages/game/GamePage.jsx`

**Interfaces:**
- Consumes: `src/assets/fondo-cuest.jpg` (imagen ya existente)
- Produces: Fondo de imagen visible en estados `SHOW_QUESTION` y `SELECT_ANSWER`

- [ ] **Step 1: Agregar el import de la imagen**

Abrir `src/pages/game/GamePage.jsx`. En la línea 1 (antes del primer import existente) agregar:

```js
import fondoCuest from '../../assets/fondo-cuest.jpg'
```

- [ ] **Step 2: Agregar la variable `isQuestionState`**

Dentro del componente `GamePage`, justo después de la desestructuración del store (línea ~42), agregar:

```js
const isQuestionState = status === 'SHOW_QUESTION' || status === 'SELECT_ANSWER'
```

- [ ] **Step 3: Modificar el `<Box>` raíz para aplicar el fondo condicionalmente**

Localizar el `return` del componente. El `<Box>` raíz actualmente es:

```jsx
<Box sx={{ minHeight: '100vh', bgcolor: bg, color, transition: 'background-color 0.4s' }}>
```

Reemplazarlo por:

```jsx
<Box sx={{
  minHeight: '100vh',
  color,
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
```

- [ ] **Step 4: Verificar visualmente en el navegador**

Con el servidor de desarrollo corriendo (`npm run dev` en puerto 8003), unirse a una sesión de juego activa y navegar hasta la pantalla de pregunta/respuesta.

Verificar:
- La imagen del aula se ve detrás del contenido.
- El overlay oscuro hace legible el texto blanco de la pregunta.
- Los botones de respuesta (rojo, azul, amarillo, verde) mantienen sus colores vivos.
- Las demás pantallas (`WaitingRoom`, `GameStart`, `Leaderboard`, etc.) no cambian.

- [ ] **Step 5: Commit**

```bash
git add src/pages/game/GamePage.jsx
git commit -m "feat: add classroom background image to question/answer screens"
```
