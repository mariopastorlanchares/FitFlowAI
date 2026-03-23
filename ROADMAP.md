<p align="center">
  <img src="assets/images/icon.png" width="80" alt="FitFlow AI" />
</p>

<h1 align="center">🗺️ FitFlow AI — Roadmap</h1>

<p align="center">
  <em>Única fuente de verdad del proyecto. Consulta y actualiza este archivo a medida que avancemos.</em>
</p>

---

## 🧭 Visión

**FitFlow AI** es un asistente de entrenamiento inteligente impulsado por IA que planifica, guía y adapta rutinas de gimnasio en tiempo real.

### Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Mobile** | React Native · Expo SDK 52 · Expo Router |
| **Estilos** | NativeWind (Tailwind CSS v4) |
| **Backend** | Firebase Auth · Cloud Firestore · Cloud Functions |
| **IA** | Genkit + Gemini (generación de rutinas, sugerencias en vivo) |
| **Diseño** | Dark Mode sólido (`#181818` / `#242424`) · Acento naranja `#FF8C00` |

---

## 📌 Metodología de Trabajo

- **Estado visual:** `✅` Completado | `🔄` En curso | `⬜` Pendiente
- **Complejidad:** `S` (Pequeña), `M` (Media), `L` (Grande), `XL` (Extra grande)
- **Planes Detallados:** Las tareas complejas se desglosan en archivos dentro de `docs/plans/`.

---

## 📱 Fase 1 — MVP Frontend `EN CURSO`

> Objetivo: maquetar las pantallas principales con el sistema de diseño y datos simulados.

| Estado | Tarea | Complejidad | Plan / Referencia |
|:---:|---|:---:|---|
| ✅ | Inicialización del proyecto y enrutamiento base | S | - |
| ✅ | Configuración de Firebase SDK + variables de entorno | S | - |
| ✅ | Textura de fondo global (`AppBackground`) | S | - |
| ✅ | Configuración del Sistema de Diseño (NativeWind, `theme.ts`) | M | - |
| ✅ | **Pantalla: Login / Registro** | L | Mockup: [`login.jpg`](docs/mockups/login.jpg) |
| ✅ | **Pantalla: Dashboard / Home** | XL | [🔗 P1-02 Dashboard](docs/plans/P1-02_dashboard-home.md) |
| ✅ | **Pantalla: Perfil / Ajustes (Logout)** | M | [🔗 P1-03 Profile / Settings](docs/plans/P1-03_profile-settings.md) |
| ✅ | **Pantalla: Ejecución de Entrenamiento** | XL | [🔗 P1-04 Workout Execution](docs/plans/P1-04_workout-execution.md) |

---

## 🔧 Fase 2 — Lógica Backend e IA `EN CURSO`

> Objetivo: conectar la app con Firebase y el motor de IA para funcionalidad real.
> **NOTA ARQUITECTÓNICA:** Antes de abordar esta fase, se realizará una refactorización arquitectónica (Feature-Sliced Design + React Query) para establecer una base sólida que escale con la complejidad del backend y la IA.
> **RESTRICCIÓN FUNCIONAL:** `location` y el equipamiento disponible del usuario actuarán como constraints duros del generador; la IA no deberá sugerir ejercicios incompatibles con el material real.

| Estado | Tarea | Complejidad | Plan / Referencia |
|:---:|---|:---:|---|
| ✅ | Integración de Firebase Auth (Email/Password) + i18n | L | - |
| ✅ | **Refactorización Arquitectónica** (FSD + React Query) | L | [🔗 P2-00 Refactor Arquitectónico](docs/plans/P2-00_architectural-refactor.md) |
| 🔄 | **Endurecimiento UI/UX de superficies actuales** (i18n, theme, jerarquía y placeholders) | L | [🔗 P2-01 UI/UX Hardening](docs/plans/P2-01_ui-ux-hardening.md) |
| 🔄 | Configuración base de Firestore (reglas, índices) | M | [🔗 P2-03 Firestore Foundation](docs/plans/P2-03_firestore-foundation.md) |
| ⬜ | Esquema de datos: Usuarios, Rutinas, Historial y Perfil de Equipamiento | L | [🔗 P2-02 Data Schema + Equipment Profile](docs/plans/P2-02_data-schema-equipment-profile.md) |
| ⬜ | Firebase Auth (Apple Sign-In + Google Sign-In) | M | Pendiente de plan |
| ⬜ | Conexión segura con Gemini vía Genkit | XL | Pendiente de plan |
| ⬜ | Lógica de recomendaciones IA en tiempo real | XL | Pendiente de plan |

---

## 📲 Fase 3 — Widget & Experiencia Nativa `PENDIENTE`

> Objetivo: permitir al usuario interactuar con el entrenamiento en segundo plano, sin tener que mantener la app abierta.
> **Caso de uso:** El usuario está en el gym y usa WhatsApp u otras apps entre series. El widget le muestra el crono, ejercicio actual, recomendación IA, y le permite marcar pesos/reps con el móvil bloqueado o desde la pantalla de inicio.

| Estado | Tarea | Complejidad | Plan / Referencia |
|:---:|---|:---:|---|
| ⬜ | Widget de entrenamiento Android (Jetpack Glance / AppWidget) | XL | Pendiente de plan |
| ⬜ | Widget de entrenamiento iOS (WidgetKit + Live Activities) | XL | Pendiente de plan |
| ⬜ | Servicio de timer en segundo plano (Background Task) | L | Pendiente de plan |
| ⬜ | Notificaciones push (recordatorios de entrenamiento) | M | Pendiente de plan |
| ⬜ | Soporte Offline (reglas de caché de Firestore) | M | Pendiente de plan |

---

## 🚀 Fase 4 — Pulido y Producción `PENDIENTE`

> Objetivo: preparar la app para su lanzamiento.

| Estado | Tarea | Complejidad | Plan / Referencia |
|:---:|---|:---:|---|
| ⬜ | Micro-vídeos / animaciones de ejercicios | L | Pendiente de plan |
| ⬜ | Configuración de EAS Build y despliegue Beta | L | Pendiente de plan |
| ⬜ | Analíticas y métricas (Firebase Analytics) | S | Pendiente de plan |
| ⬜ | Pruebas de rendimiento y optimización | M | Pendiente de plan |
| ⬜ | Publicación en App Store / Google Play | L | Pendiente de plan |

---

## 🧠 Fase 5 — Coaching Adaptativo y Retos `PENDIENTE`

> Objetivo: hacer que FitFlow AI no solo reactive sesiones, sino que ayude al usuario a progresar hacia objetivos de habilidad y rendimiento concretos.

| Estado | Tarea | Complejidad | Plan / Referencia |
|:---:|---|:---:|---|
| ⬜ | Sistema de retos y objetivos de rendimiento (`pull-up`, `muscle-up`, etc.) | XL | Pendiente de plan |
| ⬜ | Recomendación de retos sugeridos según nivel, material y contexto | L | Pendiente de plan |
| ⬜ | Adaptación de sesiones para progresar hacia un reto activo | XL | Pendiente de plan |
| ⬜ | Seguimiento de progreso por reto (hitos, regresiones, test periódicos) | L | Pendiente de plan |

---

<p align="center">
  <sub>Última actualización: 15 de marzo de 2026 (Refactor FSD 40% completado)</sub>
</p>
<p align="center">
  <sub>Actualizado el 17 de marzo de 2026: refactor FSD avanzado, `auth`, `dashboard`, `workout`, `profile` y `analytics` migrados a features.</sub>
</p>
<p align="center">
  <sub>Tooling alineado el 17 de marzo de 2026: Jest operativo de nuevo y lint adaptado a la nueva estructura FSD.</sub>
</p>
<p align="center">
  <sub>Refactor arquitectónico cerrado el 20 de marzo de 2026: FSD consolidado, carpetas legacy vacías eliminadas y verificación completada con TypeScript, lint, Jest y bundling web.</sub>
</p>
<p align="center">
  <sub>UI/UX hardening iniciado el 17 de marzo de 2026: Ola A aplicada en `dashboard`, `workout`, `stats` y `shared/ui`, con i18n ampliado, placeholders limpiados y tokens de tema semánticos.</sub>
</p>
<p align="center">
  <sub>Auth UI/UX endurecido el 20 de marzo de 2026: login y registro simplificados tras FSD, con jerarquía más operativa, componentes compartidos ajustados y tests básicos de pantalla.</sub>
</p>
<p align="center">
  <sub>Dashboard UI/UX endurecido el 21 de marzo de 2026: Home reordenado para priorizar la rutina del día, con branding más discreto, progreso semanal como soporte y tests básicos del dashboard.</sub>
</p>
<p align="center">
  <sub>Workout UI/UX endurecido el 21 de marzo de 2026: Execution prioriza ejercicio actual, logging del set, descanso y CTA principal, con IA relegada a soporte contextual y tests básicos de pantalla.</sub>
</p>
<p align="center">
  <sub>Modelado futuro aclarado el 21 de marzo de 2026: `location` y `homeEquipment` entrarán como restricciones duras del generador de sesiones; el esquema de datos ya tiene plan dedicado.</sub>
</p>
<p align="center">
  <sub>Dirección de producto ampliada el 22 de marzo de 2026: se añade una futura fase de coaching adaptativo y retos para contemplar objetivos como dominada, muscle-up y progresiones orientadas a habilidad.</sub>
</p>
<p align="center">
  <sub>Planificación JIT ampliada el 22 de marzo de 2026: Firestore base ya tiene plan dedicado, alineado con el contrato de dominio definido en `P2-02`.</sub>
</p>
<p align="center">
  <sub>Firestore foundation iniciada el 22 de marzo de 2026: archivos base creados, `db` expuesto en `shared/lib/firebase.ts` y primer service/hook de `profile` verificados con TypeScript y lint.</sub>
</p>
<p align="center">
  <sub>Firestore foundation ampliada el 23 de marzo de 2026: `profile` ya crea el documento base `userProfiles/{authUid}` cuando falta, expone su estado en UI y queda cubierto por TypeScript, lint y Jest.</sub>
</p>
<p align="center">
  <sub>Firebase CLI preparado el 23 de marzo de 2026: `firebase-tools` queda versionado, `.firebaserc` apunta a `fitflowai-6d4fc` y el despliegue de reglas/índices queda pendiente solo de autenticar la máquina.</sub>
</p>
