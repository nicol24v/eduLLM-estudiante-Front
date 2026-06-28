# Spec: Rediseño de botones de respuesta y fuente gamificada

**Fecha:** 2026-06-27  
**Estado:** Aprobado

## Objetivo

Corregir la distribución desigual de los botones de respuesta en la pantalla de pregunta/respuesta, rediseñarlos con estilo 3D gamificado (referencia: botón "Again"), y aplicar una fuente gamificada a toda la pantalla de juego.

## Contexto

- `AnswerButton.jsx` no tiene altura fija — el botón crece con el texto, creando filas desiguales.
- `Answers.jsx` y `Question.jsx` usan `xs={12} sm={6}` en el Grid, causando que en pantallas pequeñas los botones se apilen en 1 columna en lugar de 2x2.
- La app no tiene fuente gamificada — usa la fuente por defecto de MUI (Roboto).

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `index.html` | Importar Google Fonts (Fredoka One + Nunito) |
| `src/features/game/components/AnswerButton.jsx` | Estilo 3D + `height: '100%'` + fuente |
| `src/features/game/states/Answers.jsx` | Grid `xs={6}` + `alignItems="stretch"` |
| `src/features/game/states/Question.jsx` | Grid `xs={6}` + `alignItems="stretch"` |
| `src/pages/game/GamePage.jsx` | `fontFamily` en el Box raíz del juego |

## Diseño detallado

### 1. Fuente gamificada

**Import en `index.html`** (dentro de `<head>`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;800&display=swap" rel="stylesheet">
```

- **Principal:** `Fredoka One` — redondeada, bold, estilo game.
- **Secundaria:** `Nunito` — redondeada y amigable, carga si Fredoka falla.
- **Fallback sistema:** `cursive`.

**Aplicación en `GamePage.jsx`** — agregar `fontFamily` al `<Box>` raíz:
```js
fontFamily: "'Fredoka One', 'Nunito', cursive"
```
Solo afecta la pantalla de juego; el resto de la app mantiene su fuente.

### 2. Botón 3D (AnswerButton.jsx)

**Arrays de colores** (los colores base no cambian — se añaden tono claro y oscuro para el efecto 3D):
```js
const COLORS       = ['#e53935', '#1e88e5', '#f9a825', '#43a047']
const COLORS_DARK  = ['#b71c1c', '#1565c0', '#f57f17', '#2e7d32']
const COLORS_LIGHT = ['#ef5350', '#42a5f5', '#ffca28', '#66bb6a']
```

**Estilo del botón:**
```js
sx={{
  background: `linear-gradient(to bottom, ${colorLight} 0%, ${color} 70%)`,
  boxShadow: `0 6px 0 ${colorDark}, 0 8px 12px rgba(0,0,0,0.25)`,
  borderRadius: '14px',
  border: selected ? '3px solid white' : '3px solid transparent',
  color: 'white',
  fontWeight: 700,
  fontSize: '1rem',
  fontFamily: "'Fredoka One', 'Nunito', cursive",
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
```

### 3. Grid 2x2 siempre (Answers.jsx y Question.jsx)

Cambio idéntico en ambos archivos — en el `<Grid container>` y cada `<Grid item>`:

```jsx
{/* antes */}
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>

{/* después */}
<Grid container spacing={2} alignItems="stretch">
  <Grid item xs={6}>
```

Con `height: '100%'` en el botón, cada fila de 2 botones tendrá la misma altura aunque el texto de uno sea más largo.

## Restricciones

- No cambiar props, callbacks, ni lógica de `AnswerButton` (`onClick`, `disabled`, `selected`, `index`, `label`).
- No tocar `useGameStore`, `usePlayerSocket` ni ningún hook/store.
- La fuente solo aplica dentro de `GamePage` — no afecta el resto de la app.

## Criterios de éxito

- Los 4 botones forman siempre un grid 2x2 sin importar el largo del texto.
- Los botones tienen igual altura en cada fila.
- El efecto 3D (profundidad inferior + gradiente) es visible con cada color.
- Al presionar un botón se aprecia el efecto de "hundirse".
- La fuente gamificada aparece en todos los textos de la pantalla de juego.
- El resto de la app (JoinPage, homepage, etc.) no cambia de fuente.
