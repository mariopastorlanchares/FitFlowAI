# P2-04B Integracion Runtime de Genkit + Gemini

> **Fase:** 2 | **Complejidad:** XL | **Estado:** 🔄

## 🎯 Objetivo
Conectar FitFlow AI con Gemini de forma segura y operativa usando Genkit en servidor, de modo que la app Expo pueda solicitar sesiones reales sin exponer claves ni depender de lógica de IA embebida en cliente.

El contrato del generador ya está cerrado en `P2-04`. Este plan cubre la bajada a ejecución real:
- runtime server-side para prompts y validación
- frontera segura entre app y backend
- primera llamada real desde producto

## 🎨 Referencias de Diseño
- Pantalla afectada: `src/features/workout/screens/workout-execution-screen.tsx`
- Contrato y compatibilidad ya cerrados: `docs/plans/P2-04_generator-contract-exercise-compatibility.md`
- Perfil operativo y constraints: `docs/plans/P2-02_data-schema-equipment-profile.md`
- Tokens existentes: `src/shared/constants/theme.ts`

## 📋 Requisitos Previos
- [x] Contrato tipado de entrada/salida del generador cerrado
- [x] Catálogo V1 de ejercicios y `requiredCapabilities` congelados
- [x] Saneado defensivo y adaptación a UI ya cubiertos en tests
- [x] Decidir frontera de ejecución segura para Genkit
- [x] Preparar workspace backend para flows y despliegue
- [x] Provisionar secreto real y validar una llamada end-to-end contra proveedor
- [ ] Endurecer el acceso a la callable con auth/App Check antes de considerarla cerrada como superficie segura

## 🧭 Decisión Arquitectónica de este slice
- Para esta app, la integración inicial debe ir por **Genkit server-side**, no por Firebase AI Logic directo en cliente.
- Razón:
  - el roadmap pide una conexión segura vía Genkit
  - la app necesita validación y saneado antes de exponer la sesión
  - el contrato tipado ya vive mejor en backend que en cliente
- La app Expo consumirá un endpoint callable/HTTP controlado por Firebase, no el modelo directamente.
- La primera integración debe diseñarse con un **presupuesto objetivo de 10 USD/mes**, aprovechando el crédito mensual incluido en Google AI Pro.

## 💸 Restricción de Coste
- Presupuesto operativo inicial: **10 USD/mes** como techo blando del experimento.
- El diseño V1 debe intentar vivir primero en free tier y, cuando haya consumo facturable, mantenerse dentro de ese margen.
- No se permitirá una arquitectura que dependa desde el día 1 de features con coste variable difícil de acotar.

## 🧪 Estrategia de Modelo para V1
- Modelo por defecto: **`gemini-2.5-flash-lite`** por coste y latencia.
- Modelo de reserva: **`gemini-2.5-flash`** solo si `flash-lite` demuestra calidad insuficiente en sesiones estructuradas reales.
- No usar `Pro`, grounding con Google Search, herramientas externas ni contexto inflado en esta primera iteración.
- La generación debe centrarse en texto estructurado y salida JSON validable, que es el caso de uso más barato y más alineado con el contrato ya cerrado.

## 🛡️ Guardarraíles de Presupuesto
- Limitar explícitamente el tamaño del prompt: solo payload estructurado, sin historial largo ni texto redundante.
- Limitar explícitamente la salida esperada: una sola sesión, bloques acotados y sin explicación conversacional adicional.
- Una única llamada al modelo por solicitud de sesión; sin bucles automáticos de reintento sobre el modelo en V1.
- Fallback honesto a preview local si falla la generación o si el backend rechaza la salida.
- Instrumentar logs mínimos de uso por request para poder estimar volumen antes de abrir la puerta a más superficies.
- Dejar preparado un punto de configuración para cambiar de modelo sin rehacer el flow.

## 🛠️ Plan de Implementación

### Paso 1: Preparar el runtime backend para Genkit
- [x] **Acción:** Crear el workspace backend donde vivirá el flujo de generación
- [x] **Archivos afectados:** nuevo directorio `functions/` o workspace backend equivalente, `firebase.json`, configuración de scripts
- [x] **Detalles:** Debe quedar claro el punto de entrada, dependencias de Genkit/Firebase Functions y el modelo de despliegue local/remoto.
- [x] **Decisión esperada:** Empezar con `@genkit-ai/google-genai` y secreto de servidor antes de valorar Vertex AI.

### Paso 2: Compartir el contrato entre app y backend
- [x] **Acción:** Decidir qué tipos y validadores se reutilizan tal cual y cuáles deben exponerse al runtime backend
- [x] **Archivos afectados:** `src/shared/types/generator-contract.ts`, `src/shared/lib/generator-contract.ts`, posible paquete o carpeta compartida
- [x] **Detalles:** Evitar duplicar el contrato a mano entre app y backend. Si hace falta desacoplar, hacerlo explícito y con ownership claro.
- [x] **Resultado del slice:** Se extrae `workout-context` como vocabulario de dominio puro para que el backend reutilice el contrato sin acoplarse a detalles de Firestore/cliente.

### Paso 3: Implementar el flow de Genkit
- [x] **Acción:** Crear el flow que recibe `GenerateWorkoutSessionInput`, construye el prompt y devuelve `GeneratedWorkoutSession`
- [x] **Archivos afectados:** backend Genkit flow, configuración de modelo, prompt builder
- [x] **Detalles:** El flow debe producir siempre salida estructurada y pasar por validación runtime antes de responder.
- [x] **Guardarraíl:** El flow debe fijar por configuración el modelo inicial de bajo coste y los límites de salida razonables.
- [x] **Resultado del slice:** El flow usa `gemini-2.5-flash-lite`, prompt compacto, parseo JSON tolerante y saneado defensivo antes de responder.

### Paso 4: Exponer una frontera segura para la app
- [x] **Acción:** Publicar el flow mediante callable/HTTP seguro de Firebase
- [x] **Archivos afectados:** Firebase Functions wrapper, secretos/config, documentación de despliegue
- [x] **Detalles:** La clave del proveedor debe vivir en secreto de servidor. La app no debe conocerla ni derivarla.
- [x] **Pendiente operativo:** Crear `GEMINI_API_KEY` en Secret Manager y validar despliegue/emulación real.
- [x] **Auth hardening aplicado:** La callable ya exige `authPolicy: isSignedIn()` y el cliente incluye guard de `auth.currentUser` antes de invocar.
- [ ] **Pendiente de hardening:** Activar `enforceAppCheck` con debug provider para desarrollo y documentar la configuración de providers nativos para producción.

### Paso 5: Conectar el cliente Expo
- [x] **Acción:** Añadir un servicio/hook en la app que invoque el backend con el payload generado desde el perfil real del usuario
- [x] **Archivos afectados:** feature `workout`, posibles hooks en `dashboard` o `profile`, capa de servicios compartida
- [x] **Detalles:** La app debe construir el input con el builder actual, invocar el backend y manejar `loading/error/empty`.
- [x] **Guardarraíl:** La UI no debe disparar generaciones repetidas por re-render ni por focos espurios.

### Paso 6: Integrar respuesta real en el flujo de workout
- [x] **Acción:** Reemplazar el preview estático por una sesión generada de verdad cuando haya respuesta válida
- [x] **Archivos afectados:** `src/features/workout/services/workout-service.ts`, hook de workout, dashboard/trigger de inicio
- [x] **Detalles:** Mantener fallback honesto a preview si la generación falla, para no romper la UX mientras estabilizamos.
- [x] **Resultado del slice:** `workout` ya intenta callable real con `profile` autenticado y cae a preview compatible con capacidades si el backend falla.

### Paso 7: Tests, emulación y verificación
- [x] **Acción:** Añadir tests del flow, del wrapper callable y del consumo cliente
- [x] **Archivos afectados:** tests backend y frontend, scripts de verificación
- [x] **Detalles:** Cubrir contrato válido, rechazo estructural, degradación, error de red y fallback de producto.
- [x] **Guardarraíl:** Añadir al menos una prueba que asegure que la configuración por defecto usa el modelo barato y no habilita features no presupuestadas.
- [x] **Pendiente operativo:** Ejecutar emulación callable o llamada real con secreto provisionado.

## ✅ Criterios de Aceptación
- [x] Existe un runtime backend claro para Genkit dentro del proyecto
- [x] El flow recibe `GenerateWorkoutSessionInput` y devuelve `GeneratedWorkoutSession`
- [x] La salida pasa validación runtime antes de volver al cliente
- [x] La app Expo consume el backend sin exponer secretos
- [x] `workout` puede cargar una sesión real o degradar a fallback honesto
- [x] La integración queda cubierta por TypeScript, lint y tests relevantes
- [x] Existe al menos una ejecución real validada con secreto y entorno configurado
- [x] La callable rechaza solicitudes anónimas mediante `authPolicy: isSignedIn()`
- [x] La callable usa `enforceAppCheck: true` con debug provider para desarrollo y deja pendiente los native providers para Phase 4

## 📝 Notas Técnicas / Aprendizajes
- Firebase AI Logic y Genkit no resuelven el mismo problema: el primero prioriza SDK cliente; el segundo, orquestación server-side.
- Aquí conviene empezar por servidor porque ya hemos invertido en contrato, compatibilidad y saneado.
- La decisión clave antes de codificar es el ownership del contrato compartido entre app y backend.
- En marzo de 2026, Google AI Pro expone crédito mensual de Cloud suficiente para tratar esta integración como experimento controlado, pero no como licencia para diseñar sin límites.

## ▶️ Siguiente Slice Recomendado
- **Objetivo:** Retomar deuda técnica visual y de integración: ola C de P2-01 (datos reales en la UI sin mocks) o modelado de historial/sesiones guardadas de P2-02.
- **Motivación:** La superficie segura de Genkit ya está garantizada en V1. El backend ya está maduro para que el frontend consuma sus datos reales.
- **Alcance propuesto:** A debatir. Posiblemente `P2-01 Ola C` eliminando mocks de Workout Execution y conectando con el pipeline real, o `P2-02` añadiendo el esquema Firestore para el log de sesiones.

---
**Historial:**
- `2026-03-28`: Creado el plan JIT para la integración runtime segura de Genkit + Gemini tras cerrar contrato, saneado y adaptación de UI en `P2-04`.
- `2026-03-28`: Plan ajustado para presupuesto objetivo de 10 USD/mes, con `gemini-2.5-flash-lite` como punto de partida y guardarraíles explícitos de coste.
- `2026-03-28`: Slice de implementación completado: workspace `functions/`, flow Genkit callable, cliente Expo conectado con fallback honesto y verificación local por TypeScript, lint y tests.
- `2026-03-28`: Smoke test real exitoso contra `generateWorkoutSession` en `europe-west1`; se añade salida estructurada con esquema, transformación a contrato final y saneado adicional para duplicados en bloques compuestos.
- `2026-03-28`: Corregida la normalización de `equipment_profile.context_capabilities` para tolerar `null` cuando el campo no aplica, redeploy realizado y generación real validada de nuevo desde la app.
- `2026-03-28`: La UI de `workout` expone ya `live` vs `fallback` y contexto real de bloque (`superset`, `circuit`, `emom`) mediante `displayBlocks`, sin romper la ejecución secuencial actual.
- `2026-03-28`: Auth hardening aplicado: la callable exige `authPolicy: isSignedIn()` via `firebase-functions/https` y el cliente añade guard de `auth.currentUser` antes de invocar. Verificado con `npx tsc --noEmit` en ambos workspaces y `npm run lint`.
- `2026-03-28`: App Check hardening aplicado: la callable exige `enforceAppCheck: true` y el cliente expone un Debug Provider (`CustomProvider` con token) para desarrollo sin romper tests. Configuración nativa queda como deuda para Fase 4 de producción. Integración V1 completada.
