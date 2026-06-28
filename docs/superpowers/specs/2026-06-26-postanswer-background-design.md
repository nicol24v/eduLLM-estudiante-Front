---
name: postanswer-background
description: Reemplazar el fondo negro de POST_ANSWER por un gradiente azul-violeta de pantalla completa, igual que GameStart y WaitingRoom, sin tocar GamePage ni ninguna variable de estado
metadata:
  type: project
---

# PostAnswer Background — Gradiente Pantalla Completa

## Contexto

`PostAnswer.jsx` actualmente renderiza un card centrado dentro del fondo `#212121` que `GamePage` aplica al estado `POST_ANSWER`. El usuario quiere un fondo azul-celeste degradado idéntico al de `JoinPage`, `WaitingRoom` y `GameStart`.

## Cambio

Envolver el JSX de `PostAnswer.jsx` en un `Box` de pantalla completa (`position: fixed, inset: 0, zIndex: 10`) con el mismo gradiente y `ScienceBackground` que usan `WaitingRoom` y `GameStart`. El contenido interior (card glassmorphism, emojis, datos) no se modifica.

## Archivo modificado

- `src/features/game/states/PostAnswer.jsx` — añadir capa exterior de pantalla completa

## Archivos NO modificados

- `src/pages/game/GamePage.jsx` — sin cambios
- Ninguna variable de estado, store, audio ni lógica

## Especificación del wrapper

```jsx
<Box
  sx={{
    position: 'fixed',
    inset: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1565c0 0%, #7c3aed 55%, #a855f7 100%)',
    overflow: 'hidden',
    px: 2,
  }}
>
  <ScienceBackground />
  <Box sx={{ position: 'relative', zIndex: 3, width: '100%', maxWidth: 480 }}>
    {/* contenido existente: card + sección inferior */}
  </Box>
</Box>
```

Import añadido: `ScienceBackground` de `'../../../components/ScienceBackground'`.
