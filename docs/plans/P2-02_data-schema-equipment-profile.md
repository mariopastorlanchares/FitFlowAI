# P2-02 Esquema de Datos + Perfil de Equipamiento

> **Fase:** 2 | **Complejidad:** L | **Estado:** ⬜

## 🎯 Objetivo
Definir el modelo de datos base de FitFlow AI para usuarios, rutinas, historial y restricciones de equipamiento, de forma que la generación de sesiones pueda invalidar ejercicios incompatibles con el material real disponible por el usuario.

El punto clave no es solo guardar preferencias, sino formalizar restricciones operativas:
- `location` no será un filtro visual, sino una entrada funcional del generador
- el material disponible en casa debe persistirse en el perfil del usuario
- las rutinas sugeridas no deben incluir ejercicios que dependan de equipamiento no disponible

## 🎨 Referencias de Diseño
- Superficies actuales afectadas:
  - `src/features/dashboard/components/workout-context-selector.tsx`
- Tokens existentes:
  - `src/shared/constants/theme.ts`

## 📋 Requisitos Previos
- [x] Firebase Auth Email/Password funcionando
- [x] Refactor FSD completado
- [ ] Configuración base de Firestore (reglas, índices)
- [ ] Decidir taxonomía inicial de equipamiento soportado

## 🛠️ Plan de Implementación

### Paso 1: Definir el contrato de datos del usuario
- [ ] **Acción:** Diseñar el documento `userProfile` con campos de contexto de entrenamiento y equipamiento
- [ ] **Archivos afectados:** futuro plan de esquema Firestore, tipos compartidos y documentación técnica
- [ ] **Detalles:** Incluir al menos `preferredLocations`, `homeEquipment`, `experienceLevel`, y una estructura que permita distinguir entre equipamiento disponible siempre y equipamiento opcional.

### Paso 2: Diseñar la taxonomía de equipamiento
- [ ] **Acción:** Establecer un catálogo controlado de material soportado por el sistema
- [ ] **Archivos afectados:** futuros tipos compartidos, catálogos y validadores
- [ ] **Detalles:** Evitar texto libre como fuente primaria. La IA necesita claves canónicas (`dumbbells`, `bench`, `bands`, `pullup_bar`, etc.) para filtrar ejercicios con fiabilidad.

### Paso 3: Conectar equipamiento con el dominio de ejercicios
- [ ] **Acción:** Añadir compatibilidad requerida por ejercicio o patrón de ejercicio
- [ ] **Archivos afectados:** futuro esquema de ejercicios/rutinas y capa de generación
- [ ] **Detalles:** Cada ejercicio debe declarar requisitos mínimos de equipamiento para permitir invalidación determinista antes de mostrar o generar la sesión.

### Paso 4: Definir el contrato de generación de sesiones
- [ ] **Acción:** Formalizar que `location` y `homeEquipment` entren como hard constraints del generador
- [ ] **Archivos afectados:** futuro plan de Genkit/Gemini, funciones de construcción de prompt y validadores post-generación
- [ ] **Detalles:** Si `location === home`, el sistema no debe sugerir ejercicios incompatibles con `homeEquipment`. Si no hay cobertura suficiente, debe degradar a alternativas válidas o informar falta de material.

### Paso 5: Planificar la captura de datos en producto
- [ ] **Acción:** Diseñar en qué momento de onboarding o perfil se recopila el material disponible en casa
- [ ] **Archivos afectados:** futuras features `profile` y/o onboarding
- [ ] **Detalles:** La captura debe poder editarse con facilidad, porque el equipamiento del usuario cambia con el tiempo.

### Paso 6: Validación y tests del modelo
- [ ] **Acción:** Preparar criterios de prueba para asegurar que las restricciones se respetan
- [ ] **Archivos afectados:** futuros tests de dominio, validadores y generador
- [ ] **Detalles:** Cubrir casos como "usuario en casa sin banco", "usuario con bandas pero sin barra", y "usuario cambia de `gym` a `home` sin rehacer manualmente la rutina".

## ✅ Criterios de Aceptación
- [ ] Existe una estructura de datos definida para `homeEquipment` dentro del perfil de usuario
- [ ] `location` queda documentado como hard constraint del sistema de generación
- [ ] Cada ejercicio o familia de ejercicios puede mapearse a requisitos mínimos de equipamiento
- [ ] La futura IA no depende de texto libre del usuario para inferir material disponible
- [ ] Queda previsto dónde se captura y edita el material doméstico dentro del producto

## 📝 Notas Técnicas / Aprendizajes
- Si el equipamiento se modela demasiado abierto, la generación será inconsistente y difícil de validar.
- Si se modela demasiado rígido, costará ampliar el catálogo. Conviene una taxonomía controlada con opción futura de alias.
- La invalidación por equipamiento debe ocurrir antes y después de la generación:
  1. antes, como restricción de entrada
  2. después, como validación defensiva sobre la rutina propuesta

---
**Historial:**
- `2026-03-21`: Creado el plan para incorporar `homeEquipment` y `location` como restricciones duras del sistema de generación.
