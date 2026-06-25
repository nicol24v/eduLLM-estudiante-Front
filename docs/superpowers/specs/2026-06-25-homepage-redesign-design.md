# Homepage Redesign — EduQuiz Estudiante Front
**Date:** 2026-06-25
**Scope:** `HomePage.jsx`, `Layout.jsx` (navbar)

---

## Objetivo

Rediseñar la interfaz principal que ve el estudiante al ingresar a la plataforma. El diseño debe ser moderno, llamativo para estudiantes de colegio, con inspiración en plataformas como Wayground/Quizizz y Kahoot, pero usando la identidad propia: tonos azul/lila con gradientes y elementos decorativos de ciencias naturales.

---

## Decisiones de diseño tomadas

| Pregunta | Decisión |
|---|---|
| Elementos de ciencias | Mixto: patrón sutil de fondo + 1-2 acentos ilustrados |
| Navbar | Rediseñada con estilo Kahoot (pills de colores) |
| Rama científica | General/mixto (átomo, hoja, planeta, molécula) |
| Distribución de stats | Opción A: todo dentro del hero sobre el mismo fondo gradiente |
| Enfoque visual | Enfoque 2 "Aurora Borealis" con glassmorphism simplificado en mobile |

> **Nota:** La distribución A (stats dentro del hero) es la base inicial y puede cambiarse sin afectar el sistema de colores ni los componentes de navegación.

---

## Sistema de Color

### Gradiente principal del hero
```
direction: 135deg (diagonal)
#1565c0  →  #7c3aed  →  #a855f7
azul eléctrico → violeta → lila
```

### Blobs de profundidad
- 2–3 círculos grandes con `filter: blur(80–120px)`, posicionados en esquinas
- Colores: variaciones más oscuras/claras del gradiente
- Opacidad: 40–60%
- `position: absolute`, `pointer-events: none`, `z-index: 0`

### Patrón científico de fondo
- SVG inline con íconos de: átomo, hoja/planta, molécula, planeta pequeño
- Color: blanco al **12% de opacidad**
- Se repite como textura (`background-repeat: repeat` o pattern SVG)
- `z-index: 1`

### Acentos ilustrados (escritorio y tablet)
- **Izquierda:** silueta grande de hoja/planta, blanca al **20% de opacidad**, `position: absolute`, `left: 0`, centrada verticalmente
- **Derecha:** átomo con anillos orbitales + halo de brillo lila/blanco, `position: absolute`, `right: 0`
- **Mobile:** `display: none` en breakpoint `xs` (< 600px)

---

## Navbar (`Layout.jsx`)

### Fondo
```css
background: rgba(10, 14, 39, 0.88);
backdrop-filter: blur(12px);
```

### Logo "EduQuiz"
- Texto blanco, bold
- Pequeño ícono de átomo o microscopio antes del texto (MUI Icon o SVG)
- Clickeable → `/`

### Botones de navegación (pill shape)
| Slot | Ruta | Color de fondo | Ícono MUI |
|---|---|---|---|
| 1 | `/history` | `#1e40af` (azul) | `BarChartIcon` |
| 2 *(futuro)* | TBD | `#6d28d9` (violeta) | TBD |
| 3 *(futuro)* | TBD | `#9333ea` (lila) | TBD |

- `border-radius: 24px`
- Padding: `px: 2, py: 0.75`
- Texto blanco, `font-weight: 600`
- Hover: `filter: brightness(1.2)`, transición suave `0.2s`

### Lado derecho
- Nombre del usuario: blanco al 80%, `variant="body2"`
- Botón "Cerrar sesión": outline blanco (sin relleno)

### Responsive navbar
| Breakpoint | Comportamiento |
|---|---|
| Desktop (≥900px) | Ícono + texto en cada pill |
| Tablet (600–900px) | Ícono + texto corto |
| Mobile (<600px) | Solo ícono, sin texto; nombre de usuario oculto |

---

## Hero — Contenido (`HomePage.jsx`)

### Dimensiones
- Desktop/tablet: `min-height: calc(100vh - 64px)` (descuenta navbar)
- Mobile: `min-height: 100dvh` con padding-top para la navbar

### Capas (z-index)
```
z-index 0: blobs de color
z-index 1: patrón SVG científico
z-index 2: acentos ilustrados (hoja + átomo)
z-index 3: contenido central
```

### Contenido central

**1. Saludo**
- Desktop: `variant="h3"`, blanco, bold, `text-shadow: 0 2px 12px rgba(0,0,0,0.3)`
- Mobile: `variant="h5"`

**2. Subtítulo**
- `"Ingresa el código de sala que te compartió tu profesor"`
- Blanco al 80%, `variant="body1"`

**3. Card glassmorphism "Unirse a sala"**
```
Desktop:
  background: rgba(255, 255, 255, 0.12)
  border: 1px solid rgba(255, 255, 255, 0.25)
  backdrop-filter: blur(16px)
  border-radius: 20px
  padding: 40px 48px
  width: ~480px

Mobile (<600px):
  background: rgba(255, 255, 255, 0.88)  ← sin blur
  backdrop-filter: none
  width: 90vw
  padding: 24px
```

**Botón "Unirse a sala" dentro de la card:**
- Gradiente lila → azul como fondo del botón
- `startIcon={<SportsEsportsIcon />}`
- `border-radius: 12px`
- `py: 2`, ancho completo dentro de la card
- Hover: `transform: translateY(-2px)`, `box-shadow` suave

**4. Stats cards (promedio por materia)**
- Mismo sistema glassmorphism que la card principal pero más compactas
- Grid: 2 columnas en desktop/tablet, 1 columna en mobile
- Contenido: nombre de materia + puntaje grande en blanco + cantidad de cuestionarios
- Clickeable → `/history?materiaId={id}`
- Aparecen solo si `stats.length > 0`

---

## Responsive — Resumen

| Elemento | Desktop ≥900px | Tablet 600–900px | Mobile <600px |
|---|---|---|---|
| Hero height | `calc(100vh - 64px)` | `calc(100vh - 64px)` | `100dvh` |
| Saludo | `h3` (2rem) | `h4` | `h5` (1.5rem) |
| Card ancho | ~480px fijo | 70vw | 90vw |
| Card glass | blur(16px) | blur(16px) | opaco sin blur |
| Stats grid | 2 columnas | 2 columnas compactas | 1 columna |
| Acentos ilustrados | visibles | 60% tamaño | ocultos |
| Navbar pills | ícono + texto | ícono + texto corto | solo ícono |

---

## Archivos a modificar

| Archivo | Cambios |
|---|---|
| `src/components/Layout.jsx` | Rediseño completo del navbar |
| `src/pages/home/HomePage.jsx` | Rediseño completo del hero y contenido |
| `src/index.css` | Posibles variables CSS globales para el gradiente |

## Archivos a crear (opcionales)

| Archivo | Propósito |
|---|---|
| `src/components/ScienceBackground.jsx` | Componente reutilizable con blobs + patrón SVG + acentos |

---

## Restricciones técnicas

- Stack: React + MUI v5 + TailwindCSS
- Framer Motion **no está instalado** — usar exclusivamente CSS transitions y `sx` de MUI para animaciones
- Los íconos decorativos deben ser SVG inline o MUI Icons — no imágenes externas
- El glassmorphism en mobile debe desactivarse para no afectar rendimiento en dispositivos Android de gama baja
