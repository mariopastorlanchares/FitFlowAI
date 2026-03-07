# [P1-02] Pantalla: Dashboard / Home

> **Fase:** 1 | **Complejidad:** XL | **Estado:** ⬜ Pendiente

## 🎯 Objetivo
Maquetar la pantalla principal de la aplicación (Dashboard) donde el usuario aterrizará tras iniciar sesión. Esta pantalla debe mostrar un resumen del estado del usuario, la rutina actual o sugerida, progreso semanal, y acceso rápido a empezar un entrenamiento. El diseño debe ser modular y altamente energético.

## 🎨 Referencias de Diseño
- Mockup: [`docs/mockups/dashboard.jpg`](../mockups/dashboard.jpg)
- Colores clave: Fondo oscuro (`#0D0D0D`), acentos en naranja (`#FF8C00`), tarjetas con fondo ligeramente más claro para contraste (`#1A1A1A` o similar en theme).
- Tipografía: Inter (ya configurada).

## 📋 Requisitos Previos
- [x] Autenticación funcional (Login/Registro funciona).
- [x] Sistema de diseño configurado (`constants/theme.ts`).
- [x] Soporte de internacionalización (i18n) configurado.

## 🛠️ Plan de Implementación

### Paso 1: Estructura Base y Layout
- [ ] **Acción:** Crear el layout o pantalla principal para la zona de usuarios autenticados.
- [ ] **Archivos afectados:** `app/(tabs)/index.tsx` (o equivalente, dependiendo si usaremos pestañas, pero de momento la pantalla).
- [ ] **Detalles:** Asegurar que el scroll vertical funcione. El color de fondo se encarga mediante la textura global.

### Paso 2: Componente Header del Usuario
- [ ] **Acción:** Crear un componente para mostrar el saludo, el nombre del usuario (o "Atleta") basado en `useAuth()`, su avatar y un posible botón de ajustes.
- [ ] **Archivos afectados:** `components/dashboard/UserHeader.tsx`
- [ ] **Detalles:** Implementar saludo según la hora (opcional) usando i18next.

### Paso 3: Componente "Rutina de Hoy" (Hero Card)
- [ ] **Acción:** Maquetar la tarjeta principal y más destacada (CTA primario). Debe mostrar el resumen de lo que toca hoy (ej. "Empuje (Pecho, Hombro, Tríceps)"), e incluir un botón grande para "Empezar" con acento naranja intenso.
- [ ] **Archivos afectados:** `components/dashboard/TodayWorkoutCard.tsx`
- [ ] **Detalles:** Usar los tokens de diseño de NativeWind. Aplicar micro-interacciones u opacidades correctas en botones.

### Paso 4: Componente Progreso Semanal (Widget)
- [ ] **Acción:** Maquetar un pequeño widget con los días de la semana, marcando el día actual, y si se ha entrenado o no los previos.
- [ ] **Archivos afectados:** `components/dashboard/WeeklyProgress.tsx`

### Paso 5: Componente "Actividad Reciente / Métricas"
- [ ] **Acción:** Maquetar lista o stats rápidos debajo del hero.
- [ ] **Archivos afectados:** `components/dashboard/MetricsOverview.tsx`

### Paso 6: Integración Final y Ensamblaje
- [ ] **Acción:** Ensamblar los componentes en el archivo de la pantalla. Gestionar el espaciado vertical (`gap`) consistentemente evaluando el aspecto completo frente a la imagen.
- [ ] **Archivos afectados:** La pantalla (ej. `app/(tabs)/index.tsx` o `app/(protected)/dashboard.tsx`).

## ✅ Criterios de Aceptación
- [ ] El dashboard carga instantáneamente y respeta el layout del móvil (safe areas).
- [ ] El diseño se asemeja estructuralmente e visualmente al archivo `dashboard.jpg`.
- [ ] Los textos están centralizados a través de i18next (sin textos quemados directamente salvo los placeholders temporales de datos que se conectarán después).
- [ ] Se respeta al 100% las restricciones de colores y tipografías.

## 📝 Notas Técnicas / Aprendizajes
(Vacío por ahora. Para documentar durante el proceso)

---
**Historial:**
- `2026-03-07`: Creado el plan.
