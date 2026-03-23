# P2-03 Configuración Base de Firestore

> **Fase:** 2 | **Complejidad:** M | **Estado:** 🔄

## 🎯 Objetivo
Preparar la base de Firestore para soportar el perfil operativo del usuario y las futuras capas de generación, sin introducir todavía persistencia de rutinas ni de sesiones activas. El foco de esta tarea es dejar clara la estructura inicial, las reglas de acceso, los índices necesarios y la estrategia de validación local.

Esta tarea depende directamente del trabajo de dominio ya definido en:
- [`docs/plans/P2-02_data-schema-equipment-profile.md`](./P2-02_data-schema-equipment-profile.md)

## 🎨 Referencias de Diseño
- Contrato de dominio: `docs/plans/P2-02_data-schema-equipment-profile.md`
- Configuración Firebase actual: `src/shared/lib/firebase.ts`
- Routing y bootstrap actual: `app/_layout.tsx`

## 📋 Requisitos Previos
- [x] Firebase Auth Email/Password funcionando
- [x] Refactor FSD completado
- [x] Borrador de `userProfiles/{authUid}` definido en `P2-02`
- [x] Congelar taxonomía V1 de equipamiento
- [x] Congelar contrato `userProfile` para V1

## 🛠️ Plan de Implementación

### Paso 1: Confirmar el documento raíz de perfil
- [x] **Acción:** Validar que `userProfiles/{authUid}` será el documento canónico inicial de Firestore
- [x] **Archivos afectados:** `docs/plans/P2-02_data-schema-equipment-profile.md`, `src/shared/types/user-profile.ts`, `src/features/profile/services/profile-service.ts`, `src/features/profile/utils/profile-defaults.ts`
- [x] **Detalles:** La integración actual ya persiste y bootstrappea el perfil sobre `userProfiles/{authUid}`. Esta decisión queda implementada para la base V1, aunque `P2-02` siga pendiente de congelar formalmente la taxonomía y el contrato final.
- [x] **Decisión aplicada en V1:** `userProfiles/{authUid}` contendrá:
  - `authUid`
  - `experienceLevel`
  - `preferredLocations`
  - `defaultLocation`
  - `homeEquipment`
  - `contextProfiles`
  - `createdAt`
  - `updatedAt`
- [x] **Fuera de este documento en V1:**
  - rutinas generadas
  - historial de entrenamientos
  - sesión activa
  - objetivos/retos

### Paso 2: Definir estrategia de lectura y escritura
- [x] **Acción:** Establecer qué operaciones necesitará la app sobre `userProfiles`
- [x] **Archivos afectados:** `src/features/profile/services/profile-service.ts`, `src/features/profile/hooks/use-user-profile.ts`, `src/features/profile/screens/profile-screen.tsx`
- [x] **Detalles:** La capa actual ya contempla:
  - lectura del perfil al iniciar sesión
  - creación del perfil tras registro
  - actualización de `preferredLocations` / `defaultLocation`
  - actualización de `homeEquipment`
  - actualización de `contextProfiles`
- [x] **Operaciones V1 implementadas/propuestas:**
  - `getUserProfile(authUid)`
  - `createUserProfile(input)`
  - `updateUserProfilePreferences(authUid, payload)`
  - `updateHomeEquipment(authUid, payload)`
  - `updateContextProfile(authUid, location, payload)`
- [x] **Criterio de escritura:** preferir escrituras parciales y semánticas por bloque en vez de sobrescribir el documento completo desde la UI.

### Paso 3: Diseñar reglas de seguridad V1
- [x] **Acción:** Preparar reglas Firestore para que cada usuario solo pueda leer y escribir su propio `userProfile`
- [x] **Archivos afectados:** `firestore.rules`
- [x] **Detalles:** En V1 se dejan reglas simples y estrictas:
  - usuario autenticado obligatorio
  - acceso solo a `userProfiles/{request.auth.uid}`
  - negar lecturas/escrituras cruzadas
  - dejar futuras colecciones fuera hasta modelarlas
- [x] **Criterio de reglas aplicado:**
  - `read`: permitido solo si `request.auth != null` y `request.auth.uid == userId`
  - `create`: permitido solo si `request.auth != null`, `request.auth.uid == userId` y `request.resource.data.authUid == request.auth.uid`
  - `update`: permitido solo si `request.auth != null`, `request.auth.uid == userId` y `resource.data.authUid == request.auth.uid`
  - `delete`: denegado en V1 salvo caso explícito futuro
- [ ] **Nota pendiente:** Falta validar materialmente estas reglas en emulador o proyecto autenticado, incluyendo acceso cruzado denegado y escrituras del propio perfil.

#### Borrador inicial de reglas (referencia de plan)

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /userProfiles/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null
        && request.auth.uid == userId
        && request.resource.data.authUid == request.auth.uid;
      allow update: if request.auth != null
        && request.auth.uid == userId
        && resource.data.authUid == request.auth.uid;
      allow delete: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Paso 4: Evaluar índices necesarios
- [x] **Acción:** Determinar si la primera versión necesita índices compuestos o si basta con el acceso directo por documento
- [x] **Archivos afectados:** `firestore.indexes.json`
- [x] **Detalles:** La primera versión no necesita índices compuestos para `userProfiles`, porque el acceso principal es por id de documento.
- [x] **Decisión aplicada:** No crear índices compuestos en V1 para `userProfiles`.
- [x] **Motivo:** el patrón principal es `doc(userProfiles/{authUid})`; no hay consultas multi-campo que justifiquen índices todavía.
- [ ] **Condición de reapertura:** si más adelante se introducen listados administrativos, búsquedas por campos internos o analítica operativa, se revisa esta decisión.

### Paso 5: Preparar configuración local de Firestore
- [x] **Acción:** Definir qué archivos base del proyecto deben existir para soportar Firestore
- [x] **Archivos afectados:** `firebase.json`, `firestore.rules`, `firestore.indexes.json`, `.firebaserc`, `package.json`
- [x] **Detalles:** La base del proyecto ya queda preparada para iterar con reglas y validación local sin depender todavía de UI terminada.
- [x] **Archivos previstos en V1:**
  - `firebase.json`
  - `firestore.rules`
  - `firestore.indexes.json`
  - `.firebaserc` si se trabaja con varios proyectos o emuladores locales
- [x] **Resultado esperado:** la base del proyecto puede arrancar Firestore con configuración explícita y versionada en repo.

### Paso 6: Planificar la integración en la app
- [x] **Acción:** Definir por dónde entrará Firestore en la arquitectura actual
- [x] **Archivos afectados:** `src/shared/lib/firebase.ts`, `src/features/profile/services/*`, `src/features/profile/hooks/use-user-profile.ts`, `src/features/profile/screens/profile-screen.tsx`
- [x] **Detalles:** La integración actual deja Firestore detrás de service layer y hooks, respetando FSD y React Query.
- [x] **Ruta de integración aplicada:**
  - `src/shared/lib/firebase.ts`
    - añade inicialización de Firestore junto a `app` y `auth`
  - `src/features/profile/services/profile-service.ts`
    - concentra lecturas/escrituras del documento `userProfiles/{authUid}`
  - `src/features/profile/hooks/use-user-profile.ts`
    - encapsula carga y mutaciones con React Query
  - `src/features/profile/screens/profile-screen.tsx`
    - consume solo hooks, nunca SDK directo
- [x] **Motivo arquitectónico:** `profile` es el primer owner natural del dato, aunque el generador y Home acaben reutilizándolo después.

### Paso 7: Definir validación y verificación
- [ ] **Acción:** Dejar claro cómo se validará la configuración base sin esperar a la funcionalidad completa
- [x] **Archivos afectados:** este plan, `package.json`, `__tests__/profile.test.tsx`
- [ ] **Detalles pendientes:** La verificación mínima ya está descrita y parcialmente ejecutada (`npx tsc --noEmit`, `npm run lint`, `npx jest --runInBand`), pero sigue pendiente validar reglas en emulador o proyecto autenticado y comprobar acceso cruzado denegado.
- [x] **La verificación mínima debería contemplar:**
  - reglas coherentes con Auth
  - lectura/escritura del propio perfil
  - denegación de acceso a perfiles ajenos
  - consistencia con el contrato de `P2-02`
- [ ] **Secuencia mínima de verificación pendiente:**
  - verificar materialmente reglas sobre `userProfiles/{authUid}` con emulador o entorno controlado
  - comprobar denegación de lectura/escritura cruzada
  - comprobar que el documento persistido respeta el contrato acordado en `P2-02` una vez ese contrato quede congelado
- [x] **Secuencia ya verificada en local:**
  - verificar que la app compila tras introducir Firestore en `src/shared/lib/firebase.ts`
  - comprobar creación y lectura del propio documento desde `profile`
  

## 🔀 Paralelización segura sugerida
- **Pista A:** archivos de infraestructura Firebase/Firestore (`firebase.json`, `firestore.rules`, `firestore.indexes.json`)
- **Pista B:** service layer y hooks de `profile`
- **Pista C:** validación de reglas y pruebas mínimas

### Restricciones de paralelización
- La Pista B no debe empezar a consumir Firestore real hasta que la forma de `userProfiles/{authUid}` esté cerrada.
- La Pista C necesita el borrador de reglas de la Pista A para arrancar.
- `src/shared/lib/firebase.ts` debe tener un único owner mientras se añade Firestore para evitar conflictos con Auth.

## ✅ Criterios de Aceptación
- [x] Existe una decisión explícita de usar `userProfiles/{authUid}` como documento raíz V1
- [x] Las reglas de seguridad V1 están definidas a nivel de plan
- [x] Se sabe si hacen falta índices o si no son necesarios todavía
- [x] Quedan identificados los archivos base de Firestore que habrá que crear
- [x] La integración futura respeta service layer + hooks y no filtra Firestore directamente a pantallas
- [x] La validación mínima de seguridad y consistencia está descrita
- [ ] Las reglas V1 se han validado materialmente con emulador o proyecto autenticado

## 📝 Notas Técnicas / Aprendizajes
- No conviene introducir colecciones adicionales hasta que `userProfiles` deje de cubrir bien el caso de uso.
- La seguridad de Firestore debe nacer alineada con Auth; no se debe posponer "para luego".
- Si el acceso principal es por documento, conviene resistirse a crear índices por inercia.
- Esta tarea debe preparar la base, no mezclar todavía sesiones, rutinas, historial ni retos.
- En V1 compensa más una regla simple y estricta que una validación exhaustiva y frágil del shape completo del documento.
- La primera integración debería entrar por `profile`, porque es donde el usuario podrá inspeccionar y editar más claramente parte de este dato.

---
**Historial:**
- `2026-03-22`: Creado el plan a partir del contrato de dominio y persistencia definido en `P2-02`.
- `2026-03-22`: Ampliado con borrador de reglas V1, decisión de no usar índices compuestos todavía, archivos base previstos y ruta de integración en FSD.
- `2026-03-22`: Base inicial implementada con `firebase.json`, `firestore.rules`, `firestore.indexes.json`, export de Firestore en `src/shared/lib/firebase.ts` y primer service/hook de perfil. Verificado con `npx tsc --noEmit` y `npm run lint`.
- `2026-03-23`: `profile` ya bootstrappea `userProfiles/{authUid}` con defaults de V1, muestra el estado persistido en UI y queda verificado con `npx tsc --noEmit`, `npm run lint` y `npx jest --runInBand`.
- `2026-03-23`: CLI de Firebase preparado en repo con `.firebaserc`, `firebase-tools` en `devDependencies` y scripts de login/deploy/emulador; el siguiente bloqueo operativo es autenticar la máquina con `firebase login`.
- `2026-03-23`: Sincronización documental del estado real: la infraestructura base y la primera integración en `profile` quedan reflejadas como implementadas; el plan permanece en curso solo por dos bloqueos reales, congelar `P2-02` y validar reglas con emulador o proyecto autenticado.
- `2026-03-23`: `P2-02` queda congelado para V1 con catálogo canónico en `snake_case`; `P2-03` deja de depender de un borrador de dominio y pasa a quedar bloqueado solo por la validación material de reglas.
