# P2-04 Contrato del Generador + Compatibilidad de Ejercicios

> **Fase:** 2 | **Complejidad:** XL | **Estado:** 🔄

## 🎯 Objetivo
Definir el contrato tipado entre dominio, generador y UI para que FitFlow AI pueda pedir sesiones al modelo sin depender de texto libre para renderizar la pantalla de ejercicios, validar incompatibilidades de equipamiento y degradar respuestas inválidas de forma determinista.

Este plan une dos necesidades que ya estaban separadas en `P2-02` pero que en producto son inseparables:
- mapear `requiredCapabilities` por ejercicio concreto
- fijar el shape exacto de entrada/salida del generador antes de conectar Genkit

## 🎨 Referencias de Diseño
- Pantalla afectada: `src/features/workout/screens/workout-execution-screen.tsx`
- Dominio base: `docs/plans/P2-02_data-schema-equipment-profile.md`
- Persistencia y reglas ya cerradas: `docs/plans/P2-03_firestore-foundation.md`
- Tokens existentes: `src/shared/constants/theme.ts`

## 📋 Requisitos Previos
- [x] `userProfile` V1 congelado en `P2-02`
- [x] Firestore foundation validada en `P2-03`
- [x] Taxonomía V1 de `enabledCapabilities` congelada
- [ ] Cerrar contrato V1 de ejercicios concretos y sus `requiredCapabilities`
- [ ] Cerrar contrato V1 de entrada/salida del generador

## 🧭 Decisiones cerradas hasta ahora
- [x] El catálogo V1 se modelará por `exercise_id` concreto, no por texto libre ni solo por familias abstractas.
- [x] La estructura de sesión deberá soportar `straight_sets`, `superset`, `triset`, `circuit` y `emom`.
- [x] La salida del modelo será híbrida:
  - campos estructurados y canónicos para que la app renderice
  - texto libre solo en campos auxiliares bien tipados como `selection_reason` y `coach_notes`
- [x] `intensity_method` entra en V1 para no obligar al sistema a prometer siempre `target_weight_kg`.
- [x] V1 podrá incluir notas de ejecución si quedan tipadas dentro del contrato.
- [x] Si el modelo devuelve un ejercicio inválido, la estrategia preferida será sustituir ese ejercicio y no regenerar toda la sesión.
- [x] La UI debe poder renderizar la sesión únicamente con datos estructurados, sin depender de texto libre salvo notas auxiliares.
- [x] La sesión generada en V1 será efímera; no se fuerza todavía un modelo `template + instance`.
- [x] `selection_reason` seguirá una forma híbrida: `reason_codes` canónicos + `reason_text` opcional.
- [x] `coach_notes` vivirá a nivel de ejercicio y se permitirá `session_notes` opcional a nivel de sesión.
- [x] `intensity_method` V1 se cerrará con enum canónico: `rir | rpe | load_kg | percentage_1rm | bodyweight | duration_seconds`.
- [x] `circuit` y `emom` se modelarán desde V1 con estructura específica por bloque, permitiendo `rounds` o `duration_seconds` según aplique.
- [x] `warmup` y `cooldown` quedan fuera de V1 para no contaminar el primer contrato operativo.
- [x] `reason_codes` V1 se congela con el primer set propuesto, sin abrir todavía nuevos códigos.
- [x] `tempo` entra en V1 como `string` con validación superficial, no como shape rígido.
- [x] La estrategia de descanso se reparte así:
  - `straight_sets`: descanso a nivel de ejercicio
  - `superset` / `triset` / `circuit`: descanso principal a nivel de bloque
  - `emom`: la cadencia la define el propio bloque, no `rest_seconds`
- [x] `session_goal` incorpora `fat_loss` en V1 como objetivo explícito de generación.
- [x] `circuit` exigirá al menos uno entre `rounds` o `duration_seconds`.
- [x] `unilateral_mode` sale de V1; si hace falta más adelante podrá añadirse sin romper el contrato base.

## 🛠️ Plan de Implementación

### Paso 1: Congelar la estructura de sesión V1
- [x] **Acción:** Definir la forma canónica de una sesión generada y de sus bloques
- [x] **Archivos afectados:** este plan, `src/shared/types/generator-contract.ts`
- [x] **Detalles:** La primera bajada ya existe en `generator-contract.ts` y separa claramente:
  - sesión
  - bloques (`straight_sets`, `superset`, `triset`, `circuit`, `emom`)
  - ejercicios dentro de cada bloque
  - prescripción por ejercicio

### Paso 2: Congelar el catálogo de ejercicios V1
- [ ] **Acción:** Definir `exercise_id` concretos y sus metadatos base
- [ ] **Archivos afectados:** futuro catálogo tipado de ejercicios, validadores y assets
- [ ] **Detalles:** Cada ejercicio concreto debe tener al menos:
  - `exercise_id`
  - nombre canónico interno
  - familia o patrón de movimiento
  - `requiredCapabilities`
  - metadata suficiente para que la app resuelva copy, media y validación

### Paso 3: Fijar `requiredCapabilities` y reglas de compatibilidad
- [ ] **Acción:** Asociar capacidades mínimas por ejercicio y documentar degradaciones válidas
- [ ] **Archivos afectados:** catálogo de ejercicios, validadores de dominio, `P2-02`
- [ ] **Detalles:** Este paso convierte el dominio en algo validable antes y después de la llamada al modelo.

### Paso 4: Fijar el contrato de entrada al generador
- [ ] **Acción:** Definir el payload exacto que Genkit recibirá
- [ ] **Archivos afectados:** futuro plan de Genkit, constructores de prompt/input, tipos compartidos
- [ ] **Detalles:** Debe incluir como mínimo:
  - `location`
  - `experienceLevel`
  - `homeEquipment` o `contextProfiles.<location>.enabledCapabilities`
  - objetivo de sesión
  - duración o constraints temporales
  - formato de bloque soportado

### Paso 5: Fijar el contrato de salida del generador
- [ ] **Acción:** Definir un JSON validable que la app pueda renderizar sin heurísticas
- [ ] **Archivos afectados:** futuro plan de Genkit, validadores, tipos compartidos, pantalla de workout
- [ ] **Detalles:** La salida V1 deberá usar ids canónicos y solo permitir texto libre en campos auxiliares controlados.

### Paso 6: Diseñar validación y degradación defensiva
- [ ] **Acción:** Definir qué hace el sistema cuando la respuesta es inválida o incompleta
- [ ] **Archivos afectados:** validadores, capa de adaptación del generador, futuros tests
- [ ] **Detalles:** Estrategia preferida en V1:
  - sustituir ejercicios incompatibles
  - rechazar campos estructurales inválidos
  - no pintar la sesión si falla el contrato básico

### Paso 7: Mapear el contrato a la pantalla de ejercicios
- [ ] **Acción:** Definir qué campos estructurados necesita la UI de ejecución
- [ ] **Archivos afectados:** `src/features/workout/*`, tipos compartidos, adaptadores
- [ ] **Detalles:** La UI no debe depender de texto libre para:
  - nombre del ejercicio
  - imagen/video
  - sets
  - reps
  - descanso
  - orden dentro de bloque

### Paso 8: Definir la matriz de tests V1
- [ ] **Acción:** Preparar casos de prueba para contrato, validación y renderizado
- [ ] **Archivos afectados:** futuros tests de dominio, validadores y UI
- [ ] **Detalles:** Debe cubrir al menos:
  - incompatibilidad por equipamiento
  - sustitución puntual
  - bloques múltiples
  - EMOM/circuitos
  - texto libre opcional sin romper UI

## 🧱 Borrador de contrato V1

### Principios
- `exercise_id` es obligatorio y canónico.
- `selection_reason` y `coach_notes` pueden ser texto libre, pero viven en campos explícitos.
- La UI resuelve traducciones, labels y assets a partir de ids canónicos.
- La salida del modelo no debe ser necesaria para i18n salvo en campos auxiliares.

### Tipos base

```ts
type EffectiveCapabilityId = ContextCapabilityId | 'bodyweight';

type WorkoutBlockType =
  | 'straight_sets'
  | 'superset'
  | 'triset'
  | 'circuit'
  | 'emom';

type IntensityMethod =
  | 'rir'
  | 'rpe'
  | 'load_kg'
  | 'percentage_1rm'
  | 'bodyweight'
  | 'duration_seconds';

type SelectionReasonCode =
  | 'matches_goal'
  | 'fits_location'
  | 'fits_equipment'
  | 'matches_experience'
  | 'balances_session'
  | 'progression_choice'
  | 'fatigue_management'
  | 'time_efficient';
```

### Borrador TypeScript de entrada

```ts
type GenerateWorkoutSessionInput = {
  request_id: string;
  location: TrainingLocation;
  experience_level: ExperienceLevel;
  available_capabilities: EffectiveCapabilityId[];
  preferred_block_types: WorkoutBlockType[];
  duration_minutes: number;
  session_goal:
    | 'strength'
    | 'hypertrophy'
    | 'conditioning'
    | 'skill'
    | 'general_fitness'
    | 'fat_loss';
  equipment_profile: {
    home_equipment: HomeEquipment;
    context_capabilities?: EffectiveCapabilityId[];
  };
};
```

### Borrador TypeScript de salida

```ts
type GeneratedWorkoutSession = {
  session_id: string;
  session_type: 'generated_ephemeral';
  location: TrainingLocation;
  session_goal:
    | 'strength'
    | 'hypertrophy'
    | 'conditioning'
    | 'skill'
    | 'general_fitness'
    | 'fat_loss';
  estimated_duration_minutes: number;
  summary?: string;
  session_notes?: string;
  blocks: WorkoutBlock[];
};

type WorkoutBlock =
  | StraightSetsBlock
  | SupersetBlock
  | TrisetBlock
  | CircuitBlock
  | EmomBlock;

type WorkoutBlockBase = {
  block_id: string;
  block_type: WorkoutBlockType;
  order_index: number;
  title?: string;
};

type StraightSetsBlock = WorkoutBlockBase & {
  block_type: 'straight_sets';
  exercise: GeneratedExerciseEntry;
  rest_seconds_after_exercise?: number;
};

type SupersetBlock = WorkoutBlockBase & {
  block_type: 'superset';
  exercises: [GeneratedExerciseEntry, GeneratedExerciseEntry];
  rest_seconds_after_block: number;
};

type TrisetBlock = WorkoutBlockBase & {
  block_type: 'triset';
  exercises: [GeneratedExerciseEntry, GeneratedExerciseEntry, GeneratedExerciseEntry];
  rest_seconds_after_block: number;
};

type CircuitBlock = WorkoutBlockBase & {
  block_type: 'circuit';
  exercises: GeneratedExerciseEntry[];
  rounds?: number;
  duration_seconds?: number;
  rest_seconds_after_round?: number;
};

type EmomBlock = WorkoutBlockBase & {
  block_type: 'emom';
  exercises: GeneratedExerciseEntry[];
  duration_seconds: number;
  interval_seconds: 60;
};

type GeneratedExerciseEntry = {
  entry_id: string;
  exercise_id: string;
  prescription: ExercisePrescription;
  selection_reason?: {
    reason_codes: SelectionReasonCode[];
    reason_text?: string;
  };
  coach_notes?: string;
};

type ExercisePrescription = {
  set_count?: number;
  target_reps?: number | number[];
  intensity_method: IntensityMethod;
  intensity_value?: number;
  tempo?: string;
};
```

### Open Questions
- [ ] ¿`fat_loss` debe comportarse como objetivo autónomo o como sesgo sobre `conditioning` / `general_fitness`?
- [ ] ¿Cómo validamos a nivel de contrato que `circuit` tenga al menos `rounds` o `duration_seconds` si TypeScript solo no basta?

## 🧩 Decisiones operativas para la siguiente iteración
- `selection_reason`
  - base canónica por `reason_codes`
  - explicación libre opcional por `reason_text`
- `coach_notes`
  - opcional por ejercicio
  - `session_notes` opcional a nivel de sesión
- `reason_codes` V1
  - `matches_goal`
  - `fits_location`
  - `fits_equipment`
  - `matches_experience`
  - `balances_session`
  - `progression_choice`
  - `fatigue_management`
  - `time_efficient`
- `intensity_method`
  - `rir`
  - `rpe`
  - `load_kg`
  - `percentage_1rm`
  - `bodyweight`
  - `duration_seconds`
- `session_goal`
  - `strength`
  - `hypertrophy`
  - `conditioning`
  - `skill`
  - `general_fitness`
  - `fat_loss`
- `tempo`
  - `string`
  - validación superficial
- `warmup` / `cooldown`
  - fuera de V1
- `unilateral_mode`
  - fuera de V1
- bloques compuestos
  - `superset`, `triset`, `circuit` y `emom` se tipan explícitamente
  - la UI no debe deducir el tipo de bloque por heurística
  - el descanso principal vive a nivel de bloque salvo en `straight_sets`
  - `circuit` debe traer al menos `rounds` o `duration_seconds`

## ✅ Criterios de Aceptación
- [ ] Existe un catálogo V1 de `exercise_id` concretos con `requiredCapabilities`
- [x] Existe una estructura tipada de bloques que soporta `straight_sets`, `superset`, `triset`, `circuit` y `emom`
- [x] La entrada al generador queda definida como tipos concretos TypeScript sin depender de texto libre
- [ ] La salida del generador queda definida como JSON validable y alineable con tipos TypeScript
- [ ] La UI puede renderizar la sesión desde datos estructurados
- [ ] La sustitución de un ejercicio inválido queda definida como estrategia V1
- [x] Se documenta qué campos son canónicos y cuáles admiten texto libre
- [ ] La matriz de tests cubre incompatibilidades, bloques compuestos y degradaciones

## 📝 Notas Técnicas / Aprendizajes
- Si mezclamos ids canónicos con nombres generados como fuente primaria, la UI pierde estabilidad.
- El soporte de superseries/circuitos/EMOM no obliga a abandonar `exercise_id`; obliga a modelar mejor la jerarquía `sesión -> bloque -> ejercicio`.
- `intensity_method` parece una mejor inversión V1 que `target_weight_kg` como obligación universal.
- El texto libre del modelo debe ser un extra útil, no el soporte principal del render.
- `reason_codes` canónicos permiten auditoría y UI consistente; `reason_text` queda como explicación enriquecida, no como fuente principal de lógica.
- Tipar explícitamente los bloques compuestos obliga a decidir la semántica de descanso y progresión antes de conectar la UI.
- `fat_loss` puede tener sentido como objetivo de sesión en V1 aunque a futuro probablemente conviva con objetivos de producto de más alto nivel.
- Si el contrato de salida no está cerrado antes de Genkit, acabaremos validando prompts con la UI, que es justo lo que queremos evitar.

---
**Historial:**
- `2026-03-24`: Creado el plan JIT a partir de `P2-02` para cerrar compatibilidad de ejercicios y contrato del generador antes de conectar Genkit.
- `2026-03-24`: Cerradas decisiones V1 sobre `selection_reason`, `coach_notes`, `intensity_method`, bloques compuestos y exclusión temporal de `warmup/cooldown`.
- `2026-03-25`: El plan baja a borradores concretos de tipos TypeScript para entrada/salida del generador, incorpora `reason_codes` V1, `tempo` como string validado superficialmente y fija la estrategia de descanso por tipo de bloque.
- `2026-03-25`: `session_goal` añade `fat_loss`, `circuit` pasa a exigir al menos `rounds` o `duration_seconds` y `unilateral_mode` sale de V1 por no ser contractual para render ni validación básica.
- `2026-03-25`: Primer slice implementado en `src/shared/types/generator-contract.ts`; la estructura base del contrato del generador compila y queda verificada con `npx tsc --noEmit` y `npm run lint`.
