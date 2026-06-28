# Tecnologías utilizadas

## Runtime y build

| Tecnología | Versión | Rol |
|---|---|---|
| **React** | 19.x | Framework de UI — componentes, hooks, estado local |
| **Vite** | 8.x | Build tool y dev server — HMR, bundling, assets |
| **Node.js** | ≥ 18 | Entorno de ejecución para el tooling |

## UI y estilos

| Tecnología | Versión | Rol |
|---|---|---|
| **Material UI (MUI)** | 9.x | Librería de componentes: `Box`, `Typography`, `Button`, `Chip`, `TextField`, `AppBar`, etc. |
| **@emotion/react** | 11.x | Motor CSS-in-JS de MUI. Se usa directamente para `keyframes` (animaciones CSS declarativas) |
| **@emotion/styled** | 11.x | Componentes con estilos embebidos (peer dependency de MUI) |
| **@mui/icons-material** | 9.x | Iconos SVG como componentes React (`SportsEsportsIcon`, `PeopleIcon`, `ScienceIcon`, etc.) |

> **Nota sobre `keyframes`:** Para animaciones (float de la tierra, fade-slide-up de entrada) se importa `keyframes` directamente de `@emotion/react` y se aplica en la prop `sx` de los componentes MUI.

## Navegación

| Tecnología | Versión | Rol |
|---|---|---|
| **React Router DOM** | 6.x | Enrutamiento SPA: rutas, navegación programática, `useParams`, `useNavigate` |

## Comunicación con el servidor

| Tecnología | Versión | Rol |
|---|---|---|
| **Axios** | 1.x | Cliente HTTP para llamadas REST (autenticación, historial, pre-join) |
| **Socket.io-client** | 4.x | Comunicación en tiempo real (WebSocket) para el flujo del juego en vivo |

## Estado global

| Tecnología | Versión | Rol |
|---|---|---|
| **Zustand** | 5.x | Store global liviano. Dos stores: `useAuthStore` (sesión y datos del estudiante) y `useGameStore` (estado del juego en curso) |

## Formularios y validación

| Tecnología | Versión | Rol |
|---|---|---|
| **React Hook Form** | 7.x | Manejo de formularios con bajo re-render |
| **Zod** | 4.x | Validación de esquemas (schemas tipados) |
| **@hookform/resolvers** | 5.x | Integración entre React Hook Form y Zod |

## Autenticación

| Tecnología | Versión | Rol |
|---|---|---|
| **jwt-decode** | 4.x | Decodificación del JWT recibido del gateway para extraer datos del usuario |

## Notificaciones

| Tecnología | Versión | Rol |
|---|---|---|
| **notistack** | 3.x | Snackbars y notificaciones toast |

## Testing

| Tecnología | Versión | Rol |
|---|---|---|
| **Vitest** | 4.x | Test runner compatible con Vite |
| **@testing-library/react** | 16.x | Renderizado y queries de componentes para tests |
| **@testing-library/user-event** | 14.x | Simulación de eventos de usuario (click, tipo, etc.) |
| **@testing-library/jest-dom** | 6.x | Matchers adicionales para el DOM |
| **jsdom** | 29.x | Entorno DOM simulado para los tests |

## Linting y calidad

| Tecnología | Rol |
|---|---|
| **ESLint 10** | Análisis estático de código |
| **eslint-plugin-react-hooks** | Reglas para hooks de React |
| **eslint-plugin-react-refresh** | Compatibilidad con HMR de Vite |

## Ilustraciones

Las ilustraciones decorativas son archivos **SVG** estáticos dibujados a mano (sin librería externa). Se ubican en `src/assets/illustrations/` y se importan como URLs de imagen con Vite:

```js
import cuteEarth from '../../assets/illustrations/cute-earth.svg'
// Se usa como: <img src={cuteEarth} />
```
