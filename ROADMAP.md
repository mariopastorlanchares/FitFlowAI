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

## 📌 Fase 1 — MVP Frontend `EN CURSO`

> Objetivo: maquetar las pantallas principales con el sistema de diseño y datos simulados.

- [x] Inicialización del proyecto y enrutamiento base (Expo Router)
- [x] Configuración de Firebase SDK + variables de entorno (`.env`)
- [x] Textura de fondo global (`AppBackground`)
- [/] Configuración del Sistema de Diseño (NativeWind, tokens en `constants/theme.ts`, layout principal)
- [/] **Pantalla: Login** — Revisar mockup en [`docs/mockups/`](docs/mockups/)
- [ ] **Pantalla: Dashboard / Home** — Revisar mockup modular en [`docs/mockups/`](docs/mockups/)
- [ ] **Pantalla: Ejecución de Entrenamiento** — Revisar mockup de temporizador y tarjeta IA en [`docs/mockups/`](docs/mockups/)

---

## 🔧 Fase 2 — Lógica Backend e IA `PENDIENTE`

> Objetivo: conectar la app con Firebase y el motor de IA para funcionalidad real.

- [ ] Integración de Firebase Auth (Email/Password)
- [ ] Integración de Firebase Auth (Apple Sign-In + Google Sign-In) — requiere build nativo
- [ ] Configuración de Firestore (esquemas de datos: usuarios, rutinas, historial)
- [ ] Conexión segura con Gemini vía Genkit (generación de rutinas y alternativas)
- [ ] Lógica de recomendaciones IA en tiempo real (peso, reps, RIR)

---

## 🚀 Fase 3 — Pulido y Producción `PENDIENTE`

> Objetivo: preparar la app para su lanzamiento.

- [ ] Micro-vídeos / animaciones de ejercicios
- [ ] Soporte Offline (reglas de caché de Firestore)
- [ ] Configuración de EAS Build y despliegue Beta (TestFlight / Google Play Internal)
- [ ] Notificaciones push (recordatorios de entrenamiento)
- [ ] Analíticas y métricas (Firebase Analytics)

---

## 📐 Instrucciones Operativas para la IA

> [!IMPORTANT]
> **Estas reglas son obligatorias para cualquier agente IA que trabaje en este proyecto.**

1. **Trazabilidad**: Consulta y marca con `[x]` las tareas de este `ROADMAP.md` a medida que se completen. Marca con `[/]` las que estén en progreso.

2. **Regla Visual Estricta**: Antes de maquetar **cualquier pantalla** de la Fase 1, es **obligatorio** consultar el archivo de imagen correspondiente en `docs/mockups/` para replicar exactamente la jerarquía, los colores y la disposición de los elementos.

3. **Diseño centralizado**: Todos los colores y tokens de diseño deben venir de `constants/theme.ts`. Nunca hardcodear valores hex fuera de ese archivo.

4. **Variables sensibles**: Las credenciales van en `.env` (gitignored). Usar siempre el prefijo `EXPO_PUBLIC_` para variables accesibles en el cliente.

---

<p align="center">
  <sub>Última actualización: 5 de marzo de 2026</sub>
</p>
