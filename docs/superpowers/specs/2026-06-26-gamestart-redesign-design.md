---
name: gamestart-redesign
description: Rediseño visual y gamificado de la pantalla GameStart con animaciones kawaii y consistencia con el design system existente
metadata:
  type: project
---

# GameStart Redesign — Diseño Visual Gamificado

## Contexto

`GameStart.jsx` es una pantalla de transición que se muestra al alumno cuando el docente inicia la prueba. Su duración es variable (controlada por el docente). Actualmente es un componente mínimo: texto plano + `CircularProgress` sin estilo. El resto de la app (WaitingRoom, JoinPage) ya tiene un design system definido con gradiente azul-violeta, glassmorphism y animaciones.

## Objetivo

Hacer la pantalla visualmente atractiva y gamificada, coherente con el estilo existente, sin sobrecargar (el alumno la verá pocos segundos). Enfoque: "bonita pero normal".

## Estilo aplicado (consistencia con design system)

- **Fondo:** `position: fixed, inset: 0` con gradiente `linear-gradient(135deg, #1565c0 0%, #7c3aed 55%, #a855f7 100%)`
- **Componente decorativo:** `ScienceBackground` (ya usado en WaitingRoom y JoinPage)
- **Tarjeta central:** glassmorphism — `background: rgba(255,255,255,0.12)`, `backdropFilter: blur(16px)`, `border: 1px solid rgba(255,255,255,0.25)`, `borderRadius: 20px`
- **Tipografía:** blanca sobre fondo oscuro, con `textShadow` para legibilidad
- **Animaciones:** keyframes de `@emotion/react`, reutilizando `fadeSlideUp` y `float` de JoinPage

## Elementos visuales

### Ilustración flotante
- `cute-earth.svg` posicionada en la esquina inferior izquierda (desktop) / debajo de la tarjeta (mobile)
- Animación `float` en loop infinito (3.4s ease-in-out) — idéntica a JoinPage
- `display: { xs: 'none', sm: 'block' }` en desktop, visible en mobile debajo del card

### Partículas de fondo
- 4 puntos pequeños (`Box` de 6–10px, `borderRadius: '50%'`) distribuidos en posiciones absolutas aleatorias
- Cada uno con variación de `float` animado a distinto delay y duración (2.8s – 4.2s)
- Color: `rgba(255,255,255,0.4)` o `rgba(168,85,247,0.6)` — sutil, no distrae

### Tarjeta central (glassmorphism)
Contenido con animaciones `fadeSlideUp` escalonadas:

| Delay | Elemento |
|-------|----------|
| 0s    | Emoji 🚀 — `fontSize: '3rem'`, entrada inmediata |
| 0.1s  | "¡La prueba comienza!" — `variant="h3"`, `fontWeight: 700`, blanco |
| 0.2s  | `{quizTitle}` — `variant="h5"`, `rgba(255,255,255,0.9)` |
| 0.3s  | `{totalPreguntas} preguntas · ¡Prepárate!` — `variant="body1"`, `rgba(255,255,255,0.75)` |
| 0.4s  | Indicador de carga animado (3 puntos pulsantes) |

### Indicador de carga
Reemplaza el `CircularProgress` plano por tres puntos (`●`) con animación `pulse` en keyframe escalonada (cada punto tiene un delay distinto: 0s, 0.16s, 0.32s), simulando un efecto "...". Color: `rgba(255,255,255,0.9)`. Tamaño: `fontSize: '1.5rem'`, separados con `gap: 1`.

## Keyframes necesarios

```js
// Reutilizar de JoinPage (definir localmente en GameStart.jsx)
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%       { transform: translateY(-14px) rotate(2deg); }
`

// Nuevo para los puntos de carga
const pulse = keyframes`
  0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
  40%           { opacity: 1;   transform: scale(1.2); }
`
```

## Props del componente (sin cambios)

```jsx
GameStart({ quizTitle, totalPreguntas })
```

Los props existentes se conservan. No se requieren nuevos.

## Archivos a modificar

- `src/features/game/states/GameStart.jsx` — reescritura completa del JSX y estilos

## Archivos NO modificados

- `ScienceBackground.jsx` — se importa y usa igual que en WaitingRoom
- `cute-earth.svg` — se importa igual que en JoinPage
- Ningún otro game state se toca
