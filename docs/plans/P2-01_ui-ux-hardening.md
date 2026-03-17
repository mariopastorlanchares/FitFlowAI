# P2-01 Endurecimiento UI/UX de Superficies Actuales

> **Fase:** 2 | **Complejidad:** L | **Estado:** ⬜

## 🎯 Objetivo
Convertir los hallazgos de la auditoría visual en un backlog ejecutable que reduzca deuda de interfaz antes de seguir expandiendo backend e IA. El foco no es "embellecer" la app, sino hacerla más coherente, más utilitaria y menos dependiente de patrones visuales genéricos.

Este plan se ejecutará en varias olas para evitar retrabajo:
- **Ola A (ahora / bajo riesgo):** deuda transversal de i18n, theme y placeholders críticos.
- **Ola B (justo después de P2-00):** limpieza estructural por pantalla una vez las features estén migradas.
- **Ola C (tras Firestore/Genkit):** sustituir contenido fake por estados reales.
- **Ola D (Fase 4):** pulido final, motion y media.

## 🎨 Referencias de Diseño
- Mockups existentes:
  - [`docs/mockups/login.jpg`](../mockups/login.jpg)
  - [`docs/mockups/dashboard.jpg`](../mockups/dashboard.jpg)
  - [`docs/mockups/activity.jpg`](../mockups/activity.jpg)
  - [`docs/mockups/activity-2.jpg`](../mockups/activity-2.jpg)
- Tokens existentes: `src/shared/constants/theme.ts`
- Criterio de diseño:
  - Menos "AI dark SaaS"
  - Más herramienta móvil de entrenamiento
  - Prioridad en lectura instantánea, acción con una mano y jerarquía operacional

## 📋 Requisitos Previos
- [x] Pantallas principales del MVP ya maquetadas
- [ ] P2-00 Refactorización Arquitectónica completada al menos hasta la migración de `auth`, `dashboard`, `workout` y `profile`
- [ ] Entorno Expo estable y verificable en local
- [ ] Catálogo de traducciones e i18n listo para ampliación

## 🛠️ Plan de Implementación

### Paso 1: Cerrar deuda transversal visible (Ola A)
- [ ] **Acción:** Eliminar strings hardcodeados de UI y moverlos a `i18next`
- [ ] **Archivos afectados:** `app/(tabs)/workout.tsx`, `app/(tabs)/stats.tsx`, `components/dashboard/*`, `components/workout/execution/*`, `src/shared/ui/*`
- [ ] **Detalles:** Esta tarea debe hacerse antes de seguir creando nuevas pantallas, porque ahora mismo propaga deuda de copy e inconsistencia de tono.

### Paso 2: Reforzar `theme.ts` como única fuente de verdad (Ola A)
- [ ] **Acción:** Auditar colores, radios, superficies, sombras y estados fuera de tokens
- [ ] **Archivos afectados:** `src/shared/constants/theme.ts`, `src/shared/ui/*`, `components/dashboard/*`, `components/workout/execution/*`, `app/(tabs)/*`
- [ ] **Detalles:** Normalizar superficies oscuras, CTA, inputs, bordes y estados destructivos. El objetivo es cortar la deriva visual antes de la siguiente ronda de features.

### Paso 3: Limpiar placeholders y señales de prototipo (Ola A)
- [ ] **Acción:** Retirar textos provisionales, datos falsos visibles y affordances poco creíbles
- [ ] **Archivos afectados:** `components/dashboard/WeeklyStreak.tsx`, `app/(tabs)/stats.tsx`, `components/workout/execution/ExerciseMedia.tsx`, `components/workout/execution/RestTimerLarge.tsx`
- [ ] **Detalles:** Incluye eliminar `[cite: ...]`, unificar idioma de placeholders, y decidir si `stats` permanece como placeholder digno o se oculta hasta tener contenido útil.

### Paso 4: Refactor visual de Auth tras migración FSD (Ola B)
- [ ] **Acción:** Simplificar Login/Registro para que se apoyen más en jerarquía, espaciado y contraste que en blur, glow y pills
- [ ] **Archivos afectados:** futura `src/features/auth/components/*`, `src/shared/ui/form-input.tsx`, `src/shared/ui/primary-button.tsx`, `src/shared/ui/social-button.tsx`
- [ ] **Detalles:** Esta tarea debe hacerse después de mover `auth` a `src/features/auth/`, para evitar rehacer la misma pantalla dos veces.

### Paso 5: Refactor visual de Dashboard/Home tras migración FSD (Ola B)
- [ ] **Acción:** Reforzar la jerarquía de tarea en Home
- [ ] **Archivos afectados:** futura `src/features/dashboard/components/*`, `app/(tabs)/index.tsx`
- [ ] **Detalles:** Reducir sensación de "hero card", revisar centrado excesivo, limpiar badge de racha y priorizar "qué hago ahora" frente a branding.

### Paso 6: Refactor visual de Workout Execution tras migración FSD (Ola B)
- [ ] **Acción:** Reordenar la pantalla para que ejercicio actual, set logging, descanso y CTA dominen sobre branding e IA
- [ ] **Archivos afectados:** futura `src/features/workout/components/execution/*`, `app/(tabs)/workout.tsx`
- [ ] **Detalles:** La IA debe pasar a ser soporte contextual, no la primera capa de lectura. Revisar también controles inferiores, rest timer y formularios de comentario.

### Paso 7: Refactor visual de Profile y placeholder de Stats (Ola B)
- [ ] **Acción:** Bajar ruido visual en perfil y dar un tratamiento intencional a `stats`
- [ ] **Archivos afectados:** futura `src/features/profile/components/*`, futura `src/features/analytics/*`, `app/(tabs)/profile.tsx`, `app/(tabs)/stats.tsx`
- [ ] **Detalles:** Perfil debe sentirse más como ajustes nativos que como lista ornamental. `Stats` no puede quedarse como pantalla vacía sin criterio.

### Paso 8: Sustituir contenido fake por estados reales (Ola C)
- [ ] **Acción:** Reemplazar datos hardcodeados del dashboard, workout e IA por estados conectados a Firestore/Genkit o placeholders de carga vacíos pero honestos
- [ ] **Archivos afectados:** features `dashboard`, `workout`, `analytics`, servicios y hooks de datos
- [ ] **Detalles:** Esta tarea solo tiene sentido cuando la capa de datos esté preparada; hacerlo antes genera retrabajo y duplicación de mocks.

### Paso 9: Accesibilidad, feedback y tests visuales básicos (Ola D)
- [ ] **Acción:** Añadir revisión de contraste, targets táctiles, estados disabled/loading y tests de componentes críticos
- [ ] **Archivos afectados:** `src/shared/ui/*`, features `auth`, `dashboard`, `workout`, `profile`, tests de RTL/Jest
- [ ] **Detalles:** Especial atención a CTAs principales, formularios y pantalla de ejecución, que es el flujo de mayor frecuencia.

## ✅ Criterios de Aceptación
- [ ] No quedan strings hardcodeados en pantallas principales ni en componentes UI reutilizables
- [ ] Los colores y superficies visibles salen de `src/shared/constants/theme.ts`
- [ ] La app reduce blur/glow/radios excesivos y gana consistencia visual
- [ ] Home deja clara la acción principal del día sin depender de una hero card decorativa
- [ ] Workout Execution prioriza la tarea operativa sobre branding e IA
- [ ] `Stats` y otros placeholders visibles tienen tratamiento digno o se retiran temporalmente
- [ ] Los componentes críticos tienen al menos cobertura básica de tests

## 📝 Notas Técnicas / Aprendizajes
- Esta tarea no debe competir con la refactorización FSD; debe apoyarse en ella.
- El momento óptimo para cambios grandes de layout es justo después de migrar cada feature, no antes.
- El momento óptimo para "realismo de contenido" es después de tener datos reales, no durante la fase de mocks.
- La deuda transversal de i18n y theme sí conviene atacarla cuanto antes porque contamina todo lo que construyamos encima.

---
**Historial:**
- `2026-03-17`: Creado el plan a partir de la auditoría UI/UX global.
