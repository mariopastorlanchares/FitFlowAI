# P2-02 Esquema de Datos + Perfil de Equipamiento

> **Fase:** 2 | **Complejidad:** L | **Estado:** 🔄

## 🎯 Objetivo
Definir el modelo de datos base de FitFlow AI para usuarios, rutinas, historial y restricciones de equipamiento, de forma que la generación de sesiones pueda invalidar ejercicios incompatibles con el material real disponible por el usuario.

El punto clave no es solo guardar preferencias, sino formalizar restricciones operativas:
- `location` no será un filtro visual, sino una entrada funcional del generador
- el material disponible en casa debe persistirse en el perfil del usuario
- las rutinas sugeridas no deben incluir ejercicios que dependan de equipamiento no disponible

## 🧭 Enfoque Maestro
- **Dominio antes que persistencia:** primero se congela el contrato semántico; después se diseña cómo guardarlo en Firestore.
- **Compatibilidad antes que inventario:** en V1 necesitamos responder "¿este ejercicio es válido aquí?" antes que modelar el gimnasio completo del usuario.
- **Taxonomía canónica antes que traducciones:** las claves de dominio deben ser estables (`dumbbells`, `bench`, etc.) y la UI ya se encargará de traducirlas.
- **Restricción de generación en dos capas:** el sistema debe filtrar por equipamiento antes de generar y volver a validar después de generar.
- **Captura editable:** el perfil de equipamiento debe poder modificarse desde producto sin rehacer el modelo.

## 🎨 Referencias de Diseño
- Superficies actuales afectadas:
  - `src/features/dashboard/components/workout-context-selector.tsx`
- Tokens existentes:
  - `src/shared/constants/theme.ts`

## 📋 Requisitos Previos
- [x] Firebase Auth Email/Password funcionando
- [x] Refactor FSD completado
- [x] Configuración base de Firestore (reglas, índices)
- [x] Decidir taxonomía inicial de equipamiento soportado

## 🔒 Decisiones que hay que congelar primero
- [x] Lista canónica de claves de equipamiento V1
- [x] Estructura mínima de `userProfile.homeEquipment`
- [x] Regla de negocio para `location` como hard constraint
- [x] Nivel de detalle permitido en V1 para atributos opcionales de equipamiento
- [x] Qué se modela como "acceso agregado" y qué se modela como equipamiento específico

## 🧱 Taxonomía V1 congelada

### Convención
- Todos los ids canónicos de dominio usan `snake_case`.
- La ampliación futura se hace añadiendo nuevos ids canónicos al catálogo, no aceptando texto libre en persistencia.

### `homeEquipment` ids canónicos V1
- `dumbbells`
- `barbell`
- `bench`
- `bands`
- `pullup_bar`
- `kettlebell`

### `enabledCapabilities` ids canónicos V1
- `dumbbells`
- `barbell`
- `bench`
- `bands`
- `pullup_bar`
- `kettlebell`
- `parallel_bars`
- `rings_anchor`
- `machine_access`

### Capacidades implícitas fuera de persistencia
- `bodyweight`
  - Existe en dominio y validación, pero no se persiste en `homeEquipment` ni en `enabledCapabilities`.
  - El sistema la trata como capacidad implícita del usuario salvo excepción futura explícita.

### Atributos opcionales con valor real
- `dumbbells`
  - `isPair`
  - `adjustable`
  - `maxWeightKg`
- `barbell`
  - `platesAvailable`
  - `maxLoadKg`
- `bench`
  - `adjustableIncline`
- `bands`
  - `hasMultipleTensions`
- `kettlebell`
  - `availableWeightsKg`

### Fuera de V1
- Inventario completo de discos, racks, poleas, multipower, landmine o variantes avanzadas de barras
- Alias lingüísticos como dato de dominio (`mancuernas`, `pesas`, etc.)
- Marcas, modelos comerciales o calidad del equipamiento
- Catálogo detallado de máquinas por nombre
- Combinaciones derivadas tipo `home_gym_complete`

## 🪪 Contrato `userProfile` congelado

### Principio
- `userProfile` debe expresar contexto de entrenamiento y restricciones operativas del usuario.
- No debe mezclar copy de UI, traducciones ni estructura pensada "solo para Firestore".
- El contrato debe servir igual para validadores, hooks de producto y el generador.

### Campos mínimos propuestos
- `authUid`
  - Identificador del usuario autenticado.
  - En persistencia probablemente coincidirá con el id del documento, pero esa decisión se cierra en el plan de Firestore.
- `experienceLevel`
  - Enum controlado: `beginner` | `intermediate` | `advanced`
  - Sirve para modular volumen, complejidad técnica y progresión.
- `preferredLocations`
  - Lista ordenada o conjunto de ubicaciones válidas para el usuario.
  - V1: `home` | `gym` | `street` | `park`
  - En V1 sirve para producto/UX: ordenar, priorizar y personalizar el selector de Home.
- `defaultLocation`
  - Ubicación por defecto para preparar o regenerar sesión.
  - Debe pertenecer a `preferredLocations`.
  - En V1 actúa como valor inicial de interfaz, no como constraint del generador.
- `homeEquipment`
  - Mapa por clave canónica de equipamiento disponible en casa.
  - Debe guardar presencia real y, solo cuando aporte valor real, atributos opcionales.
- `contextProfiles`
  - Perfiles persistidos por contexto no doméstico cuando el entorno real importa para generar y validar sesiones.
  - V1 usa la misma forma para `park`, `gym` y `street`, aunque no todos los contextos tengan UI completa todavía.
- `updatedAt`
  - Campo técnico para detectar cambios relevantes del perfil.

### Estructura propuesta para `homeEquipment`
- El modelo preferido en V1 es un mapa por clave canónica, no texto libre ni listas ambiguas.
- Cada entrada representa equipamiento realmente disponible en casa.

Ejemplo conceptual:

```ts
homeEquipment: {
  dumbbells: {
    isPair: true,
    adjustable: true,
    maxWeightKg: 24,
  },
  bench: {
    adjustableIncline: false,
  },
  bands: {
    hasMultipleTensions: true,
  },
}
```

### Semántica propuesta
- Los atributos opcionales solo aparecen cuando cambian compatibilidad o calidad de recomendación.
- La ausencia de una clave implica "no disponible" en V1.
- `homeEquipment` y `contextProfiles.<location>.enabledCapabilities` no son intercambiables: el primero modela inventario doméstico persistente y el segundo capacidades efectivas del contexto concreto.
- `enabledCapabilities` solo admite ids canónicos del catálogo V1; no acepta texto libre.

### Decisiones de diseño importantes
- `bench` y `barbell` deben seguir separados; uno no implica el otro.
- `isPair` en `dumbbells` evita asumir bilateralidad cuando el usuario solo tiene una mancuerna.
- `bodyweight` pertenece a la taxonomía del dominio, pero no hace falta persistirlo en `homeEquipment` si lo tratamos como capacidad implícita.
- `machine_access` puede existir como clave del dominio, pero no debe formar parte de `homeEquipment` en V1; conviene tratarlo como capacidad agregada del contexto `gym`.
- `preferredLocations` y `defaultLocation` deben mejorar la UX de Home, pero no deben limitar las opciones disponibles ni convertirse en inputs del generador.
- `location` sigue siendo el único contexto de ubicación que condiciona la sesión concreta y la validación de equipamiento.
- Conviene usar un solo paradigma de datos para contextos variables: lista explícita de capacidades efectivas por contexto, aunque la UI pueda partir de plantillas distintas según `location`.
- `gym` y `park` deben usar la misma mecánica de captura: partir de una plantilla del contexto y permitir desmarcar capacidades no disponibles. La plantilla base sí debe ser distinta según la ubicación.
- El dato final persistido debe tener la misma forma en ambos casos: capacidades efectivas finales del contexto.
- La forma del contrato queda congelada; ampliar catálogo en el futuro requerirá añadir nuevos ids canónicos, no reinterpretar los existentes.

### Open Questions no bloqueantes
- Si hará falta distinguir entre mancuernas "presentes" y "útiles" cuando el peso máximo sea muy bajo. Esto no bloquea la congelación V1.

## 🗃️ Estructura persistible V1 en Firestore

### Principio de persistencia
- En V1 conviene persistir el perfil operativo del usuario en un único documento canónico.
- La meta no es normalizar al máximo, sino mantener lectura simple, escritura simple y contrato estable para producto y generador.
- El identificador natural del documento debe ser `authUid`.

### Documento principal propuesto
- **Ruta:** `userProfiles/{authUid}`
- **Responsabilidad:** concentrar el contexto estable de entrenamiento del usuario, sus preferencias de interfaz y sus capacidades persistidas por contexto.

### Campos propuestos para `userProfiles/{authUid}`

```ts
{
  authUid: string,
  experienceLevel: 'beginner' | 'intermediate' | 'advanced',
  preferredLocations: Array<'home' | 'gym' | 'street' | 'park'>,
  defaultLocation: 'home' | 'gym' | 'street' | 'park',

  homeEquipment: {
    dumbbells?: {
      isPair?: boolean,
      adjustable?: boolean,
      maxWeightKg?: number,
    },
    barbell?: {
      platesAvailable?: boolean,
      maxLoadKg?: number,
    },
    bench?: {
      adjustableIncline?: boolean,
    },
    bands?: {
      hasMultipleTensions?: boolean,
    },
    pullup_bar?: {},
    kettlebell?: {
      availableWeightsKg?: number[],
    },
  },

  contextProfiles: {
    gym?: {
      enabledCapabilities: Array<
        'dumbbells'
        | 'barbell'
        | 'bench'
        | 'bands'
        | 'pullup_bar'
        | 'kettlebell'
        | 'parallel_bars'
        | 'rings_anchor'
        | 'machine_access'
      >,
      templateId: 'gym_v1',
      updatedAt: Timestamp,
    },
    park?: {
      enabledCapabilities: Array<
        'dumbbells'
        | 'barbell'
        | 'bench'
        | 'bands'
        | 'pullup_bar'
        | 'kettlebell'
        | 'parallel_bars'
        | 'rings_anchor'
        | 'machine_access'
      >,
      templateId: 'park_v1',
      updatedAt: Timestamp,
    },
    street?: {
      enabledCapabilities: Array<
        'dumbbells'
        | 'barbell'
        | 'bench'
        | 'bands'
        | 'pullup_bar'
        | 'kettlebell'
        | 'parallel_bars'
        | 'rings_anchor'
        | 'machine_access'
      >,
      templateId: 'street_v1',
      updatedAt: Timestamp,
    },
  },

  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

### Semántica de persistencia
- La existencia de una clave en `homeEquipment` significa disponibilidad real en casa.
- `contextProfiles.<location>.enabledCapabilities` representa el resultado final persistido del contexto, no la interacción concreta usada para capturarlo.
- `enabledCapabilities` persiste solo ids canónicos de capability; no se almacenan alias, copy de UI ni valores arbitrarios.
- `templateId` permite saber desde qué plantilla de contexto se construyó el perfil, sin acoplar el dato persistido a la UI exacta del momento.
- `createdAt` y `updatedAt` sirven para trazabilidad básica y sincronización defensiva.

### Por qué un único documento en V1
- Reduce round trips y complejidad para cargar Home, Perfil y el input del generador.
- Evita repartir un perfil todavía pequeño entre varias colecciones prematuramente.
- Hace más fácil mantener consistencia entre preferencias de interfaz y restricciones operativas.

### Lo que NO metería todavía en este documento
- Rutinas generadas
- Historial de entrenamientos
- Estado efímero de una sesión activa
- Objetivos de reto o progresiones futuras (`pull-up`, `muscle-up`, etc.)
- Inventario detallado de máquinas o discos

### Posibles colecciones futuras fuera de V1
- `workoutPlans/{planId}`
- `workoutSessions/{sessionId}`
- `exerciseHistory/{entryId}`
- `userGoals/{goalId}`

### Decisiones de modelado que quedan implícitas
- `location` activa de una sesión no vive en `userProfiles`; pertenece al estado de sesión o al flujo de preparación actual.
- `gym` y `park` pueden compartir la misma forma persistida (`enabledCapabilities`), aunque partan de plantillas distintas.
- En V1, `contextProfiles` debe vivir embebido dentro de `userProfiles/{authUid}`; separarlo en subcolecciones no compensa todavía la complejidad extra.
- Si más adelante el perfil crece mucho, se podrá separar `contextProfiles` o `goals` sin romper las claves de dominio principales.

## 🛠️ Plan Maestro de Implementación

### Paso 1: Congelar invariantes de dominio
- [x] **Acción:** Acordar qué decisiones pertenecen al dominio y no a la capa de persistencia ni a la UI
- [x] **Archivos afectados:** este plan, `src/shared/types/user-profile.ts`
- [x] **Detalles:** Queda fijado que `location`, `homeEquipment` y `enabledCapabilities` son restricciones funcionales del generador, no simples preferencias visuales.

### Paso 2: Cerrar la taxonomía V1 de equipamiento
- [x] **Acción:** Validar y congelar la lista canónica de claves soportadas por el sistema
- [x] **Archivos afectados:** este plan, `src/shared/types/user-profile.ts`
- [x] **Detalles:** Se congela un catálogo V1 en `snake_case` y se separa explícitamente entre inventario doméstico (`homeEquipment`) y capacidades efectivas del contexto (`enabledCapabilities`). La IA y los validadores deben operar con estas claves canónicas, nunca con texto libre.

### Paso 3: Definir el contrato `userProfile`
- [x] **Acción:** Diseñar el documento `userProfile` con campos de contexto de entrenamiento y equipamiento
- [x] **Archivos afectados:** este plan, `src/shared/types/user-profile.ts`, `docs/plans/P2-03_firestore-foundation.md`
- [x] **Detalles:** Queda congelado un contrato V1 con `preferredLocations`, `defaultLocation`, `experienceLevel`, `homeEquipment` y `contextProfiles`, dejando claro que `preferredLocations`/`defaultLocation` son datos de UX y que `location` sigue siendo el input operativo del generador.

### Paso 4: Conectar equipamiento con el dominio de ejercicios
- [x] **Acción:** Añadir compatibilidad requerida por ejercicio o patrón de ejercicio
- [x] **Archivos afectados:** `src/shared/types/exercise-catalog.ts`, `src/shared/lib/exercise-catalog.ts`, `src/shared/lib/exercise-compatibility.ts`, `docs/plans/P2-04_generator-contract-exercise-compatibility.md`
- [x] **Detalles:** El catálogo V1 ya declara `requiredCapabilities` por `exercise_id` concreto y expone helpers de compatibilidad para invalidación determinista antes de mostrar o generar la sesión.

### Paso 5: Formalizar el contrato del generador
- [ ] **Acción:** Definir cómo `location` y `homeEquipment` entran al generador y cómo se validan las respuestas
- [ ] **Archivos afectados:** futuro plan de Genkit/Gemini, funciones de construcción de prompt y validadores post-generación
- [ ] **Detalles:** Si `location === home`, el sistema no debe sugerir ejercicios incompatibles con `homeEquipment`. Si `location` usa un contexto persistido (`park`, futuro `gym` con overrides), el generador debe consumir sus capacidades efectivas. Si no hay cobertura suficiente, debe degradar a alternativas válidas o informar falta de material.

### Paso 6: Diseñar la captura y edición en producto
- [x] **Acción:** Definir en qué momento de onboarding o perfil se recopila el material disponible en casa
- [x] **Archivos afectados:** `src/features/profile/screens/profile-screen.tsx`, `src/features/profile/components/profile-operational-settings-card.tsx`, `src/features/profile/components/profile-context-settings-card.tsx`, `src/features/profile/utils/context-profile-templates.ts`, `src/shared/lib/i18n.ts`, `__tests__/profile.test.tsx`
- [x] **Detalles:** En V1, `profile` ya permite editar el baseline operativo completo: preferencias, `homeEquipment` y `contextProfiles` para `park` y `gym`. La UX de contextos arranca desde plantillas amplias y el usuario recorta capacidades no disponibles; `street` queda visible como contexto futuro, fuera de edición en este slice.

### Paso 7: Bajar el contrato a Firestore
- [ ] **Acción:** Traducir el modelo de dominio a documentos, reglas e índices de Firestore
- [ ] **Archivos afectados:** futuro plan Firestore, reglas, índices, tipos compartidos y capa de acceso a datos
- [ ] **Detalles:** Este paso empieza solo cuando la taxonomía y `userProfile` ya están congelados, para evitar retrabajo transversal. Este plan ya incorpora un borrador de documento `userProfiles/{authUid}` que debe validarse antes de escribir reglas e índices.

### Paso 8: Validación y tests del modelo
- [ ] **Acción:** Preparar criterios de prueba para asegurar que las restricciones se respetan
- [ ] **Archivos afectados:** futuros tests de dominio, validadores y generador
- [ ] **Detalles:** Cubrir casos como "usuario en casa sin banco", "usuario con bandas pero sin barra", "usuario cambia de `gym` a `home` sin rehacer manualmente la rutina" y "usuario con una sola mancuerna".

## 🧪 Matriz de validación V1

### Objetivo de la validación
- Asegurar que el sistema no sugiera ejercicios incompatibles con el contexto real del usuario.
- Diferenciar entre ejercicios válidos, inválidos, degradables y sesiones que deben regenerarse.

### Reglas que deben cumplirse
- Si `location === home`, el generador solo puede usar capacidades derivadas de `homeEquipment` y de capacidades implícitas como `bodyweight`.
- `preferredLocations` y `defaultLocation` no deben alterar por sí mismos la validez de una sesión; solo afectan defaults y priorización de interfaz.
- Si un ejercicio requiere una clave no disponible, debe invalidarse antes de mostrarse o reemplazarse por una alternativa válida.
- Si la generación devuelve un ejercicio incompatible, la validación defensiva debe rechazarlo o degradarlo.
- Cambiar `location` debe revalidar la sesión actual, no solo futuras sugerencias.
- Los atributos opcionales solo deben influir cuando cambien compatibilidad o seguridad de la recomendación.

### Casos de prueba prioritarios

#### Caso 1: Casa con mancuernas, sin banco
- **Setup:** `location = home`, `homeEquipment = { dumbbells }`
- **Debe permitir:** variantes con mancuernas de pie, remo, press en suelo
- **Debe invalidar:** ejercicios que requieran `bench` o `barbell`
- **Resultado esperado:** sesión válida sin asumir banco

#### Caso 2: Casa con bandas y peso corporal
- **Setup:** `location = home`, `homeEquipment = { bands }`
- **Debe permitir:** ejercicios con bandas y `bodyweight`
- **Debe invalidar:** ejercicios que requieran `barbell`, `bench` o acceso a máquinas
- **Resultado esperado:** sesión entrenable sin cargas externas clásicas

#### Caso 3: Casa con barra sin capacidad de carga confirmada
- **Setup:** `location = home`, `homeEquipment = { barbell }` sin atributos de carga suficientes
- **Debe permitir:** solo lo compatible con la semántica mínima aceptada en V1
- **Debe invalidar o degradar:** ejercicios que asuman carga útil no confirmada
- **Resultado esperado:** el sistema no sobreasume capacidad real por tener solo `barbell`

#### Caso 4: Casa con una sola mancuerna
- **Setup:** `location = home`, `homeEquipment = { dumbbells: { isPair: false } }`
- **Debe permitir:** ejercicios unilaterales o adaptables
- **Debe degradar o invalidar:** ejercicios que asuman pareja simétrica
- **Resultado esperado:** la app evita prescripciones bilateralmente imposibles

#### Caso 5: Casa con banco pero sin barra
- **Setup:** `location = home`, `homeEquipment = { bench, dumbbells }`
- **Debe permitir:** press con mancuernas, remos apoyados, ejercicios compatibles con banco
- **Debe invalidar:** ejercicios que requieran `barbell`
- **Resultado esperado:** el banco amplía opciones, pero no inventa acceso a barra

#### Caso 6: Cambio de gimnasio a casa
- **Setup:** sesión generada para `gym`, luego `location` cambia a `home`
- **Debe permitir:** revalidar qué ejercicios siguen siendo válidos
- **Debe degradar o regenerar:** ejercicios dependientes de capacidades ausentes en casa
- **Resultado esperado:** la rutina no persiste intacta si su contexto material ya no aplica

#### Caso 7: Gimnasio con acceso agregado a máquinas
- **Setup:** `location = gym`, contexto con `machine_access`
- **Debe permitir:** ejercicios de máquina soportados por la cobertura V1
- **Debe invalidar en casa:** esos mismos ejercicios si luego no existe capacidad equivalente
- **Resultado esperado:** se acepta una abstracción pragmática de gimnasio sin modelar cada máquina

#### Caso 8: Respuesta inválida del generador
- **Setup:** el generador devuelve un ejercicio incompatible con `location` o equipamiento
- **Debe permitir:** disparar validación defensiva post-generación
- **Debe degradar o regenerar:** la recomendación antes de exponerla al usuario
- **Resultado esperado:** la IA no puede saltarse el contrato de dominio

#### Caso 9: Preferencias de ubicación no bloquean contextos puntuales
- **Setup:** `preferredLocations = ['home', 'gym']`, `defaultLocation = 'gym'`, usuario selecciona `park`
- **Debe permitir:** elegir `park` como `location` activa aunque no sea preferida
- **No debe hacer:** impedir la selección ni invalidarla por no estar en preferencias
- **Resultado esperado:** `preferredLocations` ordena y simplifica la UI, pero no recorta las ubicaciones disponibles

#### Caso 10: Parque con capacidades persistidas
- **Setup:** `location = park`, perfil de contexto con `pullup_bar` y `parallel_bars`
- **Debe permitir:** progresiones y ejercicios compatibles con barras de calistenia
- **Debe invalidar:** ejercicios que requieran capacidades no presentes en ese parque concreto
- **Resultado esperado:** `park` no se trata como una ubicación genérica vacía, sino como un contexto real con capacidades guardadas

#### Caso 11: Gimnasio con restricciones aprendidas
- **Setup:** `location = gym`, plantilla base de gimnasio + capacidades retiradas por el usuario tras sugerencias inválidas
- **Debe permitir:** reutilizar esas restricciones en sesiones futuras
- **Debe invalidar:** ejercicios ligados a capacidades marcadas como no disponibles para ese contexto
- **Resultado esperado:** el sistema aprende restricciones persistentes sin preguntar lo mismo en cada sesión

#### Caso 12: Parque con la misma mecánica de captura
- **Setup:** `location = park`, plantilla base de parque/calistenia con capacidades plausibles del contexto
- **Debe permitir:** desmarcar lo que no existe realmente en ese parque habitual
- **No debe hacer:** reutilizar la plantilla de gimnasio ni cambiar el formato persistido
- **Resultado esperado:** `park` y `gym` comparten la misma UX de captura y el mismo modelo final, pero con plantillas base distintas

### Criterios de aprobación de la matriz
- Cada caso define explícitamente `setup`, capacidades disponibles y resultado esperado.
- Ningún caso depende de texto libre para interpretar equipamiento.
- Los casos cubren validación previa, validación posterior y cambios de contexto.
- La matriz diferencia correctamente entre preferencias de interfaz y constraints reales del generador.
- La matriz admite contextos variables (`park`, futuro `gym` con overrides) sin cambiar de paradigma de datos.
- La matriz sirve tanto para tests de dominio como para tests de integración del generador.

## 🔀 Paralelización segura sugerida
- **Pista A:** taxonomía V1 + atributos opcionales
- **Pista B:** contrato `userProfile`
- **Pista C:** matriz de validación y casos de prueba
- **Pista D:** diseño de captura en producto (`profile` / onboarding)

### Restricciones de paralelización
- La Pista B no debe cerrarse antes de estabilizar la taxonomía de la Pista A.
- La Pista D puede avanzar en UX, pero no implementar persistencia definitiva hasta cerrar B.
- La definición del generador debe consumir A y B, no inventarlos.
- Firestore debe reflejar el contrato final, no conducirlo.

## ✅ Criterios de Aceptación
- [x] Existe una estructura de datos definida para `homeEquipment` dentro del perfil de usuario
- [x] `location` queda documentado como hard constraint del sistema de generación
- [x] Cada ejercicio o familia de ejercicios puede mapearse a requisitos mínimos de equipamiento
- [x] La futura IA no depende de texto libre del usuario para inferir material disponible
- [x] Queda previsto dónde se captura y edita el material doméstico dentro del producto
- [x] La taxonomía V1 está congelada antes de modelar persistencia e integración con Genkit
- [x] Existe un borrador claro del documento Firestore `userProfiles/{authUid}` antes de definir reglas e índices

## 📝 Notas Técnicas / Aprendizajes
- Si el equipamiento se modela demasiado abierto, la generación será inconsistente y difícil de validar.
- Si se modela demasiado rígido, costará ampliar el catálogo. Conviene una taxonomía controlada con opción futura de alias.
- La invalidación por equipamiento debe ocurrir antes y después de la generación:
  1. antes, como restricción de entrada
  2. después, como validación defensiva sobre la rutina propuesta
- En V1 conviene simplificar `homeEquipment` a presencia/ausencia real; introducir disponibilidad "opcional" añadiría ambigüedad antes de tener una UX que la sostenga.
- `machine_access` puede ser una concesión pragmática de V1 para representar acceso agregado a máquinas sin modelarlas una a una, pero mejor fuera de `homeEquipment`.
- `preferredLocations` aporta valor inmediato en producto si ordena y personaliza Home, pero no conviene dejar que bloquee opciones de contexto todavía.
- No conviene persistir whitelist para `park` y blacklist para `gym` como dos modelos distintos. Mejor un solo modelo de capacidades efectivas por contexto y UX diferente para rellenarlo según la ubicación.
- La decisión más consistente para V1 es usar la misma interacción en `gym` y `park`: partir de una plantilla amplia del contexto y desmarcar capacidades ausentes.
- El error más caro aquí sería dejar que Firestore o la UI definan el dominio por accidente.
- Conviene no cerrar el modelo pensando solo en "rutina diaria": una fase futura de retos y objetivos de habilidad (`pull-up`, `muscle-up`, etc.) probablemente necesitará reutilizar `experienceLevel`, contexto de equipamiento y futuros metadatos de progreso.

---
**Historial:**
- `2026-03-21`: Creado el plan para incorporar `homeEquipment` y `location` como restricciones duras del sistema de generación.
- `2026-03-22`: Reestructurado como plan maestro orientado a dominio; añadida propuesta de taxonomía V1, orden de decisiones y pistas seguras de paralelización.
- `2026-03-22`: Añadido borrador del contrato `userProfile` con campos mínimos, semántica de `homeEquipment` y decisiones abiertas de modelado.
- `2026-03-22`: Añadida nota de compatibilidad futura con retos orientados a habilidad para evitar que el dominio se cierre en torno a sesiones genéricas.
- `2026-03-22`: Cerrada la dirección de V1 para `homeEquipment` como presencia/ausencia real; añadida matriz de validación y se separa `machine_access` del inventario doméstico.
- `2026-03-22`: Cerrado que `preferredLocations` y `defaultLocation` son datos de UX/producto; `location` sigue siendo el único input de ubicación para generar y validar la sesión.
- `2026-03-22`: Añadida dirección para contextos variables (`park`, posible `gym` con overrides): un único modelo de capacidades efectivas por contexto con plantillas de UI distintas según la ubicación.
- `2026-03-22`: Cerrado que `gym` y `park` compartirán la misma mecánica de captura basada en plantillas del contexto; cambia la plantilla base, no el modelo persistido.
- `2026-03-22`: Añadido borrador de persistencia Firestore V1 con documento canónico `userProfiles/{authUid}` y límites explícitos de lo que no entra todavía en el perfil.
- `2026-03-22`: Cerrado que `contextProfiles` permanece embebido en `userProfiles` durante V1 para priorizar simplicidad de lectura y escritura.
- `2026-03-23`: Congelada la taxonomía V1 con ids canónicos en `snake_case`; `homeEquipment` y `enabledCapabilities` quedan separados como conceptos distintos y `enabledCapabilities` deja de admitirse como texto libre.
- `2026-03-23`: Primera edición de producto aplicada en `profile`: el usuario ya puede ajustar `experienceLevel`, ubicaciones preferidas, ubicación por defecto y `homeEquipment` sin salir del catálogo V1; `contextProfiles` se mantiene fuera de este slice para no mezclar dos UX distintas.
- `2026-03-23`: `profile` amplía la captura editable de `contextProfiles`: `park` y `gym` parten de plantillas amplias (`park_v1`, `gym_v1`) y guardan capacidades efectivas recortadas con persistencia real y cobertura básica en tests.
- `2026-03-25`: Cerrado el mapeo inicial entre equipamiento y dominio de ejercicios: `exercise_id` V1 ya declara `requiredCapabilities` y el dominio expone validación determinista reutilizable por el generador y por producto.
