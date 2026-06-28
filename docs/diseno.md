# Sistema de diseño

## Paleta de colores principal

| Token | Valor | Uso |
|---|---|---|
| Azul oscuro | `#1565c0` | Inicio del gradiente, botones primarios |
| Violeta medio | `#7c3aed` | Centro del gradiente, acentos |
| Lila | `#a855f7` | Fin del gradiente, glows, chips |
| Blanco translúcido | `rgba(255,255,255,0.12)` | Fondo glassmorphism (desktop) |
| Blanco opaco | `rgba(255,255,255,0.88)` | Fondo glassmorphism (mobile) |

## Gradiente de fondo global

Usado en `JoinPage`, `HomePage` y `WaitingRoom`:

```css
background: linear-gradient(135deg, #1565c0 0%, #7c3aed 55%, #a855f7 100%);
```

## Glassmorphism (efecto vidrio)

Patrón aplicado en cards y formularios. Se adapta según dispositivo:

```js
// Desktop (md+)
background: 'rgba(255,255,255,0.12)',
backdropFilter: 'blur(16px)',
border: '1px solid rgba(255,255,255,0.25)',
borderRadius: '20px',

// Mobile (xs)
background: 'rgba(255,255,255,0.88)',
backdropFilter: 'none',  // Sin blur en mobile por performance
```

> **Por qué sin blur en mobile:** `backdrop-filter` es costoso en dispositivos de baja potencia y puede causar lag. En mobile se usa un fondo blanco semi-opaco que logra el mismo efecto visual sin costo de rendimiento.

## Navbar (Layout)

```js
background: 'rgba(10, 14, 39, 0.88)',
backdropFilter: 'blur(12px)',
borderBottom: '1px solid rgba(255,255,255,0.08)',
```

## Gradiente de botón primario

```css
background: linear-gradient(135deg, #a855f7, #7c3aed, #1565c0);
borderRadius: 12px;
boxShadow: 0 4px 24px rgba(124, 58, 237, 0.4);
```

Hover: `translateY(-2px)` + sombra intensificada.

## Blobs de fondo (ScienceBackground)

Tres círculos con `blur` extremo que crean el efecto de "aurora":

| Blob | Color | Posición | Tamaño |
|---|---|---|---|
| Violeta | `#7c3aed` | Top-right | 500×500px |
| Azul | `#1565c0` | Bottom-left | 400×400px |
| Lila | `#a855f7` | Centro | 350×350px |

Todos con `filter: blur(100–120px)` y `opacity: 0.3–0.5`.

## Átomo decorativo (ScienceBackground)

SVG inline de 300×300 posicionado en el lado derecho. Contiene:
- Núcleo: `circle r=12, fill=white`
- 3 elipses orbitales: `rx=120 ry=45`, rotadas 0°, 60° y 120°
- 3 electrones de color (`#a855f7`, `#7c3aed`)
- Filtro: `drop-shadow(0 0 24px rgba(168,85,247,0.6))`

## Patrón SVG repetido

Mosaico de 120×120px repetido en todo el fondo con `opacity: 0.12`. Contiene: átomo, hoja, molécula y planeta.

## Animaciones

### `fadeSlideUp` — entrada de elementos

```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Aplicada con `animation-delay` escalonado: título (0s), subtítulo (0.1s), card (0.2s).

### `float` — mascota tierra kawaii

```css
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%       { transform: translateY(-14px) rotate(2deg); }
}
```

Duración: `3.4s ease-in-out infinite`.

## OTP Input (JoinPage)

Las 6 cajitas del código de sala siguen este esquema visual:

| Estado | Border | Background | Shadow |
|---|---|---|---|
| Vacío | `rgba(255,255,255,0.25)` | Translúcido | Ninguna |
| Enfocado | `rgba(255,255,255,0.85)` | Blanco 16% | `0 0 0 3px rgba(255,255,255,0.18)` |
| Lleno | `rgba(168,85,247,0.8)` | Violeta 20% | `0 0 14px rgba(168,85,247,0.35)` |

## Responsive

| Breakpoint | Estrategia |
|---|---|
| `xs` (< 600px) | Cards en blanco opaco, glassmorphism desactivado, decoraciones ocultas, mascota inline debajo del form |
| `sm` (≥ 600px) | Glassmorphism activado, decoraciones visibles, mascota en posición absoluta |
| `md` (≥ 900px) | Tamaños máximos de ilustraciones y textos |
