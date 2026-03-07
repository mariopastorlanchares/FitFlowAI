# [P1-02] Pantalla: Dashboard / Home

> **Fase:** 1 | **Complejidad:** XL | **Estado:** ✅ Completado

## 🎯 Objetivo
Maquetar la pantalla principal de la aplicación (Dashboard) donde el usuario aterrizará tras iniciar sesión. Esta pantalla tiene un claro enfoque en **"El Entrenamiento de Hoy"** (Acción Directa), incitando al usuario a comenzar su rutina actual. El diseño debe ser muy limpio, energético y con una fuerte jerarquía visual centrada en el CTA principal.

## 🎨 Referencias de Diseño y Evolución
- Mockup Inicial: [`docs/mockups/dashboard.jpg`](../mockups/dashboard.jpg)
- **Iteración 1 (Refinamiento Actual):** Se busca aprovechar el espacio en dispositivos modernos (ej. iPhone 12/Pro) y reducir el "ruido" visual del botón primario.
  - Header superior (Logo + "FitFlow AI") más balanceado.
  - Sección superior: **Contexto de Entrenamiento** (Ej: Botones/Píldoras para elegir "Casa", "Gimnasio", "Parque" y sliders/selector para "45 min", "1 hora").
  - Tarjeta central oscura con la sugerencia basada en el contexto: `TU RUTINA DE HOY`.
  - Botón de Acción (`EMPEZAR`): Conserva colorimetría (naranja) pero es más discreto y elegante, menos masivo.
  - Racha Semanal debajo integrada de forma limpia.

## 📋 Requisitos Previos
- [x] Autenticación funcional (Login/Registro funciona).
- [x] Sistema de diseño configurado (`constants/theme.ts`).
- [x] Soporte de internacionalización (i18n) configurado.

## 🛠️ Plan de Implementación

### Paso 1: Sistema de Navegación Principal (Bottom Tabs)
- [x] **Acción:** Crear y configurar un diseño base de navegación inferior.

### Paso 2: Componente HeaderLogo
- [x] **Acción:** Componente simple superior (`HeaderLogo.tsx`).

### Paso 3: Selector de Contexto Rápido (NUEVO)
- [x] **Acción:** Crear un componente donde el usuario indique cómo va a entrenar hoy para que Gemini genere/adapte su tarjeta luego.
- [x] **Archivos afectados:** `components/dashboard/WorkoutContextSelector.tsx`.
- [x] **Detalles:** Debe incluir un `ScrollView` horizontal (Chips) para el **Lugar** (Gimnasio, Casa, Calistenia, Cardio Libre) y otro para la duración objetivo (Ej: "30 min", "45 min", "60+ min").

### Paso 4: Componente "Rutina de Hoy" y Botón Refinado
- [x] **Acción:** Actualizar la tarjeta central combinándola con un nuevo CTA más discreto.
- [x] **Archivos afectados:** `components/dashboard/TodayWorkoutCard.tsx`, `index.tsx`.
- [x] **Detalles:** El botón "Empezar Entrenamiento" dejará de ser una gran barra bajo la tarjeta. Se integrará dentro de la tarjeta o será un botón estilizado redondo/ovalado de tamaño medio debajo de ella.

### Paso 5: Layout Final en Pantallas Altas (Espaciado)
- [x] **Acción:** En `app/(tabs)/index.tsx`, distribuir equitativamente el espacio.
- [x] **Detalles:** Usar `justifyContent: 'space-between'` o márgenes flexibles para que Header, Menú de Contexto, Tarjeta de Entrenamiento y Rachas llenen un iPhone moderno (Safe Area superior e inferior) sin quedar todo pegado arriba.

## ✅ Criterios de Aceptación
- La pantalla Home replica visualmente la jerarquía del mockup adjuntado.
- El Tab Navigator funciona y muestra los iconos correctos en la parte inferior.
- El diseño respeta el sistema de tokens oscuros de la app.
- No hay textos "quemados" (todo está internacionalizado).

---
**Historial:**
- `2026-03-07`: Creado el plan original.
- `2026-03-07`: Pivotado hacia interfaz conversacional (Revertido).
- `2026-03-07`: Revertido y adaptado estrictamente al mockup "Enfoque en El Entrenamiento de Hoy".
