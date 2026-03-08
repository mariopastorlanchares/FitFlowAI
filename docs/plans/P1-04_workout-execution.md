# P1-04 Pantalla de Ejecución de Entrenamiento

> **Fase:** 1 | **Complejidad:** XL | **Estado:** ⬜

## 🎯 Objetivo
Maquetar la pantalla interactiva principal donde el usuario visualiza y ejecuta su rutina de entrenamiento en curso. Debe permitir llevar la cuenta del tiempo, las series, repeticiones y peso, y proporcionar feedback visual de avance. Esta pantalla será la vista "en vivo" más dinámica de la aplicación.

## 🎨 Referencias de Diseño
- Mockup: `docs/mockups/activity.jpg` y `docs/mockups/activity-2.jpg`
- Componentes clave a utilizar (`constants/theme.ts`)
  - Acentos de color naranja (brand, primario)
  - Variaciones de fondos oscuros (`#181818`, `#242424`)
  - Typography system y componentes existentes (Headers, Buttons).

## 📋 Requisitos Previos
- [x] Configuración del proyecto y componentes UI base creados
- [x] Pantalla de Dashboard (para navegar a la ejecución de entrenamiento)
- [x] Internacionalización central (i18n)

## 🛠️ Plan de Implementación

### Paso 1: Configuración de Ruta y Tipado
- [ ] **Acción:** Crear la estructura de la Screen en Expo Router.
- [ ] **Archivos afectados:** `app/(tabs)/workout/index.tsx`, `types/workout.ts`
- [ ] **Detalles:** Definir los tipos de datos simulados para una sesión en curso (ejercicio actual, series, historial de la sesión).

### Paso 2: UI Base y Header
- [ ] **Acción:** Maquetar el layout principal y el header interactivo.
- [ ] **Archivos afectados:** `app/(tabs)/workout/index.tsx`
- [ ] **Detalles:** Incluir un navbar con el progreso general, nombre del entrenamiento y botón para salir/pausar.

### Paso 3: Visualizador del Ejercicio Activo
- [ ] **Acción:** Crear la vista principal para el ejercicio en curso.
- [ ] **Archivos afectados:** `components/workout/ActiveExercise.tsx`
- [ ] **Detalles:** Mostrar título, imagen o animación de placeholder que evite los genéricos (simular video de ejercicio), y una breve descripción/instrucciones.

### Paso 4: Creador de Series (Set Tracker)
- [ ] **Acción:** Maquetar la lista de series con inputs para peso y repeticiones.
- [ ] **Archivos afectados:** `components/workout/SetTracker.tsx`
- [ ] **Detalles:** Cada fila representa una serie (Set 1, Set 2...). Debe incluir un botón/checkbox vistoso y animado para marcar completada (usar estado reactivo y Reanimated si es necesario para el micro-feedback).

### Paso 5: Controles de Transición (Temporizador/Navegación)
- [ ] **Acción:** Implementar botones de flujo y un rest timer opcional en el mockup.
- [ ] **Archivos afectados:** `components/workout/WorkoutControls.tsx`, `components/workout/RestTimerModal.tsx`
- [ ] **Detalles:** Botón flotante o fijo inferior de "Siguiente Ejercicio" y/o "Finalizar Entrenamiento".

## ✅ Criterios de Aceptación
- [ ] La interfaz encaja a nivel milimétrico con los mockups (`activity.jpg`, `activity-2.jpg`).
- [ ] Los textos están centralizados en los archivos de traducción (ES y EN).
- [ ] Se siente altamente "premium", sin colores genéricos: usa los definidos en `theme.ts` y aprovecha el sistema dark mode actual.
- [ ] La pantalla responde bien al teclado (KeyboardAvoidingView) si el usuario enfoca un TextInput de peso/repeticiones.

## 📝 Notas Técnicas / Aprendizajes
[A rellenar durante la maquetación]

---
**Historial:**
- `2026-03-08`: Creado el plan interactivo.
