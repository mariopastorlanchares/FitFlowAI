# P2-01 Endurecimiento UI/UX de Superficies Actuales

> **Fase:** 2 | **Complejidad:** L | **Estado:** 🔄

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
- [x] P2-00 Refactorización Arquitectónica completada al menos hasta la migración de `auth`, `dashboard`, `workout` y `profile`
- [x] Entorno Expo estable y verificable en local
- [x] Catálogo de traducciones e i18n listo para ampliación

## 🛠️ Plan de Implementación

### Paso 1: Cerrar deuda transversal visible (Ola A)
- [x] **Acción:** Eliminar strings hardcodeados de UI y moverlos a `i18next`
- [x] **Archivos afectados:** `src/features/auth/*`, `src/features/dashboard/*`, `src/features/workout/*`, `src/features/analytics/screens/stats-screen.tsx`, `src/features/profile/*`, `src/shared/ui/*`, `src/shared/lib/i18n.ts`
- [ ] **Detalles pendientes:** Las superficies principales ya usan `i18next` y `stats`/`profile` muestran copy traducida, pero siguen quedando textos mock y `defaultValue` ligados al flujo de `workout` mientras no entren datos reales.

### Paso 2: Reforzar `theme.ts` como única fuente de verdad (Ola A)
- [x] **Acción:** Auditar colores, radios, superficies, sombras y estados fuera de tokens
- [x] **Archivos afectados:** `src/shared/constants/theme.ts`, `src/shared/ui/*`, `src/features/auth/*`, `src/features/dashboard/*`, `src/features/workout/screens/*`, `src/features/profile/*`, `src/features/analytics/*`
- [ ] **Detalles pendientes:** La mayoría de superficies visibles ya consumen tokens, pero siguen quedando colores hardcodeados fuera de `theme.ts` en `src/features/workout/components/execution/active-exercise-display.tsx` y `src/shared/components/themed-text.tsx`.

### Paso 3: Limpiar placeholders y señales de prototipo (Ola A)
- [x] **Acción:** Retirar textos provisionales, datos falsos visibles y affordances poco creíbles
- [x] **Archivos afectados:** `src/features/dashboard/*`, `src/features/analytics/screens/stats-screen.tsx`, `src/features/workout/components/execution/*`, `src/features/profile/components/profile-training-status-card.tsx`
- [ ] **Detalles pendientes:** `stats` ya tiene un placeholder digno y `profile` ya expone el bootstrap real de Firestore, pero `workout` sigue dependiendo de contenido mock y placeholders de media/IA hasta la Ola C.

### Paso 4: Refactor visual de Auth tras migración FSD (Ola B) ✅
- [x] **Acción:** Simplificar Login/Registro para que se apoyen más en jerarquía, espaciado y contraste que en blur, glow y pills
- [x] **Archivos afectados:** `src/features/auth/components/*`, `src/features/auth/screens/*`, `src/shared/ui/form-input.tsx`, `src/shared/ui/primary-button.tsx`, `src/shared/ui/social-button.tsx`, `src/shared/lib/i18n.ts`, `__tests__/auth-screens.test.tsx`
- [x] **Detalles:** `auth` se reorganizó con un shell reutilizable, feedback de estado explícito, CTA más funcional y tests básicos de login/registro para fijar el nuevo comportamiento.

### Paso 5: Refactor visual de Dashboard/Home tras migración FSD (Ola B) ✅
- [x] **Acción:** Reforzar la jerarquía de tarea en Home
- [x] **Archivos afectados:** `src/features/dashboard/components/*`, `src/features/dashboard/screens/home-screen.tsx`, `src/shared/lib/i18n.ts`, `__tests__/dashboard-home.test.tsx`
- [x] **Detalles:** Home se reorganizó como panel operativo: branding comprimido, tarjeta principal orientada a la siguiente acción, progreso semanal como soporte y selector contextual rebajado a preparación de sesión.

### Paso 6: Refactor visual de Workout Execution tras migración FSD (Ola B) ✅
- [x] **Acción:** Reordenar la pantalla para que ejercicio actual, set logging, descanso y CTA dominen sobre branding e IA
- [x] **Archivos afectados:** `src/features/workout/components/execution/*`, `src/features/workout/screens/workout-execution-screen.tsx`, `src/features/workout/hooks/use-workout-session.ts`, `src/shared/lib/i18n.ts`, `__tests__/workout-execution.test.tsx`
- [x] **Detalles:** Workout Execution pasa a una jerarquía operativa: header más funcional, ejercicio actual arriba, logger de set con objetivo explícito, temporizador con acción de salto integrada y soporte IA relegado al final con feedback contextual. La CTA inferior ahora cambia según el estado real del ejercicio.

### Paso 7: Refactor visual de Profile y placeholder de Stats (Ola B)
- [x] **Acción:** Bajar ruido visual en perfil y dar un tratamiento intencional a `stats`
- [x] **Archivos afectados:** `src/features/profile/components/*`, `src/features/profile/screens/profile-screen.tsx`, `src/features/analytics/screens/stats-screen.tsx`, `src/shared/lib/i18n.ts`, `app/(tabs)/profile.tsx`, `app/(tabs)/stats.tsx`, `__tests__/profile.test.tsx`
- [x] **Detalles:** `stats` ya tiene tratamiento intencional y `profile` ya permite editar nivel, ubicaciones y equipamiento doméstico con guardado real. La captura de `contextProfiles` se tratará como slice posterior de dominio y producto, no como parte pendiente de este paso.

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
- [x] Home deja clara la acción principal del día sin depender de una hero card decorativa
- [x] Workout Execution prioriza la tarea operativa sobre branding e IA
- [x] `Stats` y otros placeholders visibles tienen tratamiento digno o se retiran temporalmente
- [ ] Los componentes críticos tienen al menos cobertura básica de tests

## 📝 Notas Técnicas / Aprendizajes
- Esta tarea no debe competir con la refactorización FSD; debe apoyarse en ella.
- El momento óptimo para cambios grandes de layout es justo después de migrar cada feature, no antes.
- El momento óptimo para "realismo de contenido" es después de tener datos reales, no durante la fase de mocks.
- La deuda transversal de i18n y theme sí conviene atacarla cuanto antes porque contamina todo lo que construyamos encima.

---
**Historial:**
- `2026-03-17`: Creado el plan a partir de la auditoría UI/UX global.
- `2026-03-17`: Ola A ejecutada en `dashboard`, `workout`, `stats` y `shared/ui`; validado con `npm run lint`, `npx tsc --noEmit` y `npx expo export --platform web`.
- `2026-03-20`: ✅ Paso 4 completado en `auth`: login/registro simplificados, `BlurView` retirado, inputs/CTA/social actions rebalanceados y cobertura básica añadida con `__tests__/auth-screens.test.tsx`. Verificado con `npx tsc --noEmit`, `npm run lint`, `npx jest __tests__/auth-screens.test.tsx __tests__/auth-service.test.ts __tests__/profile.test.tsx --runInBand` y `npx expo export --platform web`.
- `2026-03-21`: ✅ Paso 5 completado en `dashboard`: Home prioriza la acción principal del día, reduce la hero card ornamental y añade tests básicos en `__tests__/dashboard-home.test.tsx`. Verificado con `npx tsc --noEmit`, `npm run lint`, `npx jest __tests__/dashboard-home.test.tsx __tests__/auth-screens.test.tsx __tests__/auth-service.test.ts __tests__/profile.test.tsx --runInBand` y `npx expo export --platform web`.
- `2026-03-21`: ✅ Paso 6 completado en `workout`: la pantalla de ejecución se reordena para priorizar ejercicio actual, registro de set, descanso y CTA principal; la IA pasa a soporte contextual y se añade cobertura básica en `__tests__/workout-execution.test.tsx`. Verificado con `npx tsc --noEmit`, `npm run lint`, `npx jest workout-execution --runInBand` y `npx expo export --platform web`.
- `2026-03-23`: Sincronización de estado del plan: `stats` ya cuenta con placeholder digno y `profile` ya resume el bootstrap de Firestore con test básico, pero la tarea sigue abierta por deuda residual de theme hardcodeado y por contenido mock aún visible en `workout`.
- `2026-03-23`: `profile` añade la primera edición real del perfil operativo: `experienceLevel`, `preferredLocations`, `defaultLocation` y `homeEquipment` ya se guardan desde producto con cobertura básica en `__tests__/profile.test.tsx`; `contextProfiles` sigue pendiente para un slice específico.
