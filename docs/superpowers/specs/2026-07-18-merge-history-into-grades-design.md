# Spec: Fusionar Historial dentro de Calificaciones + revisión condicionada por el docente

**Fecha:** 2026-07-18
**Estado:** Aprobado

## Objetivo

Eliminar la redundancia entre "Historial" y "Calificaciones" en el front del estudiante, mostrando una sola tabla con una fila por intento jugado y acceso a la revisión pregunta-por-pregunta cuando el docente la haya habilitado para esa partida. Soportar que un docente repita el mismo cuestionario con su curso (varios intentos) y decida, por cada partida, si la revisión queda visible para los estudiantes.

## Alcance

Este spec cubre tres subsistemas. Solo el tercero se implementa en esta sesión (repo `eduLLM-Estudiante-Front`); los dos primeros documentan el contrato esperado para coordinar con los otros repos/equipos.

1. **Backend/API** — contrato de datos (fuera de este repo).
2. **Front del docente** — control de UI para el flag de revisión (fuera de este repo, no incluido en el plan de implementación).
3. **Front del estudiante** — fusión de páginas (implementación en este repo).

## Contexto actual

- [GradesPage.jsx](../../../src/pages/grades/GradesPage.jsx) llama a `historyService.getList()` y **deduplica** por `id_prueba`, quedándose con el intento de mejor nota. Una fila = un cuestionario.
- [HistoryListPage.jsx](../../../src/pages/history/HistoryListPage.jsx) llama a `historyService.getList(materiaId)` y lista **cada partida** sin deduplicar. Cada fila navega a `/history/:id`.
- [HistoryDetailPage.jsx](../../../src/pages/history/HistoryDetailPage.jsx) muestra la revisión pregunta-por-pregunta de una partida (`historyService.getDetail(id)`), con respuesta dada, respuesta correcta y retroalimentación.
- [HomePage.jsx:138](../../../src/pages/home/HomePage.jsx) navega a `/history?materiaId=X` desde la tarjeta de cada materia.
- [Layout.jsx:11-14](../../../src/components/Layout.jsx) tiene dos ítems de menú: "Historial" (`/history`) y "Calificaciones" (`/grades`).
- El modelo de datos ya soporta múltiples partidas por estudiante para la misma prueba (de ahí que `GradesPage` necesite deduplicar hoy). No hay ningún campo de "revisión habilitada" en ningún endpoint actual.

## 1. Backend/API (contrato esperado, fuera de este repo)

- Cada partida devuelta por `/api/estudiante/history` y `/api/estudiante/history/:id` debe incluir un campo booleano nuevo, ej. `revision_disponible`, controlado por el docente al ejecutar o repetir el cuestionario con el curso.
- No se requiere ningún cambio para permitir múltiples intentos: el modelo ya lo soporta (confirmado por el dedup actual del frontend).
- Si el campo no viene en la respuesta (mientras el backend no lo implemente), el frontend debe tratarlo como `false`/no disponible por defecto — nunca asumir disponible.

## 2. Front del docente (fuera de este repo, no implementado aquí)

- Al iniciar o repetir una partida con un curso, el docente debe poder marcar un switch "Mostrar revisión a los estudiantes" que persiste como `revision_disponible` en esa partida específica (no a nivel de todo el cuestionario).

## 3. Front del estudiante (este repo — a implementar)

### Routing y navegación

| Cambio | Detalle |
|---|---|
| Eliminar | `src/pages/history/HistoryListPage.jsx`, ruta `/history`, ítem "Historial" en `Layout.jsx` |
| Mover | `HistoryDetailPage.jsx` pasa a montarse en `/grades/:id` en vez de `/history/:id` (ruta `/history/:id` se elimina de `router.jsx`) |
| Actualizar | `HomePage.jsx:138` navega a `/grades?materiaId=X` en vez de `/history?materiaId=X` |
| Actualizar | `HistoryDetailPage.jsx`: el botón "Volver al historial" pasa a decir "Volver a calificaciones" y navega a `/grades${materiaId ? `?materiaId=${materiaId}` : ''}`; el `catch` de `getDetail` redirige a `/grades` en vez de `/history` |

`HistoryDetailPage.jsx` no cambia su lógica interna de revisión (respuestas, correcta/incorrecta, retroalimentación) — solo sus rutas de entrada/salida. Se puede renombrar su carpeta a `src/pages/grades/` en un ajuste cosmético menor, pero no es obligatorio para el objetivo funcional.

### GradesPage.jsx

- `historyService.getList()` pasa a llamarse con `historyService.getList(materiaId)`, leyendo `materiaId` de `useSearchParams` (mismo patrón que usaba `HistoryListPage`).
- Se elimina la lógica de deduplicación por `id_prueba` (el `Map` que se queda con la mejor nota). En su lugar, cada partida del array `historial` se transforma en una fila, ordenadas por fecha descendente (más reciente primero), igual que hacía `HistoryListPage`.
- Cada fila usa el campo `revision_disponible` que venga en el objeto de la partida (default `false` si es `undefined`).
- Nueva columna "Revisión" en la tabla:
  - Si `revision_disponible` es `true`: `IconButton` (ej. `VisibilityIcon`) que navega a `/grades/:id` usando `id_partida_estudiante`.
  - Si es `false`: mismo ícono pero `disabled`, envuelto en `Tooltip` con el texto "Revisión no habilitada por el docente".
- "Promedio final" se calcula sobre **todas** las filas mostradas (todos los intentos, no solo el mejor por cuestionario) — mismo cálculo que hoy (`calcNota` por fila, promedio simple de esas notas).
- El título/subtítulo ("Mis Calificaciones", nombre del estudiante) y el resto del layout de la tabla (columnas Cuestionario/Fecha/Nota, colores por nota) se mantienen igual.

### Testing existente

- `src/tests/components/Layout.test.jsx` referencia "Historial"/"Calificaciones" — se debe actualizar para reflejar el único ítem de menú restante.
- No hay tests actuales para `HistoryListPage.jsx` ni `GradesPage.jsx` deduplicando; si los hubiera, se actualizan al nuevo comportamiento de "una fila por intento".

## Restricciones

- No modificar `useGameStore`, `usePlayerSocket`, sockets ni ningún hook/store del juego en vivo — este cambio es exclusivamente de las páginas post-juego (historial/calificaciones).
- No implementar en este repo nada del front del docente ni del backend; solo consumir el campo `revision_disponible` asumiendo que puede no existir todavía (tratarlo como `false`).
- No tocar la fusión de UI de `Leaderboard.jsx` ni otros cambios ya aplicados en esta sesión (fondo, sonidos, título).

## Criterios de éxito

- El menú superior solo muestra "Calificaciones" (no "Historial").
- `/grades` lista una fila por partida jugada (no colapsa por mejor nota), filtrable por `?materiaId=`.
- Cada fila con `revision_disponible: true` permite navegar a la revisión pregunta-por-pregunta en `/grades/:id`.
- Cada fila con `revision_disponible: false` (o ausente) muestra el ícono de revisión deshabilitado con tooltip explicativo, sin navegar.
- El promedio final refleja todos los intentos mostrados.
- Las tarjetas de materia del Home siguen filtrando correctamente, ahora hacia `/grades?materiaId=X`.
- `/history` y `/history/:id` dejan de existir como rutas.
