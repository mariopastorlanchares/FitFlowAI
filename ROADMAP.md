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
| **Diseño** | Dark Mode texturizado (`#0D0D0D`) · Acento naranja `#FF8C00` |

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
| ⬜ | **Pantalla: Dashboard / Home** | XL | [🔗 P1-02 Dashboard](docs/plans/P1-02_dashboard-home.md) |
| ⬜ | **Pantalla: Perfil / Ajustes (Logout)** | M | Pendiente de plan |
| ⬜ | **Pantalla: Ejecución de Entrenamiento** | XL | Pendiente de plan |

---

## 🔧 Fase 2 — Lógica Backend e IA `EN CURSO`

> Objetivo: conectar la app con Firebase y el motor de IA para funcionalidad real.
> **NOTA ARQUITECTÓNICA:** A partir de la implementación de IA (Gemini/Genkit) y la persistencia de datos complejos, se escalará la arquitectura a un nivel "Pro" (Feature-Sliced Design, separando lógica en custom hooks y usando gestores de estado asíncrono como React Query o SWR).

| Estado | Tarea | Complejidad | Plan / Referencia |
|:---:|---|:---:|---|
| ✅ | Integración de Firebase Auth (Email/Password) + i18n | L | - |
| ⬜ | Firebase Auth (Apple Sign-In + Google Sign-In) | M | Pendiente de plan |
| ⬜ | Configuración base de Firestore (reglas, índices) | M | Pendiente de plan |
| ⬜ | Esquema de datos: Usuarios, Rutinas, Historial | L | Pendiente de plan |
| ⬜ | Conexión segura con Gemini vía Genkit | XL | Pendiente de plan |
| ⬜ | Lógica de recomendaciones IA en tiempo real | XL | Pendiente de plan |

---

## 🚀 Fase 3 — Pulido y Producción `PENDIENTE`

> Objetivo: preparar la app para su lanzamiento.

| Estado | Tarea | Complejidad | Plan / Referencia |
|:---:|---|:---:|---|
| ⬜ | Micro-vídeos / animaciones de ejercicios | L | Pendiente de plan |
| ⬜ | Soporte Offline (reglas de caché de Firestore) | M | Pendiente de plan |
| ⬜ | Configuración de EAS Build y despliegue Beta | L | Pendiente de plan |
| ⬜ | Notificaciones push (recordatorios) | M | Pendiente de plan |
| ⬜ | Analíticas y métricas (Firebase Analytics) | S | Pendiente de plan |

---

<p align="center">
  <sub>Última actualización: 7 de marzo de 2026</sub>
</p>
