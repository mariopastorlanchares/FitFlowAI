# P1-03: Perfil y Ajustes (Logout)

> **Fase:** 1 | **Complejidad:** M | **Estado:** ✅

## 🎯 Objetivo
Desarrollar la pantalla de Perfil y Ajustes (tercer tab del Bottom Nav), que servirá como centro de control para las preferencias del usuario. El objetivo principal e inmediato es implementar el diseño base y el botón funcional de **Cerrar Sesión (Logout)** conectado a Firebase Auth, lo que permitirá a los usuarios salir de la aplicación y volver a la pantalla de Login de forma segura.

## 🎨 Referencias de Diseño
- Componentes clave a utilizar (`constants/theme.ts`): Fondo `bg-background` (`#121212`), textos en `text-textPrimary`, colores de peligro para el botón de Logout (p. ej. rojo o naranja de advertencia).

## 📋 Requisitos Previos
- [x] P1-01: Autenticación base (Login/Registro) completada.
- [x] P1-02: Dashboard maquetado.
- [x] Archivo `lib/i18n.ts` configurado para traducciones.

## 🛠️ Plan de Implementación

### Paso 1: Configurar Traducciones (i18n)
- [ ] **Acción:** Añadir claves de traducción para la pantalla de Perfil tanto en Español como en Inglés.
- [ ] **Archivos afectados:** `lib/i18n.ts`
- [ ] **Detalles:** Textos como "Ajustes de Cuenta", "Preferencias", "Cerrar sesión", y mensajes de confirmación de logout.

### Paso 2: Construir UI de la Pantalla de Perfil
- [ ] **Acción:** Rediseñar la pantalla actual de "Coming Soon".
- [ ] **Archivos afectados:** `app/(tabs)/profile.tsx`
- [ ] **Detalles:** Crear un layout que incluya:
  - Cabecera con un avatar placeholder y el email del usuario actual (obtenido desde Firebase Auth).
  - Secciones visuales (Account, Preferences, Support) usando íconos de `lucide-react-native`.
  - Botón destacado de "Cerrar Sesión" al final.

### Paso 3: Integrar Lógica de Logout
- [ ] **Acción:** Añadir la función `signOut` de Firebase.
- [ ] **Archivos afectados:** `app/(tabs)/profile.tsx`
- [ ] **Detalles:** 
  - Al pulsar el botón de Logout, mostrar un `Alert` de confirmación de React Native.
  - Ejecutar `signOut(auth)`.
  - El sistema de enrutamiento (Auth Listener en `_layout.tsx`) debe detectar el cambio de estado de autenticación y redireccionar automáticamente al menú de Login.

### Paso 4: Pruebas Unitarias Básicas (Jest)
- [ ] **Acción:** Asegurar que el entorno de testing (`jest-expo`, `@testing-library/react-native`) esté configurado.
- [ ] **Acción:** Escribir tests unitarios básicos para `ProfileScreen` (e.g. que renderiza los textos correctamente y que simula el Logout).
- [ ] **Archivos afectados:** `app/(tabs)/__tests__/profile.test.tsx` (o una carpeta `__tests__` global).

## ✅ Criterios de Aceptación
- [ ] La pantalla encaja perfectamente con la estética Dark Mode (fondo `#121212`).
- [ ] Todos los textos están internacionalizados (sin strings en duro en la UI).
- [ ] El botón de cerrar sesión expulsa correctamente al usuario y limpia el estado de la sesión, enviándolo al `/(auth)/login`.
- [ ] Los tests unitarios del componente pasan correctamente.

## 📝 Notas Técnicas / Aprendizajes
*(Se rellenará tras la implementación)*

---
**Historial:**
- `2026-03-07`: Creado el plan.
