# Documentación — EduQuiz Estudiante Frontend

Documentación técnica del frontend del estudiante para la plataforma **EduQuiz** (`eduLLM-Estudiante-Front`).

---

## Índice

| Archivo | Contenido |
|---|---|
| [tecnologias.md](./tecnologias.md) | Stack técnico, dependencias y herramientas |
| [diseno.md](./diseno.md) | Sistema de diseño: colores, gradientes, glassmorphism, animaciones |
| [componentes.md](./componentes.md) | Documentación de componentes y páginas |
| [ilustraciones.md](./ilustraciones.md) | Guía de ilustraciones SVG reutilizables |

---

## Descripción del proyecto

Aplicación web SPA (Single Page Application) que permite a los estudiantes:
- Iniciar sesión via OAuth (redireccionado por el gateway)
- Unirse a una sala de juego ingresando un código de 6 caracteres
- Participar en tiempo real en cuestionarios educativos vía WebSocket
- Ver su historial de partidas y promedios por materia

---

## Estructura de carpetas relevante

```
src/
├── assets/
│   └── illustrations/       ← Ilustraciones SVG reutilizables
├── components/              ← Componentes compartidos (Layout, ScienceBackground)
├── features/
│   └── game/
│       ├── components/      ← Componentes del juego (Timer, AnswerButton, etc.)
│       └── states/          ← Estados del juego (WaitingRoom, Question, etc.)
├── hooks/                   ← Hooks personalizados (WebSocket, audio)
├── pages/                   ← Páginas principales
│   ├── home/
│   ├── join/
│   ├── game/
│   ├── history/
│   └── auth/
├── services/                ← Llamadas a la API (axios)
├── stores/                  ← Estado global (Zustand)
└── tests/                   ← Tests unitarios (Vitest + Testing Library)
```
