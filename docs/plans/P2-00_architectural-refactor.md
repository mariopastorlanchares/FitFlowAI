# P2-00 Refactorización Arquitectónica (Feature-Sliced Design + React Query)

> **Fase:** 2 | **Complejidad:** L | **Estado:** 🔄

## 🎯 Objetivo

Reorganizar la estructura del proyecto desde la arquitectura plana actual hacia un diseño **Feature-Sliced Design (FSD)** adaptado a Expo Router, e integrar **TanStack React Query** como gestor de estado asíncrono. Esto establece una base sólida para que las siguientes tareas de Fase 2 (Firestore, Genkit, IA) escalen sin deuda técnica.

### ¿Por qué ahora y no después?

La estructura actual funciona para el MVP, pero tiene estos problemas de escalabilidad:
- Hooks y componentes mezclados sin separación de dominio
- Sin capa de servicios (la lógica de Firebase Auth está dentro del contexto)
- Sin gestión de estado asíncrono (cache, retry, optimistic updates)
- Los tipos están dispersos (solo `types/workout.ts`, falta `user`, `exercise`, etc.)

Refactorizar ahora (con ~30 archivos) es **mucho más barato** que hacerlo luego con 100+ archivos.

## 📋 Requisitos Previos

- [x] Fase 1 completada
- [x] Firebase Auth Email/Password funcionando
- [ ] Node.js y entorno de desarrollo funcional

## 🏗️ Arquitectura Objetivo

### Estructura de Carpetas

```
app/                           ← Expo Router (solo routing, screens delgadas)
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx              → importa de src/features/auth/
│   └── register.tsx           → importa de src/features/auth/
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx              → importa de src/features/dashboard/
│   ├── profile.tsx            → importa de src/features/profile/
│   ├── stats.tsx              → importa de src/features/analytics/
│   └── workout.tsx            → importa de src/features/workout/
├── _layout.tsx                → Providers (QueryClient, Auth, Theme)
└── index.tsx                  → Redirect

src/
├── features/                  ← Módulos de dominio (Feature-Sliced)
│   ├── auth/
│   │   ├── components/        (formularios de login/registro, si se extraen)
│   │   ├── hooks/             (useAuth → reemplaza AuthContext)
│   │   └── services/          (auth-service.ts → signIn, signUp, signOut)
│   │
│   ├── dashboard/
│   │   ├── components/        (HeaderLogo, WeeklyStreak, TodayWorkoutCard, etc.)
│   │   └── hooks/             (useDashboardData)
│   │
│   ├── workout/
│   │   ├── components/        (execution/*, ActiveSetLogger, RestTimer, etc.)
│   │   ├── hooks/             (useWorkoutSession)
│   │   ├── services/          (workout-service.ts → CRUD futuro a Firestore)
│   │   └── types/             (workout.ts)
│   │
│   ├── profile/
│   │   ├── components/        (ProfileScreen content, settings sections)
│   │   ├── hooks/             (useUserProfile)
│   │   └── services/          (profile-service.ts)
│   │
│   └── analytics/
│       ├── components/        (futuros gráficos, tablas de progreso)
│       └── hooks/             (useAnalyticsData)
│
├── shared/                    ← Código reutilizable cross-feature
│   ├── ui/                    (PrimaryButton, FormInput, ConfirmModal, Divider, etc.)
│   ├── components/            (AppBackground, ThemedText, ThemedView)
│   ├── lib/                   (firebase.ts, i18n.ts, query-client.ts)
│   ├── hooks/                 (useColorScheme, useThemeColor, useTypewriter)
│   ├── constants/             (theme.ts)
│   └── types/                 (common.ts — tipos compartidos)
│
└── app/                       ← ⚠️ NO EXISTE: app/ vive en la raíz (Expo Router)
```

### Principios Clave

| Principio | Regla |
|---|---|
| **Screens delgadas** | Los archivos en `app/` solo importan y componen, nunca tienen lógica de negocio |
| **Feature isolation** | Las features no importan entre sí directamente. Usan `shared/` para comunicarse |
| **Service layer** | Toda interacción con Firebase pasa por un archivo `*-service.ts` |
| **React Query** | Las queries a Firestore se encapsulan en custom hooks con `useQuery`/`useMutation` |
| **Barrel exports** | Cada feature tiene un `index.ts` que expone su API pública |

## 🛠️ Plan de Implementación

### Paso 1: Instalar dependencias ✅
- [x] **Acción:** Instalar TanStack React Query y devtools
- [x] **Comando:** `npx expo install @tanstack/react-query`
- [x] **Detalles:** React Query será el gestor de estado asíncrono para todas las llamadas a Firestore y Genkit. No necesitamos Redux/Zustand porque el estado local + React Query cubre nuestras necesidades.

### Paso 2: Crear estructura de carpetas `src/` ✅
- [x] **Acción:** Crear la estructura base de directorios
- [x] **Archivos afectados:** Crear directorios según la arquitectura objetivo
- [x] **Detalles:** Solo la estructura, sin mover archivos aún. Se configuraron también los path aliases en `tsconfig.json` (`@features/*`, `@shared/*`).

### Paso 3: Configurar React Query Provider ✅
- [x] **Acción:** Crear `lib/query-client.ts` y añadir `QueryClientProvider` al root layout
- [x] **Archivos afectados:** `lib/query-client.ts`, `app/_layout.tsx`
- [x] **Detalles:** Configurar defaults sensatos (staleTime, cacheTime, retry). El archivo se moverá a `src/shared/lib/` en el Paso 4.

### Paso 4: Migrar `shared/` (UI, lib, constants, hooks genéricos) ✅
- [x] **Acción:** Mover archivos compartidos a `src/shared/`
- [x] **Archivos afectados:**
  - `components/ui/*` → `src/shared/ui/`
  - `components/app-background.tsx` → `src/shared/components/`
  - `components/themed-text.tsx` → `src/shared/components/`
  - `components/themed-view.tsx` → `src/shared/components/`
  - `lib/firebase.ts` → `src/shared/lib/`
  - `lib/i18n.ts` → `src/shared/lib/`
  - `lib/query-client.ts` → `src/shared/lib/`
  - `constants/theme.ts` → `src/shared/constants/`
  - `hooks/use-color-scheme.*` → `src/shared/hooks/`
  - `hooks/use-theme-color.ts` → `src/shared/hooks/`
  - `hooks/use-typewriter.ts` → `src/shared/hooks/`
- [x] **Detalles:** Todos los imports actualizados a `@shared/*`. Fixed legacy `useThemeColor` hook (eliminada referencia a `Colors` inexistente). TypeScript compila sin errores.

### Paso 5: Migrar feature `auth`
- [ ] **Acción:** Crear la feature de auth con service layer
- [ ] **Archivos afectados:**
  - `contexts/auth-context.tsx` → Refactorizar en `src/features/auth/hooks/useAuth.ts` + `src/features/auth/services/auth-service.ts`
- [ ] **Detalles:**
  - `auth-service.ts`: funciones puras (signIn, signUp, signOut, onAuthChange) — solo Firebase
  - `useAuth.ts`: hook que consume el servicio y mantiene el estado del usuario (puede seguir siendo un Context por ahora, pero la lógica de Firebase sale del contexto)

### Paso 6: Migrar feature `dashboard`
- [ ] **Acción:** Mover componentes del dashboard a su feature
- [ ] **Archivos afectados:**
  - `components/dashboard/*` → `src/features/dashboard/components/`
- [ ] **Detalles:** Crear barrel export `src/features/dashboard/index.ts`

### Paso 7: Migrar feature `workout`
- [ ] **Acción:** Mover componentes y hooks de workout a su feature
- [ ] **Archivos afectados:**
  - `components/workout/execution/*` → `src/features/workout/components/execution/`
  - `hooks/useWorkoutSession.ts` → `src/features/workout/hooks/`
  - `types/workout.ts` → `src/features/workout/types/`
- [ ] **Detalles:** Crear `workout-service.ts` vacío (placeholder para Firestore). Crear barrel export.

### Paso 8: Migrar feature `profile`
- [ ] **Acción:** Extraer la lógica del perfil a su feature
- [ ] **Archivos afectados:** Extraer componentes de `app/(tabs)/profile.tsx` a `src/features/profile/components/`
- [ ] **Detalles:** El screen actual tiene mucha lógica inline que debería separarse.

### Paso 9: Crear feature `analytics` (placeholder)
- [ ] **Acción:** Crear la estructura base para analytics
- [ ] **Archivos afectados:** `src/features/analytics/` con archivos placeholder
- [ ] **Detalles:** Solo estructura, sin implementación real aún. Se conectará con Firestore en tareas posteriores.

### Paso 10: Actualizar imports y aliases
- [ ] **Acción:** Actualizar `tsconfig.json` con nuevos path aliases y corregir todos los imports
- [ ] **Archivos afectados:** `tsconfig.json`, todos los archivos que importan los módulos movidos
- [ ] **Detalles:** Posibles aliases: `@/` → `src/`, `@shared/` → `src/shared/`, `@features/` → `src/features/`

### Paso 11: Verificar que todo compila y funciona
- [ ] **Acción:** Ejecutar `npx expo start`, verificar que no hay errores de TypeScript ni runtime
- [ ] **Archivos afectados:** Ninguno nuevo
- [ ] **Detalles:** Probar: Login, Dashboard, Workout, Profile, navegación entre tabs.

### Paso 12: Limpiar carpetas vacías y archivos huérfanos
- [ ] **Acción:** Eliminar las carpetas antiguas que quedaron vacías
- [ ] **Archivos afectados:** `components/`, `hooks/`, `contexts/`, `constants/`, `lib/`, `types/`
- [ ] **Detalles:** Solo eliminar si están completamente vacías.

## ✅ Criterios de Aceptación

- [ ] Toda la app compila sin errores de TypeScript
- [ ] La app funciona igual que antes (Login, Dashboard, Workout, Profile)
- [ ] Los archivos siguen la nueva estructura FSD bajo `src/`
- [ ] React Query provider está configurado y funcional
- [ ] Feature `auth` tiene su service layer separado del contexto
- [ ] Cada feature tiene su barrel export (`index.ts`)
- [ ] Los screens en `app/` son delgados (importan de features, no tienen lógica)
- [ ] Los path aliases (`@/`, `@shared/`, `@features/`) funcionan correctamente
- [ ] No hay referencias a las rutas antiguas (`components/`, `hooks/`, etc.)

## 📝 Notas Técnicas / Aprendizajes

### Sobre FSD en Expo Router

Expo Router **obliga** a que `app/` esté en la raíz del proyecto (no puede estar dentro de `src/`). Esto es por diseño: el file-based routing necesita una ubicación conocida. Por eso nuestro FSD es una **adaptación**: `app/` actúa como capa de "routing" y `src/` como capa de "lógica + presentación".

### ¿Por qué React Query y no Redux/Zustand?

| Herramienta | Caso de uso ideal | Nuestra situación |
|---|---|---|
| **Redux** | Estado global complejo, muchas acciones sincrónicas | No necesitamos — nuestro estado es mayoritariamente asíncrono (Firestore) |
| **Zustand** | Estado global ligero y sincrón | Podríamos usarlo, pero React Query ya cubre async, y para sync basta con Context/useState |
| **React Query** | Cache de datos remotos, sync, retry, optimistic updates | ✅ Perfecto. El 80% de nuestro estado vendrá de Firestore |

### Riesgo: Imports rotos

El mayor riesgo de este refactor es romper imports. Mitigación:
1. Hacer los movimientos paso a paso con verificación de build
2. Usar `git grep` para buscar imports viejos después de cada migración
3. TypeScript nos protege: si algo se rompe, el compilador lo detecta

---

**Historial:**
- `2026-03-15`: Creado el plan.
- `2026-03-15`: ✅ Completados Pasos 1, 2, 3 y 4 (React Query + estructura + aliases + Provider + migración shared).
