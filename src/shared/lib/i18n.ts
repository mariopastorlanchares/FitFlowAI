import * as Localization from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

const i18n = createInstance();

const en = {
  translation: {
    common: {
      appName: 'FitFlow AI',
      createAccount: 'Create your account',
      emailLabel: 'Email',
      emailPlaceholder: 'Email address',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Password',
      confirmPasswordLabel: 'Confirm password',
      confirmPasswordPlaceholder: 'Confirm password',
      orConnectWith: 'Or connect with',
      orRegisterWith: 'Or sign up with',
      apple: 'Apple',
      google: 'Google',
      loading: 'Loading...',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      passwordVisibilityHint: 'Double tap to toggle password visibility.',
      socialAuthUnavailable: 'Apple and Google sign-in are not connected yet.',
      error: 'Error',
      unexpectedError: 'An unexpected error occurred.',
    },
    login: {
      title: 'FitFlow AI',
      eyebrow: 'Quick access',
      subtitle:
        'Get back to today’s workout, your latest logs and the execution flow without losing context.',
      helper:
        'Use the account linked to your training history so the app can recover your progress and recommendations.',
      cta: 'Sign In',
      noAccountText: 'New to FitFlow AI?',
      noAccountLink: 'Sign Up',
      errorEmptyFields: 'Please enter your email and password.',
    },
    register: {
      title: 'FitFlow AI',
      eyebrow: 'New account',
      subtitle:
        'Create a focused training account before we connect routines, recovery data and AI suggestions.',
      helper:
        'We will send a verification email before enabling the rest of the flow.',
      cta: 'Sign Up',
      hasAccountText: 'Already have an account?',
      hasAccountLink: 'Sign In',
      errorEmptyFields: 'Please fill in all fields.',
      errorPasswordsDontMatch: 'Passwords do not match.',
      errorPasswordWeak:
        'Password must be at least 8 characters long, contain one number and one uppercase letter.',
      emailVerificationSent:
        'We have sent you a confirmation email. Please check your inbox.',
      successTitle: 'Registration successful!',
    },
    dashboard: {
      tabs: {
        home: 'Home',
        workout: 'Workout',
        stats: 'Stats',
        profile: 'Profile',
      },
      header: {
        eyebrow: 'Today',
        subtitle: 'Choose the session and start training.',
      },
      sessionSetup: {
        title: 'Tune today’s session',
      },
      today_workout: 'Ready to generate',
      time: 'min',
      focus: 'Energy',
      start_workout: 'Generate Workout',
      card: {
        title: '{{location}} Session',
        description: 'AI-tailored execution',
        summary: 'Your session will be generated considering your profile, selected location, duration, and energy level.',
      },
      weeklyStreak: {
        label: 'Consistency',
        title: 'Weekly progress',
        progressLabel_one: '{{count}} session',
        progressLabel_other: '{{count}} sessions',
        loadingCaption: 'Loading history',
        loadingHelper: 'Checking your latest completed sessions.',
        emptyCaption: 'No history yet',
        emptyHelper: 'Complete your first workout to start building real weekly progress.',
        captionReady: '{{count}} completed total',
        helperReady: 'Latest workout: {{name}}',
        daysLabel_one: '{{count}} active day',
        daysLabel_other: '{{count}} active days',
      },
      context: {
        locationLabel: 'Where are you training today?',
        durationLabel: 'Available time',
        energyLabel: 'Energy level',
        locationOptions: {
          gym: 'Gym',
          home: 'Home',
          street: 'Street',
          park: 'Park',
        },
        durationOptions: {
          short: '30 min',
          medium: '45 min',
          long: '60 min',
          extended: '90 min',
        },
        energyOptions: {
          low: 'Tired',
          medium: 'Normal',
          high: 'High',
        },
      },
    },
    analytics: {
      loadingTitle: 'Loading your stats',
      loadingBody: 'We are collecting the latest completed sessions from Firestore.',
      placeholderTitle: 'No completed sessions yet',
      placeholderBody:
        'Finish your first workout to unlock real progress metrics and recent session history.',
      metrics: {
        totalSessions: 'Completed sessions',
        thisWeek: 'This week',
        activeDays: 'Active days',
      },
      recentTitle: 'Recent sessions',
      recentMeta: '{{location}} · {{date}}',
      recentSets: '{{completed}}/{{total}} sets',
    },
    profile: {
      title: 'My Profile',
      loggedUser: 'Logged in User',
      noEmail: 'No email associated',
      logout: 'Sign Out',
      logoutConfirmTitle: 'Sign Out',
      logoutConfirmMessage: 'Are you sure you want to sign out?',
      logoutCancel: 'Cancel',
      logoutConfirm: 'Yes, sign out',
      logoutError: 'Could not sign out.',
      logoutHint: 'Open the confirmation dialog to sign out from this device.',
      sections: {
        training: 'Training profile',
        account: 'Account',
        preferences: 'Preferences',
        support: 'Support',
      },
      training: {
        eyebrow: 'Firestore',
        loadingTitle: 'Preparing your base profile',
        loadingBody:
          'We are checking whether your training profile exists in Firestore and creating the initial document if needed.',
        readyTitle: 'Base profile ready',
        readyBody:
          'This document is the first persisted contract for training context, preferred locations and future equipment constraints.',
        errorTitle: 'Profile setup needs attention',
        errorBody:
          'We could not load or create your Firestore profile. Retry before editing equipment or training contexts.',
        status: {
          loading: 'Checking',
          ready: 'Ready',
          error: 'Retry needed',
        },
        actions: {
          retry: 'Retry setup',
        },
        fields: {
          experienceLevel: 'Experience level',
          defaultLocation: 'Default location',
          preferredLocations: 'Preferred locations',
          homeEquipment: 'Home equipment',
          contextProfiles: 'Saved contexts',
        },
        experienceLevels: {
          beginner: 'Beginner',
          intermediate: 'Intermediate',
          advanced: 'Advanced',
        },
        values: {
          empty: 'Not defined yet',
          homeEquipmentCount_one: '{{count}} item configured',
          homeEquipmentCount_other: '{{count}} items configured',
          contextProfilesCount_one: '{{count}} context saved',
          contextProfilesCount_other: '{{count}} contexts saved',
        },
      },
      operational: {
        eyebrow: 'Operational profile',
        title: 'Training setup you can actually use',
        description:
          'Adjust the training baseline before we wire context capture and AI generation to real constraints.',
        summary_one: '{{count}} item in home setup',
        summary_other: '{{count}} items in home setup',
        save: 'Save profile',
        saveError: 'We could not save your operational profile.',
        saveHint: 'Save the current training preferences and home equipment.',
        saveDisabledHint: 'There are no profile changes to save yet.',
        preferredLocationsHelper:
          'These locations shape defaults and shortcuts in product, but they do not block other contexts.',
        defaultLocationHelper:
          'Choose the location the app should preselect when preparing a new session.',
        homeEquipmentHelper:
          'Mark only the equipment you really have at home. Context-specific capabilities stay outside this block.',
        contextProfilesSummary_one:
          '{{count}} saved external context. External places are configured in the block below.',
        contextProfilesSummary_other:
          '{{count}} saved external contexts. External places are configured in the block below.',
        groups: {
          experience: 'Experience level',
          preferredLocations: 'Preferred locations',
          defaultLocation: 'Default location',
          homeEquipment: 'Home equipment',
        },
        homeEquipmentOptions: {
          dumbbells: 'Dumbbells',
          barbell: 'Barbell',
          bench: 'Bench',
          bands: 'Bands',
          pullup_bar: 'Pull-up bar',
          kettlebell: 'Kettlebell',
        },
      },
      contexts: {
        eyebrow: 'External contexts',
        title: 'Trim each place to what is really available',
        description:
          'Start from a broad template for each context and remove whatever your usual park or gym does not actually have.',
        summary_one: '{{count}} context already customized',
        summary_other: '{{count}} contexts already customized',
        save: 'Save contexts',
        saveError: 'We could not save your external contexts.',
        saveHint: 'Save the current park and gym capability configuration.',
        saveDisabledHint: 'There are no external context changes to save yet.',
        futureNote:
          'Street stays visible as a future context, but this V1 editor only closes park and gym.',
        status: {
          template: 'Base template',
          saved: 'Saved context',
        },
        helpers: {
          park:
            'Keep only the stations your usual park really offers. The default template starts broad on purpose.',
          gym:
            'Use this as the effective equipment baseline for your gym, not as a list of machines you own.',
        },
        capabilityOptions: {
          dumbbells: 'Dumbbells',
          barbell: 'Barbell',
          bench: 'Bench',
          bands: 'Bands',
          pullup_bar: 'Pull-up bar',
          kettlebell: 'Kettlebell',
          parallel_bars: 'Parallel bars',
          rings_anchor: 'Rings anchor',
          machine_access: 'Machine access',
        },
      },
      options: {
        personalInfo: 'Personal Information',
        theme: 'Theme',
        language: 'Language',
        help: 'Help Center',
        privacy: 'Privacy Policy',
      },
    },
    workout: {
      loading: {
        title: 'Preparing your session',
        body: 'We are generating the workout and loading the execution flow.',
      },
      header: {
        activeLabel: 'Workout in progress',
        exerciseProgress: 'Exercise {{current}} of {{total}}',
        totalTimer: 'Session',
        exerciseTimer: 'Exercise',
        restTimer: 'Rest',
      },
      exercise: {
        currentLabel: 'Current exercise',
        alternativeAction: 'See alternative',
        mediaPending: 'Reference media is still pending. Use the exercise name and description for now.',
      },
      ai: {
        title: 'AI support',
        recommendationLabel: 'Suggested target:',
        recommendation: '{{weight}} kg x {{reps}} reps',
        focusAdvice: '(Focus: {{focus}}). {{advice}}',
        pendingTitle: 'AI feedback is not connected yet',
        pendingBody:
          'Personalized guidance will appear here once the recommendation flow is connected.',
        pendingFeedbackBody:
          'This note is not being sent anywhere yet. We will wire this action once the AI flow is available.',
        feedbackLabel: 'Anything to adjust?',
        feedbackPlaceholder:
          'Tell the AI if something feels off, unstable or unavailable.',
        feedbackSubmit: 'Send to AI',
      },
      controls: {
        logSet: 'Save set',
        saveChanges: 'Save changes',
        nextExercise: 'Next exercise',
        finish: 'Finish workout',
        helperReady: 'Save the current set when you finish it.',
        helperEditing: 'You are editing a previous set. Saving changes will not trigger rest.',
        helperRest: 'Rest is running, but you can prepare the next set now.',
        helperFinished: 'This exercise is complete. Move on when you are ready.',
      },
      rest: {
        title: 'REST TIMER',
        goal: 'Goal {{time}}',
        skip: 'Skip rest',
      },
      activeSet: {
        title: 'Log this set',
        editTitle: 'Edit set {{current}}',
        targetLabel: 'Target',
        weightLabel: 'Weight',
        repsLabel: 'Reps',
        repsUnit: 'reps',
        progress: 'Set {{current}} of {{total}}.',
        readyHelper: 'Adjust the result before saving it.',
        editingHelper: 'You are correcting a completed set.',
        lockedHelper: 'All sets for this exercise are already completed.',
      },
      setStrip: {
        title: 'Sets',
        currentSetLabel: 'Current set',
        collapse: 'Hide',
        expand: 'Review',
        summary: '{{completed}}/{{total}} completed',
        add: 'Add set',
        removeLast: 'Remove last',
        current: 'Current',
        editing: 'Editing',
        completed: 'Done',
        pending: 'Pending',
      },
      feedback: {
        alternativeTitle: 'Alternative requested',
        alternativeMessage:
          'Alternatives are not available yet. This action will be connected when the recommendation flow is ready.',
      },
      finish: {
        saveError: 'We could not save this completed workout. Try again before leaving the screen.',
      },
      generatedSession: {
        title: '{{goal}} session',
        previewSummary:
          'Preview session shown while the live generation is unavailable.',
        goals: {
          strength: 'Strength',
          hypertrophy: 'Hypertrophy',
          conditioning: 'Conditioning',
          skill: 'Skill',
          general_fitness: 'General fitness',
          fat_loss: 'Fat loss',
        },
        sources: {
          live_generated: 'Live AI',
          fallback_preview: 'Preview',
        },
        currentBlock: 'Current block',
        blockProgress: 'Block {{current}} of {{total}}',
        exerciseFlow: 'Block flow',
        blockTypes: {
          straight_sets: 'Straight sets',
          superset: 'Superset',
          triset: 'Triset',
          circuit: 'Circuit',
          emom: 'EMOM',
        },
        cadence: {
          rounds_one: '{{count}} round',
          rounds_other: '{{count}} rounds',
          durationMinutes: '{{minutes}} min',
          intervalSeconds: 'Every {{seconds}} sec',
          restSeconds: '{{seconds}} sec rest',
        },
      },
      catalog: {
        exercises: {
          back_squat: {
            name: 'Back Squat',
            description: 'Barbell squat pattern used as a canonical lower-body strength exercise.',
          },
          leg_press: {
            name: 'Leg Press',
            description: 'Machine-based squat variation for gym contexts with machine access.',
          },
          push_up: {
            name: 'Push-Up',
            description: 'Bodyweight horizontal push variation that works without extra equipment.',
          },
          dumbbell_floor_press: {
            name: 'Dumbbell Floor Press',
            description: 'Horizontal push option for home setups with dumbbells and no bench.',
          },
          dumbbell_bench_press: {
            name: 'Dumbbell Bench Press',
            description: 'Horizontal press that requires both dumbbells and a bench.',
          },
          band_row: {
            name: 'Band Row',
            description: 'Horizontal pull variation that only depends on resistance bands.',
          },
          pull_up: {
            name: 'Pull-Up',
            description: 'Vertical pull exercise that requires a pull-up bar.',
          },
          kettlebell_swing: {
            name: 'Kettlebell Swing',
            description: 'Hip-dominant conditioning exercise that depends on a kettlebell.',
          },
          parallel_bar_dip: {
            name: 'Parallel Bar Dip',
            description: 'Dip variation that requires access to parallel bars.',
          },
          ring_row: {
            name: 'Ring Row',
            description: 'Horizontal pull option that depends on a rings anchor setup.',
          },
        },
      },
      mock: {
        workoutName: 'Session preview',
        exercises: {
          squat: {
            name: 'Back Squat',
            description: 'Sample execution block while live workout plans are not connected yet.',
          },
          legPress: {
            name: 'Leg Press',
            description: 'Second sample exercise used to validate the execution flow end to end.',
          },
        },
      },
    },
    firebaseErrors: {
      'auth/email-already-in-use': 'Email is already in use.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-not-found': 'User not found.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid credentials. Please check your data.',
      'auth/weak-password': 'Password is too weak.',
    },
  },
};

const es = {
  translation: {
    common: {
      appName: 'FitFlow AI',
      createAccount: 'Crea tu cuenta',
      emailLabel: 'Correo',
      emailPlaceholder: 'Correo electrónico',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Contraseña',
      confirmPasswordLabel: 'Confirmar contraseña',
      confirmPasswordPlaceholder: 'Confirmar contraseña',
      orConnectWith: 'O entra con',
      orRegisterWith: 'O regístrate con',
      apple: 'Apple',
      google: 'Google',
      loading: 'Cargando...',
      showPassword: 'Mostrar contrasena',
      hidePassword: 'Ocultar contrasena',
      passwordVisibilityHint:
        'Toca dos veces para alternar la visibilidad de la contrasena.',
      socialAuthUnavailable:
        'El acceso con Apple y Google todavia no esta conectado.',
      error: 'Error',
      unexpectedError: 'Ocurrió un error inesperado.',
    },
    login: {
      title: 'FitFlow AI',
      eyebrow: 'Acceso rápido',
      subtitle:
        'Vuelve a tu rutina de hoy, a tus últimos registros y al flujo de ejecución sin perder contexto.',
      helper:
        'Usa la cuenta ligada a tu historial para recuperar progreso y recomendaciones.',
      cta: 'Iniciar sesión',
      noAccountText: 'Nuevo en FitFlow AI?',
      noAccountLink: 'Regístrate',
      errorEmptyFields: 'Por favor, introduce tu email y contraseña.',
    },
    register: {
      title: 'FitFlow AI',
      eyebrow: 'Nueva cuenta',
      subtitle:
        'Crea una cuenta enfocada en entrenamiento antes de conectar rutinas, recuperación y sugerencias de IA.',
      helper:
        'Te enviaremos un correo de verificación antes de habilitar el resto del flujo.',
      cta: 'Registrarse',
      hasAccountText: 'Ya tienes cuenta?',
      hasAccountLink: 'Inicia sesión',
      errorEmptyFields: 'Por favor, completa todos los campos.',
      errorPasswordsDontMatch: 'Las contraseñas no coinciden.',
      errorPasswordWeak:
        'La contraseña debe tener al menos 8 caracteres, un número y una mayúscula.',
      emailVerificationSent:
        'Te hemos enviado un correo de confirmación. Por favor, revisa tu bandeja de entrada.',
      successTitle: '¡Registro exitoso!',
    },
    dashboard: {
      tabs: {
        home: 'Inicio',
        workout: 'Entrenar',
        stats: 'Analítica',
        profile: 'Perfil',
      },
      header: {
        eyebrow: 'Hoy',
        subtitle: 'Elige la sesión y empieza a entrenar.',
      },
      sessionSetup: {
        title: 'Ajusta la sesión de hoy',
      },
      today_workout: 'Listo para generar',
      time: 'min',
      focus: 'Energía',
      start_workout: 'Generar Entrenamiento',
      card: {
        title: 'Sesión en {{location}}',
        description: 'Ejecución a medida',
        summary: 'Tu sesión se generará considerando tu perfil, la ubicación elegida, duración y nivel de energía.',
      },
      weeklyStreak: {
        label: 'Consistencia',
        title: 'Progreso semanal',
        progressLabel_one: '{{count}} sesion',
        progressLabel_other: '{{count}} sesiones',
        loadingCaption: 'Cargando historial',
        loadingHelper: 'Estamos revisando tus ultimas sesiones completadas.',
        emptyCaption: 'Todavia no hay historial',
        emptyHelper: 'Completa tu primer entrenamiento para empezar a construir progreso semanal real.',
        captionReady: '{{count}} completadas en total',
        helperReady: 'Ultimo entrenamiento: {{name}}',
        daysLabel_one: '{{count}} dia activo',
        daysLabel_other: '{{count}} dias activos',
      },
      context: {
        locationLabel: '¿Dónde entrenas hoy?',
        durationLabel: 'Tiempo disponible',
        energyLabel: 'Nivel de energía',
        locationOptions: {
          gym: 'Gimnasio',
          home: 'Casa',
          street: 'Calle',
          park: 'Parque',
        },
        durationOptions: {
          short: '30 min',
          medium: '45 min',
          long: '60 min',
          extended: '90 min',
        },
        energyOptions: {
          low: 'Agotado',
          medium: 'Normal',
          high: 'A tope',
        },
      },
    },
    analytics: {
      loadingTitle: 'Cargando tu analitica',
      loadingBody: 'Estamos recuperando las ultimas sesiones completadas desde Firestore.',
      placeholderTitle: 'Todavia no hay sesiones completadas',
      placeholderBody:
        'Termina tu primer entrenamiento para desbloquear metricas reales de progreso e historial reciente.',
      metrics: {
        totalSessions: 'Sesiones completadas',
        thisWeek: 'Esta semana',
        activeDays: 'Dias activos',
      },
      recentTitle: 'Sesiones recientes',
      recentMeta: '{{location}} · {{date}}',
      recentSets: '{{completed}}/{{total}} sets',
    },
    profile: {
      title: 'Mi Perfil',
      loggedUser: 'Usuario conectado',
      noEmail: 'Sin correo asociado',
      logout: 'Cerrar sesión',
      logoutConfirmTitle: 'Cerrar sesión',
      logoutConfirmMessage: '¿Estás seguro de que deseas cerrar sesión?',
      logoutCancel: 'Cancelar',
      logoutConfirm: 'Sí, cerrar sesión',
      logoutError: 'No se pudo cerrar sesión.',
      sections: {
        training: 'Perfil de entrenamiento',
        account: 'Cuenta',
        preferences: 'Preferencias',
        support: 'Soporte',
      },
      training: {
        eyebrow: 'Firestore',
        loadingTitle: 'Preparando tu perfil base',
        loadingBody:
          'Estamos comprobando si tu perfil de entrenamiento existe en Firestore y creando el documento inicial si hace falta.',
        readyTitle: 'Perfil base listo',
        readyBody:
          'Este documento es el primer contrato persistido para el contexto de entrenamiento, ubicaciones preferidas y futuras restricciones de equipamiento.',
        errorTitle: 'La configuración del perfil requiere atención',
        errorBody:
          'No hemos podido cargar o crear tu perfil en Firestore. Reinténtalo antes de editar equipamiento o contextos de entrenamiento.',
        status: {
          loading: 'Comprobando',
          ready: 'Listo',
          error: 'Reintento necesario',
        },
        actions: {
          retry: 'Reintentar configuración',
        },
        fields: {
          experienceLevel: 'Nivel de experiencia',
          defaultLocation: 'Ubicación por defecto',
          preferredLocations: 'Ubicaciones preferidas',
          homeEquipment: 'Equipamiento en casa',
          contextProfiles: 'Contextos guardados',
        },
        experienceLevels: {
          beginner: 'Principiante',
          intermediate: 'Intermedio',
          advanced: 'Avanzado',
        },
        values: {
          empty: 'Aún sin definir',
          homeEquipmentCount_one: '{{count}} elemento configurado',
          homeEquipmentCount_other: '{{count}} elementos configurados',
          contextProfilesCount_one: '{{count}} contexto guardado',
          contextProfilesCount_other: '{{count}} contextos guardados',
        },
      },
      operational: {
        eyebrow: 'Perfil operativo',
        title: 'Configuración de entrenamiento utilizable',
        description:
          'Ajusta la base de entrenamiento antes de conectar la captura de contextos y la generación IA a restricciones reales.',
        summary_one: '{{count}} elemento en la configuración de casa',
        summary_other: '{{count}} elementos en la configuración de casa',
        save: 'Guardar perfil',
        saveError: 'No hemos podido guardar tu perfil operativo.',
        preferredLocationsHelper:
          'Estas ubicaciones dan defaults y atajos en producto, pero no bloquean otros contextos.',
        defaultLocationHelper:
          'Elige la ubicación que la app debe preseleccionar al preparar una nueva sesión.',
        homeEquipmentHelper:
          'Marca solo el equipamiento que realmente tienes en casa. Las capabilities específicas del contexto van fuera de este bloque.',
        contextProfilesSummary_one:
          '{{count}} contexto externo guardado. Los lugares externos se configuran en el bloque inferior.',
        contextProfilesSummary_other:
          '{{count}} contextos externos guardados. Los lugares externos se configuran en el bloque inferior.',
        groups: {
          experience: 'Nivel de experiencia',
          preferredLocations: 'Ubicaciones preferidas',
          defaultLocation: 'Ubicación por defecto',
          homeEquipment: 'Equipamiento en casa',
        },
        homeEquipmentOptions: {
          dumbbells: 'Mancuernas',
          barbell: 'Barra',
          bench: 'Banco',
          bands: 'Bandas',
          pullup_bar: 'Barra de dominadas',
          kettlebell: 'Kettlebell',
        },
      },
      options: {
        personalInfo: 'Información personal',
        theme: 'Tema',
        language: 'Idioma',
        help: 'Centro de ayuda',
        privacy: 'Política de privacidad',
      },
    },
    workout: {
      loading: {
        title: 'Preparando tu sesion',
        body: 'Estamos generando el entrenamiento y cargando el flujo de ejecucion.',
      },
      header: {
        activeLabel: 'Entrenamiento en curso',
        exerciseProgress: 'Ejercicio {{current}} de {{total}}',
        totalTimer: 'Sesión',
        exerciseTimer: 'Ejercicio',
        restTimer: 'Descanso',
      },
      exercise: {
        currentLabel: 'Ejercicio actual',
        alternativeAction: 'Ver alternativa',
        mediaPending:
          'La referencia visual sigue pendiente. Usa por ahora el nombre y la descripción del ejercicio.',
      },
      ai: {
        title: 'Soporte IA',
        recommendationLabel: 'Objetivo sugerido:',
        recommendation: '{{weight}} kg x {{reps}} reps',
        focusAdvice: '(Foco: {{focus}}). {{advice}}',
        pendingTitle: 'El feedback con IA aún no está conectado',
        pendingBody:
          'La guía personalizada aparecerá aquí cuando conectemos el flujo de recomendaciones.',
        pendingFeedbackBody:
          'Esta nota todavía no se envía a ningún sitio. Conectaremos esta acción cuando el flujo de IA esté disponible.',
        feedbackLabel: '¿Algo que ajustar?',
        feedbackPlaceholder:
          'Cuéntale a la IA si algo molesta, está inestable o no está disponible.',
        feedbackSubmit: 'Enviar a IA',
      },
      controls: {
        logSet: 'Guardar set',
        saveChanges: 'Guardar cambios',
        nextExercise: 'Siguiente ejercicio',
        finish: 'Finalizar entrenamiento',
        helperReady: 'Guarda el set actual cuando lo termines.',
        helperEditing:
          'Estás editando un set anterior. Guardar cambios no activará el descanso.',
        helperRest: 'El descanso sigue corriendo, pero ya puedes preparar el siguiente set.',
        helperFinished: 'Este ejercicio ya está completo. Avanza cuando quieras.',
      },
      rest: {
        title: 'TEMPORIZADOR DE DESCANSO',
        goal: 'Objetivo {{time}}',
        skip: 'Saltar descanso',
      },
      activeSet: {
        title: 'Registrar este set',
        editTitle: 'Editar set {{current}}',
        targetLabel: 'Objetivo',
        weightLabel: 'Peso',
        repsLabel: 'Repeticiones',
        repsUnit: 'reps',
        progress: 'Set {{current}} de {{total}}.',
        readyHelper: 'Ajusta el resultado antes de guardarlo.',
        editingHelper: 'Estás corrigiendo un set ya completado.',
        lockedHelper: 'Todos los sets de este ejercicio ya están completados.',
      },
      setStrip: {
        title: 'Sets',
        currentSetLabel: 'Set actual',
        collapse: 'Ocultar',
        expand: 'Revisar',
        summary: '{{completed}}/{{total}} completados',
        add: 'Añadir set',
        removeLast: 'Eliminar último',
        current: 'Actual',
        editing: 'Editando',
        completed: 'Hecho',
        pending: 'Pendiente',
      },
      feedback: {
        alternativeTitle: 'Alternativa solicitada',
        alternativeMessage:
          'Las alternativas aún no están disponibles. Esta acción se conectará cuando el flujo de recomendaciones esté listo.',
      },
      finish: {
        saveError: 'No hemos podido guardar este entrenamiento completado. Intentalo de nuevo antes de salir.',
      },
      generatedSession: {
        title: 'Sesion de {{goal}}',
        previewSummary:
          'Vista previa mostrada mientras la generacion en vivo no esta disponible.',
        goals: {
          strength: 'fuerza',
          hypertrophy: 'hipertrofia',
          conditioning: 'acondicionamiento',
          skill: 'habilidad',
          general_fitness: 'fitness general',
          fat_loss: 'perdida de grasa',
        },
        sources: {
          live_generated: 'IA en vivo',
          fallback_preview: 'Vista previa',
        },
        currentBlock: 'Bloque actual',
        blockProgress: 'Bloque {{current}} de {{total}}',
        exerciseFlow: 'Flujo del bloque',
        blockTypes: {
          straight_sets: 'Series rectas',
          superset: 'Superserie',
          triset: 'Triserie',
          circuit: 'Circuito',
          emom: 'EMOM',
        },
        cadence: {
          rounds_one: '{{count}} ronda',
          rounds_other: '{{count}} rondas',
          durationMinutes: '{{minutes}} min',
          intervalSeconds: 'Cada {{seconds}} s',
          restSeconds: '{{seconds}} s descanso',
        },
      },
      catalog: {
        exercises: {
          back_squat: {
            name: 'Sentadilla trasera',
            description: 'Patron de sentadilla con barra usado como ejercicio canonico de fuerza para tren inferior.',
          },
          leg_press: {
            name: 'Prensa de piernas',
            description: 'Variacion guiada de sentadilla para contextos de gimnasio con acceso a maquinas.',
          },
          push_up: {
            name: 'Flexiones',
            description: 'Empuje horizontal con peso corporal que no necesita equipamiento extra.',
          },
          dumbbell_floor_press: {
            name: 'Press en suelo con mancuernas',
            description: 'Opcion de empuje horizontal para casa cuando hay mancuernas pero no banco.',
          },
          dumbbell_bench_press: {
            name: 'Press banca con mancuernas',
            description: 'Press horizontal que requiere mancuernas y banco.',
          },
          band_row: {
            name: 'Remo con bandas',
            description: 'Variacion de traccion horizontal que solo depende de bandas elasticas.',
          },
          pull_up: {
            name: 'Dominadas',
            description: 'Ejercicio de traccion vertical que requiere barra de dominadas.',
          },
          kettlebell_swing: {
            name: 'Kettlebell swing',
            description: 'Ejercicio de bisagra y acondicionamiento que depende de una kettlebell.',
          },
          parallel_bar_dip: {
            name: 'Fondo en paralelas',
            description: 'Variacion de fondos que requiere acceso a barras paralelas.',
          },
          ring_row: {
            name: 'Remo en anillas',
            description: 'Opcion de traccion horizontal que depende de un anclaje para anillas.',
          },
        },
      },
      mock: {
        workoutName: 'Vista previa de sesión',
        exercises: {
          squat: {
            name: 'Sentadillas',
            description:
              'Bloque de ejecución de muestra mientras los planes reales de entrenamiento no están conectados.',
          },
          legPress: {
            name: 'Prensa de piernas',
            description:
              'Segundo ejercicio de muestra para validar el flujo de ejecución de punta a punta.',
          },
        },
      },
    },
    firebaseErrors: {
      'auth/email-already-in-use': 'El correo ya está en uso.',
      'auth/invalid-email': 'El correo no es válido.',
      'auth/user-not-found': 'Usuario no encontrado.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/invalid-credential': 'Credenciales inválidas. Por favor, revisa tus datos.',
      'auth/weak-password': 'La contraseña es muy débil.',
    },
  },
};

en.translation.profile.operational.contextProfilesSummary_one =
  '{{count}} saved external context. External places are configured in the block below.';
en.translation.profile.operational.contextProfilesSummary_other =
  '{{count}} saved external contexts. External places are configured in the block below.';
(en.translation.profile as any).logoutHint =
  'Open the confirmation dialog to sign out from this device.';
((en.translation.profile as any).operational as any).saveHint =
  'Save the current training preferences and home equipment.';
((en.translation.profile as any).operational as any).saveDisabledHint =
  'There are no profile changes to save yet.';
(en.translation.profile as any).contexts = {
  eyebrow: 'External contexts',
  title: 'Trim each place to what is really available',
  description:
    'Start from a broad template for each context and remove whatever your usual park or gym does not actually have.',
  summary_one: '{{count}} context already customized',
  summary_other: '{{count}} contexts already customized',
  save: 'Save contexts',
  saveError: 'We could not save your external contexts.',
  futureNote:
    'Street stays visible as a future context, but this V1 editor only closes park and gym.',
  status: {
    template: 'Base template',
    saved: 'Saved context',
  },
  helpers: {
    park:
      'Keep only the stations your usual park really offers. The default template starts broad on purpose.',
    gym:
      'Use this as the effective equipment baseline for your gym, not as a list of machines you own.',
  },
  capabilityOptions: {
    dumbbells: 'Dumbbells',
    barbell: 'Barbell',
    bench: 'Bench',
    bands: 'Bands',
    pullup_bar: 'Pull-up bar',
    kettlebell: 'Kettlebell',
    parallel_bars: 'Parallel bars',
    rings_anchor: 'Rings anchor',
    machine_access: 'Machine access',
  },
};

es.translation.profile.operational.contextProfilesSummary_one =
  '{{count}} contexto externo guardado. Los lugares externos se configuran en el bloque inferior.';
es.translation.profile.operational.contextProfilesSummary_other =
  '{{count}} contextos externos guardados. Los lugares externos se configuran en el bloque inferior.';
((es.translation.profile as any)).logoutHint =
  'Abre la confirmacion para cerrar sesion en este dispositivo.';
((es.translation.profile as any).operational as any).saveHint =
  'Guarda las preferencias de entrenamiento y el equipamiento de casa actuales.';
((es.translation.profile as any).operational as any).saveDisabledHint =
  'Todavia no hay cambios de perfil para guardar.';
(es.translation.profile as any).contexts = {
  eyebrow: 'Contextos externos',
  title: 'Recorta cada lugar a lo que de verdad tienes',
  description:
    'Partimos de una plantilla amplia por contexto y quitas lo que tu parque o gimnasio habitual no ofrece de verdad.',
  summary_one: '{{count}} contexto ya personalizado',
  summary_other: '{{count}} contextos ya personalizados',
  save: 'Guardar contextos',
  saveError: 'No hemos podido guardar tus contextos externos.',
  futureNote:
    'Calle queda visible como contexto futuro, pero este editor V1 solo cierra parque y gimnasio.',
  status: {
    template: 'Plantilla base',
    saved: 'Contexto guardado',
  },
  helpers: {
    park:
      'Deja solo las estaciones que tu parque habitual ofrece de verdad. La plantilla base arranca amplia a propÃ³sito.',
    gym:
      'Ãšsalo como baseline efectivo del gimnasio en el que entrenas, no como una lista de equipamiento que posees.',
  },
  capabilityOptions: {
    dumbbells: 'Mancuernas',
    barbell: 'Barra',
    bench: 'Banco',
    bands: 'Bandas',
    pullup_bar: 'Barra de dominadas',
    kettlebell: 'Kettlebell',
    parallel_bars: 'Paralelas',
    rings_anchor: 'Anclaje para anillas',
    machine_access: 'Acceso a mÃ¡quinas',
  },
};

(en.translation.profile as any).contexts.saveHint =
  'Save the current park and gym capability configuration.';
(en.translation.profile as any).contexts.saveDisabledHint =
  'There are no external context changes to save yet.';
(en.translation.workout.finish as any).saveTimeout =
  'We could not confirm the save right now. Check your connection and try again before leaving the screen.';
(es.translation.profile as any).contexts.saveHint =
  'Guarda la configuracion actual de capacidades para parque y gimnasio.';
(es.translation.profile as any).contexts.saveDisabledHint =
  'Todavia no hay cambios de contextos externos para guardar.';
(es.translation.workout.finish as any).saveTimeout =
  'No hemos podido confirmar el guardado ahora mismo. Revisa la conexion y vuelve a intentarlo antes de salir de esta pantalla.';

const systemLang = Localization.getLocales()[0]?.languageCode || 'es';
const supportedLangs = ['en', 'es'];
const initialLang = supportedLangs.includes(systemLang) ? systemLang : 'es';

i18n.use(initReactI18next).init({
  resources: {
    en,
    es,
  },
  lng: initialLang,
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

export const getFirebaseErrorMessage = (err: any) => {
  const code = err?.code || err?.error?.message || err?.message;
  if (!code) {
    return i18n.t('common.unexpectedError');
  }

  if (code === 'EMAIL_EXISTS' || code === 'auth/email-already-in-use') {
    return i18n.t('firebaseErrors.auth/email-already-in-use');
  }

  if (code === 'INVALID_EMAIL' || code === 'auth/invalid-email') {
    return i18n.t('firebaseErrors.auth/invalid-email');
  }

  if (code === 'INVALID_PASSWORD' || code === 'auth/wrong-password') {
    return i18n.t('firebaseErrors.auth/wrong-password');
  }

  const specificTranslation = i18n.t(`firebaseErrors.${code}` as any);
  if (specificTranslation !== `firebaseErrors.${code}`) {
    return specificTranslation;
  }

  return err.message || i18n.t('common.unexpectedError');
};

